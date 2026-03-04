/* ══════════════════════════════
   LOADING SCREEN
══════════════════════════════ */
const msgs = ['Memasuki Teyvat...','Membuka Peta Bintang...','Mengaktifkan Vision...','Langit Malam Siap...','Selamat Datang!'];
let pct = 0;
const bar  = document.getElementById('loaderBar');
const ltxt = document.getElementById('loaderTxt');
const ldr  = document.getElementById('loader');

const iv = setInterval(() => {
  pct += Math.random() * 16 + 6;
  if (pct >= 100) { pct = 100; clearInterval(iv); }
  bar.style.width = pct + '%';
  ltxt.textContent = msgs[Math.min(Math.floor(pct / 100 * (msgs.length - 1)), msgs.length - 1)];
  if (pct === 100) setTimeout(() => ldr.classList.add('hidden'), 500);
}, 130);

/* ══════════════════════════════
   CANVAS — TEYVAT NIGHT SKY
══════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initSky();
}
window.addEventListener('resize', resize);

/* ── STARS ── */
let stars = [];
function makeStars() {
  stars = [];
  // Normal scattered stars
  for (let i = 0; i < 320; i++) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.15,
      a: Math.random(), da: (Math.random() - 0.5) * 0.006,
      vy: Math.random() * 0.04 + 0.008,
      col: pickStarColor(),
      glow: Math.random() > 0.75
    });
  }
  // Milky Way dense band — diagonal from bottom-left to top-right
  for (let i = 0; i < 900; i++) {
    const t   = Math.random();
    const bx  = W * 0.05 + t * W * 0.95;                   // along band axis
    const by  = H * 0.85 - t * H * 0.75;                   // diagonal slope
    const spread = (Math.random() - 0.5) * (W * 0.22);     // width of band
    const angle  = Math.atan2(-H * 0.75, W * 0.9);
    stars.push({
      x: bx + Math.cos(angle + Math.PI/2) * spread,
      y: by + Math.sin(angle + Math.PI/2) * spread,
      r: Math.random() * 0.85 + 0.1,
      a: Math.random() * 0.6 + 0.15,
      da: (Math.random() - 0.5) * 0.004,
      vy: Math.random() * 0.025 + 0.005,
      col: pickMilkyColor(),
      milky: true,
      glow: false
    });
  }
}
function pickStarColor() {
  const r = Math.random();
  if (r < 0.25) return '#c8a03c';   // gold
  if (r < 0.45) return '#7ecef4';   // sky blue
  if (r < 0.55) return '#d4a8ff';   // purple
  if (r < 0.65) return '#a8d8ff';   // ice blue
  return '#ffffff';
}
function pickMilkyColor() {
  const r = Math.random();
  if (r < 0.3)  return 'rgba(220,200,255,';  // cool purple-white
  if (r < 0.55) return 'rgba(180,210,255,';  // blue-white
  if (r < 0.7)  return 'rgba(255,240,210,';  // warm white
  return 'rgba(255,255,255,';
}

/* ── NEBULA CLOUDS ── */
let nebulae = [];
function makeNebulae() {
  nebulae = [
    // Large central Milky Way core glow
    { x: W*0.5,  y: H*0.3,  rx: W*0.4, ry: H*0.25, col1: 'rgba(60,20,120,', col2: 'rgba(20,10,60,',  a: 0.55 },
    // Left side teal nebula
    { x: W*0.15, y: H*0.4,  rx: W*0.22, ry: H*0.2,  col1: 'rgba(10,60,100,', col2: 'rgba(5,30,60,',  a: 0.45 },
    // Right side purple nebula
    { x: W*0.85, y: H*0.55, rx: W*0.2,  ry: H*0.22, col1: 'rgba(80,20,120,', col2: 'rgba(40,8,80,',  a: 0.4  },
    // Top golden haze (Teyvat sun remnant)
    { x: W*0.3,  y: H*0.08, rx: W*0.3,  ry: H*0.12, col1: 'rgba(120,70,10,', col2: 'rgba(60,30,5,',  a: 0.3  },
    // Deep blue atmosphere
    { x: W*0.7,  y: H*0.15, rx: W*0.25, ry: H*0.15, col1: 'rgba(10,30,90,',  col2: 'rgba(5,15,50,',  a: 0.35 },
    // Bottom horizon glow
    { x: W*0.5,  y: H*1.0,  rx: W*0.7,  ry: H*0.25, col1: 'rgba(15,25,70,',  col2: 'rgba(5,10,30,',  a: 0.5  },
  ];
}

