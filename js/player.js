// Designed by: Mauricio Bucardo
// Original image: https://dribbble.com/shots/6957353-Music-Player-Widget
"use strict";
// add elemnts
const bgBody = [
  "linear-gradient(180deg, #e36b16 0%, #301b0c 75%, #020024 100%)",
  "linear-gradient(180deg, #02a4e2 0%, #1b295e 62%, #020024 100%)",
  "linear-gradient(180deg, #b09d8e 0%, #a98467 70%, #6c584c 97%)",
  "linear-gradient(180deg, #b7d1fc 0%, #333349 62%, #020024 90%)",
  "linear-gradient(180deg, #c78200 0%, #bb3e03 62%, #020024 100%)",
  "#020024",
  "linear-gradient(180deg, #000000 0%, #020024 62%, #f2e9e4 100%)",
  "linear-gradient(180deg, #000000 13%, #ffffff 100%)",
  "#020024",
  "linear-gradient(180deg, #004c5e 0%, #550800 70%, #983f55 97%)",
  "linear-gradient(180deg, #a98467 13%, #ffd166 100%)",
  "linear-gradient(180deg, #020024 40%, #ffb703 100%)",
  "#020024",
  "linear-gradient(180deg, #000000 0%,  #03045e 63%, #0077b6 100%)",
  "linear-gradient(180deg, #d4a373 20%, #e3d5ca 100%)",
];

const body = document.body;
const player = document.querySelector(".player");
const playerHeader = player.querySelector(".player__header");
const playerControls = player.querySelector(".player__controls");
const playerPlayList = player.querySelectorAll(".player__song");
const playerSongs = player.querySelectorAll(".audio");
const playButton = player.querySelector(".play");
const nextButton = player.querySelector(".next");
const backButton = player.querySelector(".back");
const playlistButton = player.querySelector(".playlist");
const slider = player.querySelector(".slider");
const sliderContext = player.querySelector(".slider__context");
const sliderName = sliderContext.querySelector(".slider__name");
const sliderTitle = sliderContext.querySelector(".slider__title");
const sliderContent = slider.querySelector(".slider__content");
const sliderContentLength = playerPlayList.length - 1;
const sliderWidth = 100;
let left = 0;
let count = 0;
let song = playerSongs[count];
let isPlay = false;
const pauseIcon = playButton.querySelector("img[alt = 'pause-icon']");
const playIcon = playButton.querySelector("img[alt = 'play-icon']");
const progres = player.querySelector(".progres");
const progresFilled = progres.querySelector(".progres__filled");
let isMove = false;

var vid = document.getElementById("audio");
vid.volume = 0.1;
// creat functions, if that functions are commented, the music don't play
function openPlayer() {
  playerHeader.classList.add("open-header");
  playerControls.classList.add("move");
  slider.classList.add("open-slider");
}
function closePlayer() {
  playerHeader.classList.remove("open-header");
  playerControls.classList.remove("move");
  slider.classList.remove("open-slider");
}
// Function to can move the songs, next or back
function next(index) {
  count = index || count;
  if (count == sliderContentLength) {
    count = count;
    return;
  }
  left = (count + 1) * sliderWidth;
  left = Math.min(left, sliderContentLength * sliderWidth);
  sliderContent.style.transform = `translate3d(-${left}%, 0, 0)`;
  count++;
  run();
}
function back(index) {
  count = index || count;
  if (count == 0) {
    count = count;
    return;
  }
  left = (count - 1) * sliderWidth;
  left = Math.max(0, left);
  sliderContent.style.transform = `translate3d(-${left}%, 0, 0)`;
  count--;
  run();
}
function changeSliderContext() {
  sliderContext.style.animationName = "opacity";
  sliderName.textContent =
    playerPlayList[count].querySelector(".player__title").textContent;
  sliderTitle.textContent =
    playerPlayList[count].querySelector(".player__song-name").textContent;
  if (sliderName.textContent.length > 16) {
    const textWrap = document.createElement("span");
    textWrap.className = "text-wrap";
    textWrap.innerHTML = sliderName.textContent + "  " + sliderName.textContent;
    sliderName.innerHTML = "";
    sliderName.append(textWrap);
  }
  if (sliderTitle.textContent.length >= 18) {
    const textWrap = document.createElement("span");
    textWrap.className = "text-wrap";
    textWrap.innerHTML =
      sliderTitle.textContent + "  " + sliderTitle.textContent;
    sliderTitle.innerHTML = "";
    sliderTitle.append(textWrap);
  }
}
function changeBgBody() {
  playerHeader.style.background = bgBody[count];
}
function selectSong() {
  song = playerSongs[count];
  for (const item of playerSongs) {
    if (item != song) {
      item.pause();
      item.currentTime = 0;
    }
  }
  if (isPlay) song.play();
}
function run() {
  changeSliderContext();
  changeBgBody();
  selectSong();
}
function playSong() {
  if (song.paused) {
    song.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    song.pause();
    isPlay = false;
    playIcon.style.display = "";
    pauseIcon.style.display = "";
  }
}
// If that function don't run, the progress bar don't move
function progresUpdate() {
  const progresFilledWidth = (this.currentTime / this.duration) * 100 + "%";
  progresFilled.style.width = progresFilledWidth;
  if (isPlay && this.duration == this.currentTime) {
    next();
  }
  if (count == sliderContentLength && song.currentTime == song.duration) {
    playIcon.style.display = "block";
    pauseIcon.style.display = "";
    isPlay = false;
  }
}
function scurb(e) {
  // If we use e.offsetX, we have trouble setting the song time, when the mousemove is running
  const currentTime =
    ((e.clientX - progres.getBoundingClientRect().left) / progres.offsetWidth) *
    song.duration;
  song.currentTime = currentTime;
}
function durationSongs() {
  let min = parseInt(this.duration / 60);
  if (min < 10) min = "0" + min;
  let sec = parseInt(this.duration % 60);
  if (sec < 10) sec = "0" + sec;
  const playerSongTime = `${min}:${sec}`;
  this.closest(".player__song")
    .querySelector(".player__song-time")
    .append(playerSongTime);
}
changeSliderContext();
// add events
sliderContext.addEventListener("click", openPlayer);
sliderContext.addEventListener(
  "animationend",
  () => (sliderContext.style.animationName = "")
);
playlistButton.addEventListener("click", closePlayer);
nextButton.addEventListener("click", () => {
  next(0);
});
backButton.addEventListener("click", () => {
  back(0);
});
playButton.addEventListener("click", () => {
  isPlay = true;
  playSong();
});
playerSongs.forEach((song) => {
  song.addEventListener("loadeddata", durationSongs);
  song.addEventListener("timeupdate", progresUpdate);
});
progres.addEventListener("pointerdown", (e) => {
  scurb(e);
  isMove = true;
});
document.addEventListener("pointermove", (e) => {
  if (isMove) {
    scurb(e);
    song.muted = true;
  }
});
document.addEventListener("pointerup", () => {
  isMove = false;
  song.muted = false;
});
playerPlayList.forEach((item, index) => {
  item.addEventListener("click", function () {
    if (index > count) {
      next(index - 1);
      return;
    }
    if (index < count) {
      back(index + 1);
      return;
    }
  });
});
