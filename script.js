let songs = [];
let currentTab = "guitarhero";

loadSongs(currentTab);

function loadSongs(list){

fetch(`songlists/${list}.json`)
.then(response => response.json())
.then(data => {

songs = data;
displaySongs(songs);

});

}

function displaySongs(songList){

const grid = document.getElementById("song-grid");
grid.innerHTML = "";

const filtered = songList.filter(song =>
song.category === currentTab
);

document.getElementById("song-count").innerText =
filtered.length + " songs";

filtered.forEach(song => {

const card = document.createElement("div");
card.className = "song";

const rating = song.rating || "NR";

card.innerHTML = `
<img src="${song.cover}">

<h3>${song.title}</h3>
<p>${song.artist}</p>

<div class="genre-row">

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

function createDifficulty(level) {

if(level === undefined || level === null || level === -1){
return `<div class="no-part">NO PART</div>`;
}

let bars = "";

for (let i = 1; i <= 5; i++) {

if (level === 6) {
bars += `<div class="diff red"></div>`;
}
else if (i <= level) {
bars += `<div class="diff filled"></div>`;
}
else {
bars += `<div class="diff"></div>`;
}

}

return `<div class="diff-row">${bars}</div>`;

}

function searchSongs(){

const input = document.getElementById("search").value.toLowerCase();

const filtered = songs.filter(song =>
(song.title.toLowerCase().includes(input) ||
song.artist.toLowerCase().includes(input))
);

displaySongs(filtered);

}

function switchTab(tab, button){

currentTab = tab;

document.querySelectorAll(".tab").forEach(btn=>{
btn.classList.remove("active");
});

button.classList.add("active");

loadSongs(tab);

}

document.getElementById("randomSong").addEventListener("click", () => {

const filtered = songList; === currentTab);

const random = visibleSongs[Math.floor(Math.random() * visibleSongs.length)];

displaySongs(visibleSongs);

setTimeout(() => {

const cards = document.querySelectorAll(".song");

cards.forEach(card => {

if(card.querySelector("h3").innerText === random.title){

card.scrollIntoView({
behavior: "smooth",
block: "center"
});

card.style.boxShadow = "0 0 25px #0aa3ff";

const dropdown = card.querySelector(".difficulty-dropdown");
dropdown.classList.add("open");

}

});

}, 100);

});
