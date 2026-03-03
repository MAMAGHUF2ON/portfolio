/* ══════════════════════════════
   LOADING SCREEN
══════════════════════════════ */
const msgs = ['Memasuki Dunia...','Menyiapkan Elemen...','Mengaktifkan Vision...','Membuka Peta...','Siap!'];
let pct = 0;
const bar   = document.getElementById('loaderBar');
const ltxt  = document.getElementById('loaderTxt');
const ldr   = document.getElementById('loader');

const iv = setInterval(() => {
  pct += Math.random() * 18 + 8;
  if (pct >= 100) { pct = 100; clearInterval(iv); }
  bar.style.width = pct + '%';
  ltxt.textContent = msgs[Math.min(Math.floor(pct / 100 * (msgs.length - 1)), msgs.length - 1)];
  if (pct === 100) setTimeout(() => ldr.classList.add('hidden'), 500);
}, 130);

/* ══════════════════════════════
   CANVAS — PARTICLES
══════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const stars = Array.from({length: 180}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.1 + 0.2,
  a: Math.random(),
  da: (Math.random() - 0.5) * 0.007,
  vy: Math.random() * 0.07 + 0.015,
  col: Math.random() > 0.6 ? '#c8a03c' : Math.random() > 0.5 ? '#7ecef4' : '#fff'
}));

const orbs = Array.from({length: 6}, (_, i) => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 100 + 50,
  vx: (Math.random() - 0.5) * 0.25,
  vy: (Math.random() - 0.5) * 0.25,
  col: i % 2 === 0 ? 'rgba(200,160,60,' : 'rgba(126,206,244,',
  op: Math.random() * 0.035 + 0.008
}));

const streaks = Array.from({length: 4}, () => ({
  y: Math.random() * window.innerHeight,
  x: -300,
  w: Math.random() * 180 + 80,
  v: Math.random() * 0.35 + 0.08,
  a: Math.random() * 0.05 + 0.015,
  col: Math.random() > 0.5 ? 'rgba(200,160,60,' : 'rgba(126,206,244,'
}));

const sparks = [];

document.addEventListener('click', e => {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 / 10) * i;
    sparks.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * (Math.random() * 3 + 1),
      vy: Math.sin(angle) * (Math.random() * 3 + 1),
      life: 1, r: Math.random() * 2 + 0.5,
      col: Math.random() > 0.5 ? '#f5d980' : '#7ecef4'
    });
  }
  sparks.push({ type: 'ripple', x: e.clientX, y: e.clientY, r: 0, life: 1 });
});

function frame() {
  /* deep bg */
  const g = ctx.createRadialGradient(canvas.width/2, 0, 0, canvas.width/2, canvas.height/2, canvas.height);
  g.addColorStop(0, 'rgba(8,16,40,1)');
  g.addColorStop(.5, 'rgba(4,7,15,1)');
  g.addColorStop(1, 'rgba(2,4,10,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* orbs */
  orbs.forEach(o => {
    o.x += o.vx; o.y += o.vy;
    if (o.x < -o.r) o.x = canvas.width + o.r;
    if (o.x > canvas.width + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = canvas.height + o.r;
    if (o.y > canvas.height + o.r) o.y = -o.r;
    const og = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    og.addColorStop(0, o.col + o.op + ')');
    og.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
  });

  /* stars */
  stars.forEach(s => {
    s.y -= s.vy;
    if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    ctx.globalAlpha = Math.max(0, Math.min(1, s.a)) * 0.75;
    ctx.fillStyle = s.col;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });

  /* streaks */
  streaks.forEach(s => {
    s.x += s.v;
    if (s.x > canvas.width + 400) { s.x = -400; s.y = Math.random() * canvas.height; }
    const sg = ctx.createLinearGradient(s.x, 0, s.x + s.w, 0);
    sg.addColorStop(0, s.col + '0)');
    sg.addColorStop(.5, s.col + s.a + ')');
    sg.addColorStop(1, s.col + '0)');
    ctx.fillStyle = sg; ctx.fillRect(s.x, s.y, s.w, 1.5);
  });

  /* sparks */
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    if (s.type === 'ripple') {
      s.r += 2.5; s.life -= 0.035;
      ctx.strokeStyle = `rgba(200,160,60,${s.life * 0.45})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.stroke();
    } else {
      s.x += s.vx; s.y += s.vy; s.vy += 0.04; s.life -= 0.04;
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.col;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (s.life <= 0) sparks.splice(i, 1);
  }

  requestAnimationFrame(frame);
}
frame();

/* ══════════════════════════════
   CURSOR
══════════════════════════════ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .project-item, .note-card, .gallery-item, .stat-item, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.style.width = '12px'; dot.style.height = '12px'; ring.style.width = '52px'; ring.style.height = '52px'; });
  el.addEventListener('mouseleave', () => { dot.style.width = '7px'; dot.style.height = '7px'; ring.style.width = '34px'; ring.style.height = '34px'; });
});

/* ══════════════════════════════
   HERO CARD PARALLAX
══════════════════════════════ */
const heroCard = document.getElementById('heroCard');
if (heroCard) {
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX / window.innerWidth  - 0.5) * 14;
    const dy = (e.clientY / window.innerHeight - 0.5) * 14;
    heroCard.style.transform = `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
}

/* ══════════════════════════════
   TYPEWRITER
══════════════════════════════ */
const sub = document.getElementById('heroSub');
if (sub) {
  const full = sub.textContent;
  sub.textContent = '';
  let i = 0;
  setTimeout(function type() {
    if (i < full.length) { sub.textContent += full[i++]; setTimeout(type, 60); }
  }, 800);
}

/* ══════════════════════════════
   ACTIVE NAV
══════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(l => {
    l.style.color = '';
    if (l.getAttribute('href') === '#' + cur) l.style.color = 'var(--gold2)';
  });
});