/* ── AURORA BANDS (Teyvat magic sky) ── */
let auroraTime = 0;
const auroraLines = [
  { y: 0.15, col: 'rgba(60,200,180,', amp: 0.04, speed: 0.0003, phase: 0     },
  { y: 0.22, col: 'rgba(120,80,220,', amp: 0.03, speed: 0.0004, phase: 1.2   },
  { y: 0.28, col: 'rgba(30,160,220,', amp: 0.035,speed: 0.00035,phase: 2.5   },
  { y: 0.10, col: 'rgba(180,100,255,',amp: 0.025,speed: 0.0005, phase: 0.8   },
];

/* ── MOON ── */
const moon = {
  x: W * 0.82, y: H * 0.12,
  r: Math.min(W, H) * 0.055,
  phase: 0.75   // 0=new, 0.5=full, 1=new again
};

/* ── FLOATING GOLDEN PARTICLES (Teyvat magic) ── */
let particles = [];
function makeParticles() {
  particles = Array.from({length: 55}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -(Math.random() * 0.5 + 0.1),
    a: Math.random() * 0.7 + 0.2,
    da: (Math.random() - 0.5) * 0.008,
    col: Math.random() > 0.5 ? '#c8a03c' : Math.random() > 0.5 ? '#7ecef4' : '#d4a8ff',
    size: Math.random() * 1.5 + 0.5
  }));
}

/* ── CLICK SPARKS ── */
const sparks = [];
document.addEventListener('click', e => {
  for (let i = 0; i < 14; i++) {
    const angle = (Math.PI * 2 / 14) * i;
    sparks.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * (Math.random() * 4 + 1.5),
      vy: Math.sin(angle) * (Math.random() * 4 + 1.5),
      life: 1, r: Math.random() * 2.5 + 0.5,
      col: Math.random() > 0.5 ? '#f5d980' : Math.random() > 0.5 ? '#7ecef4' : '#d4a8ff'
    });
  }
  sparks.push({ type: 'ripple', x: e.clientX, y: e.clientY, r: 0, life: 1 });
});

function initSky() {
  moon.x = W * 0.82;
  moon.y = H * 0.12;
  moon.r = Math.min(W, H) * 0.055;
  makeStars();
  makeNebulae();
  makeParticles();
}

/* ══════════════════════════════
   DRAW FUNCTIONS
══════════════════════════════ */

