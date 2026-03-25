/* ═══════════════════════════════════════════════════
   PORTFOLIO — SHARED ANIMATIONS & INTERACTIONS
═══════════════════════════════════════════════════ */

// ─── CUSTOM CURSOR ───────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
}
if (dot || ring) animateCursor();

// ─── PARTICLE CANVAS BACKGROUND ──────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], lines = [];
  const COLORS = ['#00f5ff', '#4169ff', '#8b5cf6'];
  const N = Math.min(80, Math.floor(window.innerWidth / 18));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function spawnParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
      r: rand(0.8, 2.5),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.2, 0.7),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.005, 0.02)
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, spawnParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle radial gradient center glow
    const grd = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.5);
    grd.addColorStop(0,   'rgba(65,105,255,0.04)');
    grd.addColorStop(0.5, 'rgba(0,245,255,0.015)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p = particles[i], q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(65,105,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // particles
    for (const p of particles) {
      p.pulse += p.pulseSpeed;
      const r = p.r + Math.sin(p.pulse) * 0.4;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      glow.addColorStop(0, p.color + '40');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.globalAlpha = alpha * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;

      // move
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

// ─── LOADER ──────────────────────────────────────
(function runLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  const pct    = document.getElementById('loader-pct');
  if (!loader) return;

  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) { progress = 100; clearInterval(iv); }
    if (fill) fill.style.width = progress + '%';
    if (pct)  pct.textContent  = Math.floor(progress) + '%';
    if (progress >= 100) {
      setTimeout(() => loader.classList.add('out'), 200);
    }
  }, 60);
})();

// ─── SCROLL REVEAL ───────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ─── SKILL BAR ANIMATION ─────────────────────────
(function initSkills() {
  const rows = document.querySelectorAll('.skill-row');
  if (!rows.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  rows.forEach(r => obs.observe(r));
})();

// ─── MODAL ───────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) { m.classList.remove('open'); document.body.style.overflow = ''; } });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => { m.classList.remove('open'); document.body.style.overflow = ''; });
  }
});

// ─── ACTIVE NAV LINK ─────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── TILT EFFECT ON CARDS ────────────────────────
document.querySelectorAll('.glass, .nav-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});