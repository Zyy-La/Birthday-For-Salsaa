console.log("JS LOADED");

/* ================= SECTION SYSTEM (FIX FINAL) ================= */

let messageMusicStarted = false;
let messageMusicTime = 0;
let currentSection = null;
let isInMusicMenu = false;
let typingTimeout = null;
let isTyping = false;
const sectionOrder = ["opening", "message", "gallery", "music", "game"];
function ensureMessageMusic(){
  const music = document.getElementById("bgMusic");
  if(!music) return;

  if(!messageMusicStarted){
    music.src = "musics/LOVE.mp3";
    music.play();
    messageMusicStarted = true;
  }
}

window.showSection = function(id){
  console.log("MASUK SECTION:", id);

  // 🔥 INI YANG KURANG
  currentSection = id;
  // stop typing
  if (window.typingTimer) {
    clearInterval(window.typingTimer);
  }
  isTyping = false;
if (typingTimeout) {
  clearTimeout(typingTimeout);
}
  // pindah section
  document.querySelectorAll("section").forEach(sec=>{
    sec.classList.remove("active");
  });

  const target = document.getElementById(id);
  if(target) target.classList.add("active");

  // background opening
  if(id === "opening"){
    document.body.classList.add("opening-bg");
  }else{
    document.body.classList.remove("opening-bg");
  }

  // ===== TETRIS CONTROL =====
  if(id === "game"){
    startTetris();
  }else{
    stopTetris();
  }

  // ===== GALLERY CONTROL =====
  if(id === "gallery"){

  startGallery();

} else {

  galleryRunning = false;
  currentPhoto = 0;

  const container = document.getElementById("photoContainer");
  if(container) container.innerHTML = "";
}
  const music = document.getElementById("bgMusic");
  if(!music) return;

  // ===== MESSAGE =====
  if (id === "message") {
    ensureMessageMusic();
    requestAnimationFrame(() => {
      startMessageTyping();
    });
  }

  // ===== MUSIC MENU =====
if (id === "music") {
  isInMusicMenu = true;

  // 🔥 simpan posisi lagu opening
  if (music.src.includes("LOVE.mp3")) {
    messageMusicTime = music.currentTime;
  }

  music.pause();
  loadSong(index);
}
 else {
  isInMusicMenu = false;

  if (messageMusicStarted) {

    // 🔥 balik ke lagu opening
    if (!music.src.includes("LOVE.mp3")) {
      music.src = "musics/LOVE.mp3";

      // ⬇️ kembalikan posisi terakhir
      music.currentTime = messageMusicTime;
    }

    music.play();
  }
}
};

/* ================= GALLERY ================= */

const mediaList = [
  { type: "image", src: "images/1.jpeg" },
  { type: "image", src: "images/2.jpeg" },
  { type: "image", src: "images/3.jpeg" },
  { type: "image", src: "images/4.jpeg" },
  { type: "video", src: "videos/vid1.mp4" },
];

let currentPhoto = 0;
let galleryRunning = false;

window.startGallery = function(){

  const container = document.getElementById("photoContainer");
  const statusText = document.getElementById("status");
  const frameBox = document.querySelector(".photo-frame");

  if(galleryRunning) return;
  galleryRunning = true;

  container.innerHTML = "";
  currentPhoto = 0;

  printNextPhoto(container, statusText, frameBox);
};