function drawSkyGradient() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,    '#000308');   // near-black zenith
  g.addColorStop(0.15, '#010510');   // deep space
  g.addColorStop(0.4,  '#02081a');   // dark navy
  g.addColorStop(0.75, '#030c20');   // midnight blue
  g.addColorStop(1,    '#050f18');   // horizon
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawNebulae() {
  nebulae.forEach(n => {
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
    g.addColorStop(0,   n.col1 + n.a + ')');
    g.addColorStop(0.5, n.col2 + (n.a * 0.4) + ')');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.save();
    ctx.scale(1, n.ry / n.rx);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawMilkyWayCore() {
  // Dense glowing band across the sky
  const angle  = Math.atan2(-H * 0.75, W * 0.9);
  const cx     = W * 0.5, cy = H * 0.45;
  const len    = Math.sqrt(W*W + H*H);
  
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  
  // Outer diffuse glow
  const og = ctx.createLinearGradient(0, -W*0.18, 0, W*0.18);
  og.addColorStop(0,   'rgba(0,0,0,0)');
  og.addColorStop(0.3, 'rgba(40,20,80,0.12)');
  og.addColorStop(0.5, 'rgba(80,50,140,0.18)');
  og.addColorStop(0.7, 'rgba(40,20,80,0.12)');
  og.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = og;
  ctx.fillRect(-len/2, -W*0.18, len, W*0.36);
  
  // Inner bright core
  const ig = ctx.createLinearGradient(0, -W*0.06, 0, W*0.06);
  ig.addColorStop(0,   'rgba(0,0,0,0)');
  ig.addColorStop(0.4, 'rgba(100,70,180,0.12)');
  ig.addColorStop(0.5, 'rgba(160,130,255,0.15)');
  ig.addColorStop(0.6, 'rgba(100,70,180,0.12)');
  ig.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = ig;
  ctx.fillRect(-len/2, -W*0.06, len, W*0.12);

  ctx.restore();
}

function drawAurora() {
  auroraTime++;
  auroraLines.forEach(al => {
    const baseY = H * al.y;
    const pts   = 60;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const x = (W / pts) * i;
      const y = baseY + Math.sin(i * 0.18 + auroraTime * al.speed * 1000 + al.phase) * H * al.amp
                      + Math.sin(i * 0.07 + auroraTime * al.speed * 600  + al.phase * 2) * H * al.amp * 0.5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = al.col + '0.06)';
    ctx.lineWidth   = H * 0.045;
    ctx.stroke();

    // Brighter thin core line
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const x = (W / pts) * i;
      const y = baseY + Math.sin(i * 0.18 + auroraTime * al.speed * 1000 + al.phase) * H * al.amp
                      + Math.sin(i * 0.07 + auroraTime * al.speed * 600  + al.phase * 2) * H * al.amp * 0.5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = al.col + '0.12)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  });
}


function drawStars() {
  stars.forEach(s => {
    s.y -= s.vy;
    if (s.y < -2) {
      s.y = H + 2;
      s.x = s.milky
        ? (() => { const t=Math.random(); return W*0.05 + t*W*0.95 + (Math.random()-.5)*W*0.22; })()
        : Math.random() * W;
    }
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    const alpha = Math.max(0, Math.min(1, s.a));

    if (s.milky) {
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = typeof s.col === 'string' && s.col.includes('rgba')
        ? s.col + alpha * 0.55 + ')' : s.col;
    } else {
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = s.col;
    }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // Big star cross glow
    if (s.glow && !s.milky && s.r > 0.9 && alpha > 0.6) {
      ctx.globalAlpha = alpha * 0.25;
      ctx.strokeStyle = s.col;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r*4, s.y); ctx.lineTo(s.x + s.r*4, s.y);
      ctx.moveTo(s.x, s.y - s.r*4); ctx.lineTo(s.x, s.y + s.r*4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.da;
    if (p.a <= 0.1 || p.a >= 0.95) p.da *= -1;
    if (p.y < -5)  { p.y = H + 5; p.x = Math.random() * W; }
    if (p.x < -5)  p.x = W + 5;
    if (p.x > W+5) p.x = -5;

    ctx.globalAlpha = Math.max(0, Math.min(1, p.a)) * 0.7;
    // Diamond shape
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = p.col;
    ctx.fillRect(-p.size, -p.size, p.size*2, p.size*2);
    ctx.restore();

    // Soft glow
    const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
    pg.addColorStop(0,   p.col.replace('#', 'rgba(').replace(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i,
      (m,r,g,b) => `${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},`) + '0.15)');
    pg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawSparks() {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    if (s.type === 'ripple') {
      s.r += 2.8; s.life -= 0.032;
      ctx.strokeStyle = `rgba(200,160,60,${s.life * 0.4})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.stroke();
    } else {
      s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.life -= 0.038;
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.col;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (s.life <= 0) sparks.splice(i, 1);
  }
}

/* ── MAIN LOOP ── */
function frame() {
  drawSkyGradient();
  drawNebulae();
  drawMilkyWayCore();
  drawMoon();
  drawStars();
  drawParticles();
  drawSparks();
  requestAnimationFrame(frame);
}

resize();
frame();

/* ══════════════════════════════
   CURSOR
══════════════════════════════ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
(function animRing() {
  rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.project-item,.note-card,.gallery-item,.stat-item,.skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.style.width='12px'; dot.style.height='12px'; ring.style.width='52px'; ring.style.height='52px'; });
  el.addEventListener('mouseleave', () => { dot.style.width='7px';  dot.style.height='7px';  ring.style.width='34px'; ring.style.height='34px'; });
});

/* ══════════════════════════════
   HERO CARD PARALLAX
══════════════════════════════ */
const heroCard = document.getElementById('heroCard');
if (heroCard) {
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX/window.innerWidth  - 0.5) * 14;
    const dy = (e.clientY/window.innerHeight - 0.5) * 14;
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
  }, 900);
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
    if (l.getAttribute('href') === '#' + cur || l.getAttribute('href') === 'index.html#' + cur)
      l.style.color = 'var(--gold2)';
  });
});
