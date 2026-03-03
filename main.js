/* ══════════════════════════════
   LOADING SCREEN
══════════════════════════════ */
const loaderMessages = [
  'Memuat Dunia...', 'Menyiapkan Elemen...', 'Mengaktifkan Vision...',
  'Membuka Peta...', 'Siap!'
];
let loadPct = 0;
const loaderBar  = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const loader     = document.getElementById('loader');

const loadInterval = setInterval(() => {
  loadPct += Math.random() * 18 + 8;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loadInterval); }
  loaderBar.style.width = loadPct + '%';
  const idx = Math.floor((loadPct / 100) * (loaderMessages.length - 1));
  loaderText.textContent = loaderMessages[idx];
  if (loadPct === 100) {
    setTimeout(() => {
      loader.classList.add('hidden');
      triggerHeroAnimations();
    }, 500);
  }
}, 120);

function triggerHeroAnimations() {
  setTimeout(() => document.getElementById('heroEyebrow').classList.add('visible'), 100);
  setTimeout(() => document.getElementById('heroName').classList.add('visible'),    300);
  setTimeout(() => document.getElementById('heroSub').classList.add('visible'),     500);
  setTimeout(() => document.getElementById('heroCta').classList.add('visible'),     700);
  setTimeout(() => document.getElementById('heroRight').classList.add('visible'),   400);
}

