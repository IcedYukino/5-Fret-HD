document.addEventListener("DOMContentLoaded", () => {

let songs = [];
let currentTab = "gh";
let currentFile = "guitarhero";

loadSongs(currentFile);

function loadSongs(file){

fetch(`songlists/${file}.json`)
.then(response => response.json())
.then(data => {

songs = data;
applyFilter();

});

}

function applyFilter(){

const filtered = songs.filter(song =>
song.category === currentTab
);

displaySongs(filtered);

const count = document.getElementById("song-count");
if(count) count.innerText = filtered.length + " songs";

}

function displaySongs(songList){

const grid = document.getElementById("song-grid");
if(!grid) return;

grid.innerHTML = "";

songList.forEach(song => {

const card = document.createElement("div");
card.className = "song";

card.innerHTML = `
<img src="${song.cover}">
<h3>${song.title}</h3>
<p>${song.artist}</p>
`;

grid.appendChild(card);

});

}

window.switchTab = function(tab, file, button){

currentTab = tab;
currentFile = file;

document.querySelectorAll(".tab").forEach(btn=>{
btn.classList.remove("active");
});

button.classList.add("active");

loadSongs(file);

}

});