function printNextPhoto(container, statusText, frameBox){

  if(!galleryRunning) return;

  if(currentPhoto >= mediaList.length){
    statusText.innerText = "Semua kenangan selesai ❤️";
    galleryRunning = false;
    return;
  }

  const item = mediaList[currentPhoto];

  const frame = document.createElement("div");
  frame.className = "print-photo";

  container.appendChild(frame);

  setTimeout(()=>{
    frameBox.scrollTo({top:frameBox.scrollHeight,behavior:"smooth"});
  },100);

  // ================= IMAGE =================
  if(item.type === "image"){

    const img = document.createElement("img");
    img.src = item.src;

    const mask = document.createElement("div");
    mask.className = "mask";

    frame.appendChild(img);
    frame.appendChild(mask);

    let percent = 0;

    const interval = setInterval(()=>{

      if(!galleryRunning){
        clearInterval(interval);
        return;
      }

      percent += 1;
      mask.style.height = (100-percent) + "%";
      statusText.innerText = `Mencetak foto ${currentPhoto+1} (${percent}%)`;

      if(percent >= 100){
        clearInterval(interval);
        currentPhoto++;
        setTimeout(()=>printNextPhoto(container, statusText, frameBox),500);
      }

    },30);
  }

  // ================= VIDEO =================
  if(item.type === "video"){

    const video = document.createElement("video");
    video.src = item.src;
    video.controls = true;
    video.style.width = "100%";
    video.autoplay = true;

    frame.appendChild(video);

    statusText.innerText = `Memutar video ${currentPhoto+1} 🎬`;

    const music = document.getElementById("bgMusic");

    // ▶️ saat video play → pause musik
    video.addEventListener("play", () => {
      if(music && !music.paused){
        messageMusicTime = music.currentTime;
        music.pause();
      }
    });

    // 🔚 saat video selesai → lanjut musik + next
    video.addEventListener("ended", () => {
      if(music && messageMusicStarted){
        music.currentTime = messageMusicTime;
        music.play();
      }

      currentPhoto++;
      setTimeout(()=>printNextPhoto(container, statusText, frameBox),500);
    });

    // ⏸ kalau di-pause manual → lanjut musik
    video.addEventListener("pause", () => {
      if(music && messageMusicStarted){
        music.currentTime = messageMusicTime;
        music.play();
      }
    });
  }
}

/* ================= MUSIC ================= */

const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");
const progress = document.getElementById("progress");

const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

let songs = [
{title:"Pasilyo",artist:"Sunkissed Lola",src:"musics/song1.mp3",cover:"imagesmusic/cover1.jpg"},
{title:"Here With Me",artist:"d4vd",src:"musics/song2.mp3",cover:"imagesmusic/cover2.jpg"},
{title:"Abadi",artist:"Dendi Nata",src:"musics/song.mp3",cover:"imagesmusic/cover3.jpg"},
{title:"To The Bone",artist:"Pamungkas",src:"musics/song4.mp3",cover:"imagesmusic/cover4.jpg"}
];

let index = 0;

function loadSong(i){
  music.src = songs[i].src;
  songTitle.innerText = songs[i].title;
  artist.innerText = songs[i].artist;
  cover.src = songs[i].cover;
}

loadSong(index);

btn.onclick = ()=>{
  if(music.paused){
    music.play();
    btn.innerText="⏸";
  } else {
    music.pause();
    btn.innerText="▶";
  }
};

document.getElementById("nextMusic").onclick = ()=>{
  index = (index+1) % songs.length;
  loadSong(index);
  music.play();
  btn.innerText="⏸";
};

document.getElementById("prevMusic").onclick = ()=>{
  index = (index-1 + songs.length) % songs.length;
  loadSong(index);
  music.play();
  btn.innerText="⏸";
};

music.addEventListener("timeupdate",()=>{
  progress.value = (music.currentTime/music.duration)*100 || 0;
  current.textContent = formatTime(music.currentTime);
});

music.addEventListener("loadedmetadata",()=>{
  duration.textContent = formatTime(music.duration);
});

progress.oninput = ()=>{
  music.currentTime = (progress.value/100)*music.duration;
};

function formatTime(t){
  let m = Math.floor(t/60);
  let s = Math.floor(t%60);
  if(s<10) s="0"+s;
  return m+":"+s;
}

/* ================= TETRIS CORE ================= */

const COLS = 12;
const ROWS = 22;
const SIZE = 26;

const COLORS = {
  1:"#00FFFF",2:"#0000FF",3:"#FFA500",
  4:"#FFFF00",5:"#00FF00",6:"#AA00FF",7:"#FF0000"
};

const SHAPES = [
  [],
  [[1,1,1,1]],
  [[2,0,0],[2,2,2]],
  [[0,0,3],[3,3,3]],
  [[4,4],[4,4]],
  [[0,5,5],[5,5,0]],
  [[0,6,0],[6,6,6]],
  [[7,7,0],[0,7,7]]
];

let arena, player;
let animationId = null;
let gameIsOver = false;
let dropInt = 700, last = 0, acc = 0;
let score = 0, level = 1;

let canvas, ctx, scoreEl, levelEl;

/* ================= CORE FUNCTION ================= */

function matrix(w,h){
  return Array.from({length:h},()=>Array(w).fill(0));
}

function initGame(){
  arena = matrix(COLS,ROWS);
  player = {pos:{x:0,y:0},matrix:null};

  score = 0;
  level = 1;
  dropInt = 80;

  gameIsOver = false;
  last = 0;
  acc = 0;

  scoreEl.textContent = 0;
  levelEl.textContent = 1;

  cancelAnimationFrame(animationId);
}

