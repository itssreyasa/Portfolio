/* ===== EDITABLE CONTENT ===== */
const QUIZ = [
  { q: "What is Sreyas studying?", a: ["B.Tech CSE (AI & ML)", "Mechanical Engineering", "BBA", "Physics"], c: 0 },
  { q: "What technology is Sreyas currently learning?", a: ["Python", "Rust", "Swift", "PHP"], c: 0 },
  { q: "Which type of music does Sreyas enjoy?", a: ["Rap & melody", "Only classical", "Only rock", "Only jazz"], c: 0 },
  { q: "Which film industry does Sreyas mostly watch?", a: ["Malayalam cinema", "French cinema", "Japanese cinema", "Only Hollywood"], c: 0 },
  { q: "What is Sreyas curious about building?", a: ["An AI chatbot", "A racing car", "A music studio", "A drone"], c: 0 },
  { q: "What does Sreyas enjoy designing?", a: ["Websites and social media content", "Cars", "Buildings", "Clothing"], c: 0 },
  { q: "What school activity first introduced Sreyas to technology?", a: ["Little KITEs", "School football team", "Music club", "Debate club"], c: 0 }
];
const RESULTS = [ // minimum score -> message (checked from top)
  [7, "Tech Explorer", "Perfect run. You really explored."],
  [5, "Tech Explorer", "Looks like you were paying attention."],
  [3, "Side Quester", "Good start. Scroll back up for the missing pieces."],
  [0, "New Player", "Level 01 for you too. Explore the world again?"]
];
const BOOT_LINES = ["Loading personality...", "Loading curiosity...", "Loading creativity...", "Loading technology...", "Loading next level..."];

/* ===== HELPERS ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
document.documentElement.classList.add("js");

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ===== BOOT SEQUENCE ===== */
function boot() {
  const boot = $("#boot"), line = $("#boot-line"), bar = $("#boot-bar");
  const step = reduced ? 80 : 380;
  BOOT_LINES.forEach((txt, i) => setTimeout(() => {
    line.textContent = txt; bar.style.width = ((i + 1) / BOOT_LINES.length * 100) + "%";
  }, i * step));
  setTimeout(() => { line.hidden = true; $(".bar").hidden = true; $("#boot-name").hidden = false; }, BOOT_LINES.length * step);
  setTimeout(() => { boot.classList.add("done"); init(); toast("Level 01 unlocked: Home"); }, BOOT_LINES.length * step + (reduced ? 300 : 1300));
}

/* ===== NAV ===== */
function initNav() {
  const nav = $("#nav"), btn = $("#menu-btn");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open); btn.textContent = open ? "Close" : "Menu";
  });
  $$("a", nav).forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); btn.textContent = "Menu"; }));
  // Highlight link of the section currently in view
  const ids = $$("nav a").map(a => $(a.getAttribute("href")));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + (e.target.id === "gallery" ? "interests" : e.target.id)));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ids.concat($("#gallery")).forEach(s => s && io.observe(s));
}

/* ===== SCROLL REVEAL + END SCREEN ===== */
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".reveal").forEach(el => io.observe(el));
  new IntersectionObserver(([e]) => { if (e.isIntersecting) $("#end").classList.add("show"); }, { threshold: .6 }).observe($("#end"));
}

/* ===== JOURNEY: progress line, level unlock, portrait swap ===== */
function initJourney() {
  const items = $$(".levels li"), fill = $("#track-fill"), img = $("#journey-img"), wrap = $(".journey");
  const update = () => {
    const r = wrap.getBoundingClientRect(), vh = innerHeight;
    fill.style.height = Math.max(0, Math.min(1, (vh * .6 - r.top) / r.height)) * 100 + "%";
    let current = null;
    items.forEach(li => {
      const t = li.getBoundingClientRect().top;
      const on = t < vh * .7; li.classList.toggle("on", on);
      if (on) current = li;
    });
    if (current && img.dataset.src !== current.dataset.img) {
      img.dataset.src = current.dataset.img; img.src = current.dataset.img;
      if (!current.dataset.seen) { current.dataset.seen = 1; toast("Unlocked: " + $("h3", current).textContent.split("—").pop().trim()); }
    }
  };
  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true }); update();
}

/* ===== MUSIC PLAYER (visual only, no audio) ===== */
function initPlayer() {
  const wave = $("#wave"), player = $(".player"), btn = $("#play"), fill = $("#prog-fill");
  for (let i = 0; i < 36; i++) wave.appendChild(document.createElement("i"));
  const bars = $$("i", wave); let playing = false, p = 0, last = 0;
  bars.forEach((b, i) => b.style.height = 15 + Math.abs(Math.sin(i)) * 30 + "%");
  function tick(t) {
    if (!playing) return;
    if (t - last > 90) { last = t; bars.forEach(b => b.style.height = 12 + Math.random() * 88 + "%"); }
    p = (p + .0006) % 1; fill.style.width = p * 100 + "%"; requestAnimationFrame(tick);
  }
  btn.addEventListener("click", () => {
    playing = !playing; player.classList.toggle("playing", playing);
    btn.setAttribute("aria-pressed", playing); btn.textContent = playing ? "Pause visual" : "Play visual";
    if (playing) requestAnimationFrame(tick); else bars.forEach((b, i) => b.style.height = 15 + Math.abs(Math.sin(i)) * 30 + "%");
  });
}

