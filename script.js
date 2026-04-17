// --------------------
// MUSIC + GATE CONTROL
// --------------------
const music = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const gate = document.getElementById("gate");
const enterBtn = document.getElementById("enterBtn");

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const BPM = 145;
const beatInterval = 60000 / BPM; // ~413ms

let beat = 0;

let isPlaying = false;

const maxScroll = 300;

if (window.scrollY > 320) {
  window.scrollTo(0, 320);
}


enterBtn.addEventListener("click", () => {
  gate.remove();

  music.volume = 0.5;
  music.play();

  isPlaying = true;
  muteBtn.innerText = "Mute";
  
  showSecondPopup();

  // START MOBILE BPM BOUNCE HERE
  if (isMobile) {
    setInterval(mobileBounce, beatInterval);
  }
});

muteBtn.addEventListener("click", () => {
  if (!isPlaying) {
    music.play();
    isPlaying = true;
    muteBtn.innerText = "Mute";
  } else {
    music.pause();
    isPlaying = false;
    muteBtn.innerText = "Play";
  }
});


document.getElementById("igLink").addEventListener("click", () => {
  window.open("https://www.instagram.com/mfera_0/", "_blank");
});

document.getElementById("beatLink").addEventListener("click", () => {
  window.open("https://www.beatstars.com/mfera", "_blank");
});

document.getElementById("contactLink").addEventListener("click", () => {
  window.location.href = "mailto:mfera8957@gmail.com";
});

//LOOPS AND BEATS POPUP
let popupTriggered = false;

function showSecondPopup() {
  if (popupTriggered) return;
  popupTriggered = true;

  setTimeout(() => {
    document.getElementById("secondPopup").style.display = "flex";
  }, 1500);
}

document.getElementById("dmBtn").addEventListener("click", () => {
  window.open("https://www.instagram.com/mfera_0/", "_blank");
});

const popup = document.getElementById("secondPopup");
const dmBtn = document.getElementById("dmBtn");
const box = popup.querySelector(".gate-box");

popup.addEventListener("click", (e) => {
  // if click is outside the box -> close
  if (!box.contains(e.target)) {
    popup.style.display = "none";
  }
});

// --------------------
// LETTER ANIMATION
// --------------------
const letters = ["F", "E", "R", "A"];

letters.forEach(l => {
  let f = 1;

  setInterval(() => {
    f = f === 1 ? 2 : 1;
    document.getElementById(l).src = `assets/${l}_${f}.png`;
  }, 400);
});


// --------------------
// BACKGROUND SWAP
// --------------------
const imgs = ["assets/sky_1.png", "assets/sky_2.png"];

let frame = 0;

const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");

let active = bg1;
let inactive = bg2;

active.style.backgroundImage = `url(${imgs[0]})`;
inactive.style.backgroundImage = `url(${imgs[1]})`;
inactive.style.opacity = 0;

setInterval(() => {
  frame = 1 - frame;

  inactive.style.backgroundImage = `url(${imgs[frame]})`;

  inactive.style.opacity = 1;
  active.style.opacity = 0;

  [active, inactive] = [inactive, active];
}, 1500);


// --------------------
// PARALLAX
// --------------------
let mx = 0, my = 0;
let cx = 0, cy = 0;

window.addEventListener("mousemove", e => {
  mx = (e.clientX / innerWidth) - 0.5;
  my = (e.clientY / innerHeight) - 0.5;
});

let scrollTarget = 0;
let scrollCurrent = 0;
let scrollVelocity = 0;

window.addEventListener("scroll", () => {
  const raw = window.scrollY;

  // clamp scroll input
  scrollTarget = Math.max(0, Math.min(raw, 300));
});

// per-layer physics (THIS is the missing part)
const letterStates = [];

function animate() {
  // --------------------
  // MOUSE SMOOTH
  // --------------------
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;

  // --------------------
  // SCROLL SPRING (global camera)
  // --------------------
  const scrollDelta = scrollTarget - scrollCurrent;
  scrollVelocity += scrollDelta * 0.18;
  scrollVelocity *= 0.72;
  scrollCurrent += scrollVelocity;

  // --------------------
  // BACKGROUND (unchanged good behavior)
  // --------------------
  active.style.transform =
    `translate(
      ${cx * 25}px,
      ${cy * 25 + scrollCurrent * 0.06}px
    ) scale(1.25)`;

  // --------------------
  // LETTERS (REAL ELASTIC LAG PER LETTER)
  // --------------------
  document.querySelectorAll(".letter-wrap").forEach((el, i) => {
    const depth = (i + 1) * 14;

    const targetX = cx * depth;
    const targetY = cy * depth + scrollCurrent * (0.08 + i * 0.04);

    // init state per letter
    if (!letterStates[i]) {
      letterStates[i] = { x: 0, y: 0, vx: 0, vy: 0 };
    }

    const s = letterStates[i];

    // spring physics (overexaggerated on purpose)
    const forceX = (targetX - s.x) * 0.15;
    const forceY = (targetY - s.y) * 0.15;

    s.vx = (s.vx + forceX) * 0.78;
    s.vy = (s.vy + forceY) * 0.78;

    s.x += s.vx;
    s.y += s.vy;

    el.style.transform =
      `translate(${s.x}px, ${s.y}px)`;
  });

  requestAnimationFrame(animate);
}

animate();


function mobileBounce() {
  if (!isMobile) return;

  const letters = document.querySelectorAll(".letter");

  letters.forEach((el, i) => {
    const delay = i * 60; // stagger per letter

    setTimeout(() => {
      el.style.transform = "scale(1.18)";
      el.style.filter = "drop-shadow(0 18px 40px rgba(0,0,0,0.45))";

      setTimeout(() => {
        el.style.transform = "scale(1)";
      }, beatInterval * 0.5);
    }, delay);
  });

  beat++;
}




// --------------------
// BUTTERFLY STATE
// --------------------
const butterfly = document.getElementById("butterfly");

let bx = window.innerWidth / 2;
let by = window.innerHeight / 2;

let vx = 0;
let vy = 0;

let targetX = bx;
let targetY = by;

// cursor tracking
window.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// --------------------
// 2-FRAME ANIMATION
// --------------------
let butterflyFrame = 1;

setInterval(() => {
  butterflyFrame = butterflyFrame === 1 ? 2 : 1;
  butterfly.src = `assets/butterfly_${butterflyFrame}.png`;
}, 180);

// --------------------
// PHYSICS LOOP
// --------------------
function animateButterfly() {

  const dx = targetX - bx;
  const dy = targetY - by;

  // slower spring force (key change)
  vx += dx * 0.003;
  vy += dy * 0.003;

  // more damping = smoother + slower response
  vx *= 0.82;
  vy *= 0.82;

  bx += vx;
  by += vy;

  const wobbleX = Math.sin(Date.now() * 0.004) * 5;
  const wobbleY = Math.cos(Date.now() * 0.0035) * 5;

  butterfly.style.transform =
    `translate(${bx + wobbleX}px, ${by + wobbleY}px)`;

  requestAnimationFrame(animateButterfly);
}

animateButterfly();