/* ══════════════════════════════
   CANVAS — PARTICLES & STARS
══════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Star particles
const stars = Array.from({length: 200}, () => ({
  x:    Math.random() * canvas.width,
  y:    Math.random() * canvas.height,
  r:    Math.random() * 1.2 + 0.2,
  a:    Math.random(),
  aDir: (Math.random() - 0.5) * 0.008,
  speed: Math.random() * 0.08 + 0.02,
  color: Math.random() > 0.6 ? '#c8a03c' : Math.random() > 0.5 ? '#7ecef4' : '#ffffff'
}));

// Floating orbs (like Genshin elemental particles)
const orbs = Array.from({length: 8}, (_, i) => ({
  x:    Math.random() * canvas.width,
  y:    Math.random() * canvas.height,
  r:    Math.random() * 120 + 60,
  vx:   (Math.random() - 0.5) * 0.3,
  vy:   (Math.random() - 0.5) * 0.3,
  color: i % 2 === 0 ? 'rgba(200,160,60,' : 'rgba(126,206,244,',
  opacity: Math.random() * 0.04 + 0.01
}));

// Click spark particles
const sparks = [];

canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 / 12) * i;
    sparks.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * (Math.random() * 3 + 1),
      vy: Math.sin(angle) * (Math.random() * 3 + 1),
      life: 1, r: Math.random() * 2.5 + 0.5,
      color: Math.random() > 0.5 ? '#f5d980' : '#7ecef4'
    });
  }
  // Gold ripple
  sparks.push({ type: 'ripple', x: e.clientX, y: e.clientY, r: 0, maxR: 80, life: 1 });
});

function drawBg() {
  // Deep space gradient
  const grad = ctx.createRadialGradient(
    canvas.width/2, 0, 0,
    canvas.width/2, canvas.height/2, canvas.height
  );
  grad.addColorStop(0,   'rgba(8,16,40,1)');
  grad.addColorStop(0.5, 'rgba(4,7,15,1)');
  grad.addColorStop(1,   'rgba(2,4,10,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOrbs() {
  orbs.forEach(o => {
    o.x += o.vx; o.y += o.vy;
    if (o.x < -o.r) o.x = canvas.width + o.r;
    if (o.x > canvas.width + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = canvas.height + o.r;
    if (o.y > canvas.height + o.r) o.y = -o.r;
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0,   o.color + o.opacity + ')');
    g.addColorStop(0.5, o.color + (o.opacity * 0.4) + ')');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStars() {
  stars.forEach(s => {
    s.y -= s.speed;
    if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
    s.a += s.aDir;
    if (s.a <= 0 || s.a >= 1) s.aDir *= -1;
    ctx.globalAlpha = s.a * 0.8;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    if (s.r > 0.8 && s.a > 0.6) {
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      g.addColorStop(0, s.color.replace(')', ',0.4)').replace('#', 'rgba(').replace(/([0-9a-f]{2})/gi, v => parseInt(v,16)+',').slice(0,-1));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      try {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.a * 0.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      } catch(e) {}
    }
    ctx.globalAlpha = 1;
  });
}

function drawSparks() {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    if (s.type === 'ripple') {
      s.r += 3; s.life -= 0.04;
      ctx.strokeStyle = `rgba(200,160,60,${s.life * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      s.x += s.vx; s.y += s.vy;
      s.vy += 0.05; s.life -= 0.04;
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (s.life <= 0) sparks.splice(i, 1);
  }
}

// Horizontal light streaks (like Genshin's ambient lines)
const streaks = Array.from({length: 5}, () => ({
  y:     Math.random() * window.innerHeight,
  x:     -300,
  w:     Math.random() * 200 + 100,
  speed: Math.random() * 0.4 + 0.1,
  a:     Math.random() * 0.06 + 0.02,
  color: Math.random() > 0.5 ? 'rgba(200,160,60,' : 'rgba(126,206,244,'
}));

function drawStreaks() {
  streaks.forEach(s => {
    s.x += s.speed;
    if (s.x > canvas.width + 400) { s.x = -400; s.y = Math.random() * canvas.height; }
    const g = ctx.createLinearGradient(s.x, 0, s.x + s.w, 0);
    g.addColorStop(0,   s.color + '0)');
    g.addColorStop(0.5, s.color + s.a + ')');
    g.addColorStop(1,   s.color + '0)');
    ctx.fillStyle = g;
    ctx.fillRect(s.x, s.y, s.w, 1.5);
  });
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function animate() {
  drawBg();
  drawOrbs();
  drawStars();
  drawStreaks();
  drawSparks();
  requestAnimationFrame(animate);
}
animate();

/* ══════════════════════════════
   CUSTOM CURSOR
══════════════════════════════ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let rX = 0, rY = 0;

document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
});

(function animRing() {
  rX += (mouseX - rX) * 0.14;
  rY += (mouseY - rY) * 0.14;
  ring.style.left = rX + 'px';
  ring.style.top  = rY + 'px';
  requestAnimationFrame(animRing);
})();

// Cursor scale on hover
document.querySelectorAll('a, button, .project-item, .note-card, .gallery-item, .stat-item, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width   = '12px';
    dot.style.height  = '12px';
    ring.style.width  = '52px';
    ring.style.height = '52px';
    ring.style.opacity = '0.9';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width   = '7px';
    dot.style.height  = '7px';
    ring.style.width  = '34px';
    ring.style.height = '34px';
    ring.style.opacity = '';
  });
});

/* ══════════════════════════════
   HERO CARD — MOUSE PARALLAX
══════════════════════════════ */
const heroCard = document.getElementById('heroCard');
document.addEventListener('mousemove', e => {
  if (!heroCard) return;
  const rect = heroCard.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const dx = (e.clientX - cx) / window.innerWidth  * 14;
  const dy = (e.clientY - cy) / window.innerHeight * 14;
  heroCard.style.transform = `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
});

/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════
   ACTIVE NAV HIGHLIGHT
══════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], div[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = '';
    l.style.opacity = '0.7';
    if (l.getAttribute('href') === '#' + current) {
      l.style.color = 'var(--gold2)';
      l.style.opacity = '1';
    }
  });
});

/* ══════════════════════════════
   GALLERY CLICK SPARKS
══════════════════════════════ */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', e => {
    const rect = item.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(angle) * (Math.random() * 4 + 2),
        vy: Math.sin(angle) * (Math.random() * 4 + 2),
        life: 1, r: Math.random() * 3 + 1,
        color: '#f5d980'
      });
    }
    sparks.push({ type: 'ripple', x: e.clientX, y: e.clientY, r: 0, maxR: 100, life: 1 });
  });
});

/* ══════════════════════════════
   TYPEWRITER for hero subtitle
══════════════════════════════ */
const heroSub = document.getElementById('heroSub');
const fullText = 'Designer · Developer · Creator';
heroSub.textContent = '';
let charIdx = 0;
function typeWriter() {
  if (charIdx < fullText.length && heroSub.classList.contains('visible')) {
    heroSub.textContent += fullText[charIdx++];
    setTimeout(typeWriter, 60);
  } else if (!heroSub.classList.contains('visible')) {
    setTimeout(typeWriter, 100);
  }
}
setTimeout(typeWriter, 1200);