/* ===== SIDE QUEST DETAILS ===== */
function initInterests() {
  $$("#music-chips button").forEach(b => { b.setAttribute("aria-pressed", "false"); b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") === "true"; b.setAttribute("aria-pressed", !on);
    if (!on) toast("Vibe added: " + b.textContent);
  }); });
  const shapes = $$("#design-canvas b"), pal = [["#ff7a3d", "#ff4f8b", "#8b5cf6"], ["#8b5cf6", "#ff7a3d", "#ff4f8b"], ["#ff4f8b", "#8b5cf6", "#ff7a3d"], ["#f6efe8", "#ff4f8b", "#ff7a3d"]];
  let n = 0;
  const shuffle = () => { n = (n + 1) % pal.length; shapes.forEach((s, i) => { s.style.background = pal[n][i]; s.style.transform = `translate(${(Math.random() - .5) * 60}px,${(Math.random() - .5) * 30}px) rotate(${Math.random() * 90}deg) scale(${.7 + Math.random() * .7})`; }); };
  $("#swatch").addEventListener("click", shuffle);
  $("#design-canvas").addEventListener("pointermove", shuffle, { once: true });
}

/* ===== QUIZ ===== */
function initQuiz() {
  const box = $("#quiz"); let order, i, score;
  const shuffled = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  function start() { order = shuffled(QUIZ); i = 0; score = 0; render(); }
  function render() {
    const item = order[i];
    // Shuffle answers but remember which is correct
    const opts = shuffled(item.a.map((t, idx) => ({ t, ok: idx === item.c })));
    box.innerHTML = `<div class="qmeta"><span>Question ${i + 1} of ${order.length}</span><span>Score: ${score}</span></div>
      <div class="qbar" role="progressbar" aria-valuemin="0" aria-valuemax="${order.length}" aria-valuenow="${i}"><span style="width:${i / order.length * 100}%"></span></div>
      <h3 id="qtext">${item.q}</h3><div class="opts" role="group" aria-labelledby="qtext"></div>`;
    const wrap = $(".opts", box);
    opts.forEach(o => {
      const b = document.createElement("button"); b.textContent = o.t;
      b.addEventListener("click", () => {
        $$("button", wrap).forEach(x => x.disabled = true);
        const rightBtn = $$("button", wrap)[opts.findIndex(x => x.ok)];
        rightBtn.classList.add("right");
        if (o.ok) score++; else b.classList.add("wrong");
        setTimeout(() => { i++; i < order.length ? render() : finish(); $("#qtext", box)?.focus?.(); }, 1100);
      });
      wrap.appendChild(b);
    });
    $("#qtext").tabIndex = -1;
  }
  function finish() {
    const [, title, msg] = RESULTS.find(r => score >= r[0]);
    try { localStorage.setItem("sreyas-best", Math.max(score, +localStorage.getItem("sreyas-best") || 0)); } catch (e) {}
    let best = 0; try { best = localStorage.getItem("sreyas-best"); } catch (e) {}
    box.innerHTML = `<div class="result"><h3>Quest complete</h3><div class="score">${score} / ${order.length}</div><h3>${title}</h3><p>“${msg}”</p><p>Best on this device: ${best} / ${order.length}</p><button class="btn" id="restart">Play again</button></div>`;
    $("#restart").addEventListener("click", start); $("#restart").focus();
    toast("Quest complete: " + title);
  }
  start();
}

/* ===== CURSOR, MAGNETIC BUTTONS, CARD TILT (desktop only) ===== */
function initPointer() {
  if (!fine) return;
  document.body.classList.add("cursor-on");
  const dot = $("#cursor-dot"), ring = $("#cursor-ring"); let x = 0, y = 0, rx = 0, ry = 0;
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; });
  (function loop() { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("pointerover", e => ring.classList.toggle("hot", !!e.target.closest("a,button,.tilt")));
  if (reduced) return;
  $$(".magnetic").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener("pointerleave", () => b.style.transform = "");
  });
  $$(".tilt").forEach(c => {
    c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`; });
    c.addEventListener("pointerleave", () => c.style.transform = "");
  });
}

/* ===== PARTICLES (small, paused when tab hidden) ===== */
function initParticles() {
  const cv = $("#particles"), ctx = cv.getContext("2d"); if (reduced) { cv.remove(); return; }
  const count = innerWidth < 768 ? 25 : 60, cols = ["#ff7a3d", "#ff4f8b", "#8b5cf6"]; let ps = [];
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
  size(); addEventListener("resize", size);
  for (let i = 0; i < count; i++) ps.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.6 + .4, v: Math.random() * .3 + .08, c: cols[i % 3] });
  (function draw() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.y -= p.v; if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; } ctx.globalAlpha = .6; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); });
    }
    requestAnimationFrame(draw);
  })();
}

function init() { initNav(); initReveal(); initJourney(); initPlayer(); initInterests(); initQuiz(); initPointer(); initParticles(); }
document.addEventListener("DOMContentLoaded", boot);
