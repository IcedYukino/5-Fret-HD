let songs = [];
let currentTab = "all";
let sortDirection = 1;

window.addEventListener("DOMContentLoaded", async () => {
    await loadSongs("all");
});

async function loadSongs(tab){

    let files = [];

    if(tab === "gh"){
        files = ["guitarhero"];
    }
    else if(tab === "gh2"){
        files = ["guitarhero2"];
    }
    else if(tab === "ghwor"){
        files = ["guitarherowarriorsofrock"];
    }
    else if(tab === "ghwordlc"){
        files = ["guitarherowarriorsofrockdlc"];
    }
    else if(tab === "rb1dlc"){
        files = ["rockbanddlc"];
    }    
    else if(tab === "all"){

        try{
            const index = await fetch("./songlists/index.json");
            files = await index.json();
        }catch(err){
            console.error("Failed to load index.json", err);
            return;
        }

    }

    let loadedSongs = [];

    for(const file of files){

        try{

            const res = await fetch(`./songlists/${file}.json`);

            if(!res.ok){
                console.warn(`Missing file: ${file}.json`);
                continue;
            }

            const data = await res.json();

            loadedSongs.push(...data);

        }catch(err){

            console.warn(`Error loading ${file}.json`, err);

        }

    }

    songs = loadedSongs;

    // automatically sort A → Z when loading
    songs.sort((a,b)=>a.title.localeCompare(b.title));

    displaySongs(songs);

    const counter = document.getElementById("song-count");
    if(counter){
        counter.innerText = songs.length + " songs";
    }

}

function displaySongs(songList){

    const grid = document.getElementById("song-grid");

    if(!grid) return;

    grid.innerHTML = "";

    songList.forEach(song => {

        const card = document.createElement("div");
        card.className = "song";

        const rating = song.rating || "NR";

        card.innerHTML = `
            <img src="${song.cover}">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>

<div class="genre-row">

    ${song.source ? `<img class="source-icon" src="./assets/${song.source}.png">` : ""}

    <span class="genre-tag ${song.genre.toLowerCase().replace(/[^a-z]/g,'')}">
        ${song.genre}
    </span>

    <span class="song-rating ${rating}">
        ${rating}
    </span>

</div>

            <div class="difficulty-dropdown">

                <div class="instrument">
                    <span>Guitar</span>
                    ${createDifficulty(song.difficulty?.guitar)}
                </div>

                <div class="instrument">
                    <span>Bass</span>
                    ${createDifficulty(song.difficulty?.bass)}
                </div>

                <div class="instrument">
                    <span>Drums</span>
                    ${createDifficulty(song.difficulty?.drums)}
                </div>

                <div class="instrument">
                    <span>Vocals</span>
                    ${createDifficulty(song.difficulty?.vocals)}
                </div>

            </div>
        `;

        grid.appendChild(card);

        card.addEventListener("click", () => {

            const dropdown = card.querySelector(".difficulty-dropdown");
            dropdown.classList.toggle("open");

        });

    });

}

function createDifficulty(level){

    if(level === undefined || level === null || level === -1){
        return `<div class="no-part">NO PART</div>`;
    }

    let bars = "";

    for(let i = 1; i <= 5; i++){

        if(level === 6){
            bars += `<div class="diff red"></div>`;
        }
        else if(i <= level){
            bars += `<div class="diff filled"></div>`;
        }
        else{
            bars += `<div class="diff"></div>`;
        }

    }

    return `<div class="diff-row">${bars}</div>`;

}

function searchSongs(){

    const input = document.getElementById("search").value.toLowerCase();

    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(input) ||
        song.artist.toLowerCase().includes(input)
    );

    displaySongs(filtered);

    const counter = document.getElementById("song-count");
    if(counter){
        counter.innerText = filtered.length + " songs";
    }

}

function sortSongs(type){

    songs.sort((a,b)=>{

        const A = (a[type] || "").toLowerCase();
        const B = (b[type] || "").toLowerCase();

        if(A < B) return -1 * sortDirection;
        if(A > B) return 1 * sortDirection;

        return 0;

    });

    displaySongs(songs);

    // toggle direction
    sortDirection *= -1;

}

async function switchTab(tab, button){

    currentTab = tab;

    document.querySelectorAll(".tab").forEach(btn=>{
        btn.classList.remove("active");
    });

    button.classList.add("active");

    await loadSongs(tab);

}

window.addEventListener("DOMContentLoaded", () => {

    const randomBtn = document.getElementById("randomSong");

    if(!randomBtn) return;

    randomBtn.addEventListener("click", () => {

        if(songs.length === 0) return;

        const random = songs[Math.floor(Math.random() * songs.length)];

        displaySongs(songs);

        setTimeout(()=>{

            const cards = document.querySelectorAll(".song");

            cards.forEach(card=>{

                if(card.querySelector("h3").innerText === random.title){

                    card.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });

                    card.style.boxShadow = "0 0 25px #0aa3ff";

                    const dropdown = card.querySelector(".difficulty-dropdown");
                    dropdown.classList.add("open");

                }

            });

        },100);

    });

});