function drawBlock(x, y, c){
  ctx.fillStyle = c;
  ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
  ctx.strokeStyle = "#0f380f";
  ctx.lineWidth = 2;
  ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function draw(){
  ctx.fillStyle="#051f35";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle="rgba(255,255,255,0.08)";
  for(let x=0;x<COLS;x++){
    for(let y=0;y<ROWS;y++){
      ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
    }
  }

  arena.forEach((r,y)=>
    r.forEach((v,x)=>v&&drawBlock(x,y,COLORS[v]))
  );

  player.matrix.forEach((r,y)=>
    r.forEach((v,x)=>
      v && drawBlock(x+player.pos.x,y+player.pos.y,COLORS[v])
    )
  );
}

function collide(){
  for(let y=0;y<player.matrix.length;y++){
    for(let x=0;x<player.matrix[y].length;x++){
      if(player.matrix[y][x] &&
        (arena[y+player.pos.y]?.[x+player.pos.x])!==0){
        return true;
      }
    }
  }
  return false;
}

function merge(){
  player.matrix.forEach((r,y)=>
    r.forEach((v,x)=>{
      if(v) arena[y+player.pos.y][x+player.pos.x]=v;
    })
  );
}

function rotate(m){
  return m[0].map((_,i)=>m.map(r=>r[i])).reverse();
}

function resetPlayer(){
  const t = Math.floor(Math.random()*7)+1;
  player.matrix = SHAPES[t];
  player.pos.y = 0;
  player.pos.x = (COLS/2|0)-(player.matrix[0].length/2|0);
  if(collide()) gameOver();
}

function sweep(){
  let c=0;
  for(let y=ROWS-1;y>=0;y--){
    if(arena[y].every(v=>v)){
      arena.splice(y,1);
      arena.unshift(new Array(COLS).fill(0));
      y++; c++;
    }
  }
  if(c){
    score += c*10;
    level = Math.floor(score/80)+1;
    dropInt = 150 - (level*8);
    scoreEl.textContent = score;
    levelEl.textContent = level;
  }
}

function drop(){
  player.pos.y++;
  if(collide()){
    player.pos.y--;
    merge();
    sweep();
    resetPlayer();
  }
}

function update(t=0){
  if(gameIsOver) return;

  acc += t-last;
  last = t;

  if(acc > dropInt){
    drop();
    acc = 0;
  }

  draw();
  animationId = requestAnimationFrame(update);
}

/* ================= GAME CONTROL ================= */

function gameOver(){
  gameIsOver = true;
  cancelAnimationFrame(animationId);

  const screen = document.getElementById("gameOverScreen");
  const msg = document.getElementById("goMsg");
  const backBtn = document.getElementById("backBtn");
  const resetBtn = document.getElementById("resetBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  screen.style.display = "flex";

  // reset kondisi tombol seperti awal
  title.style.display = "block";
  msg.style.display = "none";
  backBtn.style.display = "none";
  resetBtn.style.display = "none";
  confirmBtn.style.display = "inline-block";

   document.getElementById("gameOverScreen").style.display = "flex";
}

window.startTetris = function(){
  const title = document.getElementById("goTitle");
  const screen = document.getElementById("gameOverScreen");
  const msg = document.getElementById("goMsg");
  const backBtn = document.getElementById("backBtn");
  const resetBtn = document.getElementById("resetBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  // 🔥 reset state tombol SEBELUM game mulai
  title.style.display = "block";
  screen.style.display = "none";
  msg.style.display = "none";
  backBtn.style.display = "none";
  resetBtn.style.display = "none";
  confirmBtn.style.display = "inline-block";

  initGame();
  resetPlayer();
  gameIsOver = false;
  update();
};

window.stopTetris = function(){
  gameIsOver = true;
  cancelAnimationFrame(animationId);
};


/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", function () {

  canvas = document.getElementById("tetris");
  ctx = canvas.getContext("2d");
  canvas.width = COLS * SIZE;
  canvas.height = ROWS * SIZE;

  scoreEl = document.getElementById("score");
  levelEl = document.getElementById("level");

  const confirmBtn = document.getElementById("confirmBtn");
  const backBtn = document.getElementById("backBtn");
  const resetBtn = document.getElementById("resetBtn");
  const msg = document.getElementById("goMsg");
  const screen = document.getElementById("gameOverScreen");

  confirmBtn.onclick = function(){
    document.getElementById("goTitle").style.display = "none";
    msg.style.display = "block";
    backBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";
    this.style.display = "none";
  };

 backBtn.onclick = function(){
  screen.style.display = "none";

  const currentIndex = sectionOrder.indexOf(currentSection);

  if (currentIndex > 0) {
    showSection(sectionOrder[currentIndex - 1]);
  } else {
    showSection("opening");
  }
};

  resetBtn.onclick = function(){
    screen.style.display = "none";
    stopTetris();
    startTetris();
  };

  window.addEventListener("keydown",e=>{
    if(gameIsOver) return;

    if(e.key==="ArrowLeft"){
      player.pos.x--;
      if(collide()) player.pos.x++;
    }
    if(e.key==="ArrowRight"){
      player.pos.x++;
      if(collide()) player.pos.x--;
    }
    if(e.key==="ArrowDown") drop();
    if(e.key==="ArrowUp"){
      const old = player.matrix;
      player.matrix = rotate(player.matrix);
      if(collide()) player.matrix = old;
    }
  });

});



// ================= INIT =================

// jalankan opening saat pertama load
window.addEventListener("DOMContentLoaded", () => {
  showSection("opening");
});



// ================= TYPING EFFECT =================

function startMessageTyping(){

  const bubble = document.querySelector("#message .chat-bubble");
  if (!bubble) return;

  // 🔥 STOP typing sebelumnya
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  isTyping = true;
  bubble.innerHTML = "";

  const text = `Hai Sa, Apa kabar?||
udah lama aku ga tahu gimana kabarmu, maybe 1 tahun lebih ga sih? wkwkk.
Mungkin ini kerasa kaya tiba" sa tapi...||

HAPPY BIRTHDAYYYY!!!||

aku tau kok kita udah asing selama ini, tapi bukan berarti aku ga boleh ngucapin selamat ke kamu kan?wwkwk|

maaf ya aku ga bisa ngungkapin hal ini secara langsung, aku tahu dulu hubungan kita bisa selesai juga gara" salahku...||

But...|
Hari ini izinin aku buat ngucapin selamat ya? ||

Aku selalu berdoa yang terbaik untukmu|, semoga semua keinginanmu dapat tercapai dan terwujud, kamu tuh keren banget sumpah. udah bisa sampai ke titik terjauh ini,|| apalagi yang kocak-kocak dan gak biasa wkwk, karena kamu sendiri tuh lumcu abies kan orang e AWOKAOWAKAWOK.||

Makasih ya karena udah pernah jadi part terbaik dari jalan hidupku|, aku ga pernah nyesel, dan selalu merasa bersyukur karena udah pernah dipertemukan sama kamu....||

I Love You||
Form: Danu yang baik hati dan rajin menabung 😹`;

  let i = 0;

  function type(){

    if (!isTyping) return; // 🔥 kalau dihentikan

    if(i >= text.length){
      isTyping = false;
      return;
    }

    // jeda
    if(text[i] === "|"){
      let pause = 800;

      if(text[i+1] === "|"){
        pause = 1500;
        i++;
      }

      i++;
      typingTimeout = setTimeout(type, pause);
      return;
    }

    // ketik
    bubble.innerHTML += text[i] === "\n" ? "<br>" : text[i];
    bubble.scrollTop = bubble.scrollHeight;

    i++;
    typingTimeout = setTimeout(type, 58);
  }

  type();
}
/* ================= BUTTON CONTROL (FIX FINAL) ================= */

window.moveLeft = function(){
  if(gameIsOver) return;
  player.pos.x--;
  if(collide()) player.pos.x++;
  draw();
};

window.moveRight = function(){
  if(gameIsOver) return;
  player.pos.x++;
  if(collide()) player.pos.x--;
  draw();
};

window.rotatePiece = function(){
  if(gameIsOver) return;
  const old = player.matrix;
  player.matrix = rotate(player.matrix);
  if(collide()) player.matrix = old;
  draw();
};

window.dropPiece = function(){
  if(gameIsOver) return;
  drop();
  draw();
};

document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  // cara 1 (paling simpel & stabil)
  music.loop = true;

  // cara 2 (opsional, kalau mau kontrol manual)
  music.addEventListener("ended", () => {
    music.currentTime = 0;
    music.play();
  });
});
