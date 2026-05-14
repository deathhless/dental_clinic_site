// ── Quiz state ──
let cur = 1;
const ans = {};

function formatPhone(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.startsWith('8') || v.startsWith('7')) v = v.slice(1);
  v = v.slice(0, 10);
  let r = '';
  if (v.length > 0) r = '+7 (' + v.slice(0, 3);
  if (v.length >= 3) r += ') ' + v.slice(3, 6);
  if (v.length >= 6) r += '-' + v.slice(6, 8);
  if (v.length >= 8) r += '-' + v.slice(8, 10);
  input.value = r;
}

function resetQuiz() {
  cur = 1;
  Object.keys(ans).forEach(k => delete ans[k]);
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  document.getElementById('qs1').classList.add('active');
  document.querySelectorAll('.quiz-prog-bar').forEach(b => b.classList.remove('done'));
  document.getElementById('qprog').style.display = '';
  document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('sel'));
  document.querySelectorAll('.btn-next:not(.enabled-always)').forEach(b => b.classList.remove('enabled'));
  const form = document.querySelector('.quiz-form');
  if (form) form.reset();
}

function openQuiz() {
  resetQuiz();
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuiz() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
function handleBg(e) {
  if (e.target === document.getElementById('modal')) closeQuiz();
}

function pick(btn, step) {
  btn.closest('.quiz-opts').querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  ans['q' + step] = btn.textContent.trim();
  const nb = document.getElementById('qn' + step);
  if (nb) nb.classList.add('enabled');
}

function goStep(n) {
  document.getElementById('qs' + cur).classList.remove('active');
  document.getElementById('pb' + cur).classList.add('done');
  cur = n;
  document.getElementById('qs' + cur).classList.add('active');
}

function goBack() {
  const final = document.getElementById('qsFinal');
  if (final.classList.contains('active')) {
    final.classList.remove('active');
    document.querySelectorAll('.quiz-prog-bar').forEach(b => b.classList.remove('done'));
    for (let i = 1; i < cur; i++) document.getElementById('pb' + i).classList.add('done');
    document.getElementById('qs' + cur).classList.add('active');
    return;
  }
  if (cur <= 1) return;
  document.getElementById('qs' + cur).classList.remove('active');
  document.getElementById('pb' + (cur - 1)).classList.remove('done');
  cur--;
  document.getElementById('qs' + cur).classList.add('active');
}

function showFinal() {
  document.getElementById('qs' + cur).classList.remove('active');
  document.getElementById('pb' + cur).classList.add('done');
  document.getElementById('qsFinal').classList.add('active');
  document.getElementById('qprog').querySelectorAll('.quiz-prog-bar').forEach(b => b.classList.add('done'));
}

function submitQuiz(e) {
  e.preventDefault();
  const f = e.target;
  sendLead({ source: 'quiz', name: f.name.value, phone: f.phone.value, ...ans });
  document.getElementById('qsFinal').classList.remove('active');
  document.getElementById('qsOk').classList.add('active');
  document.getElementById('qprog').style.display = 'none';
}

function submitPromo(e) {
  e.preventDefault();
  const f = e.target;
  sendLead({ source: 'promo', name: f.name.value, phone: f.phone.value });
  f.closest('.form-card').innerHTML =
    '<div class="success-box" style="padding:10px 0">' +
    '<div class="success-icon"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg></div>' +
    '<h4 style="color:#fff">Заявка принята!</h4>' +
    '<p style="color:rgba(255,255,255,.55)">Перезвоним в течение 5 минут</p></div>';
}

// ── Send lead (replace with your CRM endpoint) ──
function sendLead(data) {
  console.log('Lead:', data);
  // fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
}

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const was = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}

// ── Mobile menu ──
function toggleMenu() {
  const btn = document.getElementById('burgerBtn');
  const nav = document.getElementById('mobileNav');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// ── Keyboard ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeQuiz();
    const nav = document.getElementById('mobileNav');
    if (nav && nav.classList.contains('open')) toggleMenu();
  }
});

// ── Smooth scroll to top on reload ──
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('_sy', window.scrollY);
});
window.addEventListener('load', () => {
  const y = +sessionStorage.getItem('_sy') || 0;
  sessionStorage.removeItem('_sy');
  if (y > 0) {
    window.scrollTo(0, y);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  }
});

// ── Scroll reveal ──
window.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll(
    '.utp-card, .step, .faq-item, .contact-row, ' +
    '.hero-stat, .section-title, .section-label, ' +
    '.doctors-feat, .final-cta-wrap, .promo-grid > *'
  );

  // Stagger children of grid containers
  ['.utp-grid', '.steps-grid', '.hero-stats', '.doctors-feats'].forEach(sel => {
    document.querySelectorAll(sel + ' > *').forEach((el, i) => {
      el.dataset.revealDelay = i * 90;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = +(e.target.dataset.revealDelay || 0);
      setTimeout(() => e.target.classList.add('visible'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
});

// ── Header shadow on scroll ──
window.addEventListener('scroll', () => {
  document.querySelector('.site-header').style.boxShadow =
    window.scrollY > 8 ? '0 2px 16px rgba(26,40,64,.12)' : '0 2px 8px rgba(26,40,64,.07)';
});

// ── Doctors Carousel ──
let docPos = 0;
const DOC_TOTAL = 13;

function docVisible() {
  return window.innerWidth <= 600 ? 1 : window.innerWidth <= 960 ? 2 : 4;
}

function docCardWidth() {
  const card = document.querySelector('#docTrack .doc-card');
  return card ? card.offsetWidth + 20 : 0;
}

function docGoTo(pos, animate = true) {
  const vis = docVisible();
  docPos = Math.max(0, Math.min(pos, DOC_TOTAL - vis));
  const track = document.getElementById('docTrack');
  if (!track) return;
  const offset = docPos * docCardWidth();
  track.style.transition = animate
    ? 'transform .6s cubic-bezier(.16,1,.3,1)'
    : 'none';
  track.style.transform = `translateX(-${offset}px)`;
  updateDocUI();
}

function docSlide(dir) { docGoTo(docPos + dir); }

function updateDocUI() {
  const vis = docVisible();
  const countEl = document.getElementById('docCount');
  if (countEl) countEl.textContent = `${docPos + 1}–${Math.min(docPos + vis, DOC_TOTAL)} из ${DOC_TOTAL}`;
  const prev = document.getElementById('docPrev');
  const next = document.getElementById('docNext');
  if (prev) prev.disabled = docPos === 0;
  if (next) next.disabled = docPos >= DOC_TOTAL - vis;
  document.querySelectorAll('.doc-dot').forEach((d, i) =>
    d.classList.toggle('active', i === docPos)
  );
}

function initDocCarousel() {
  const dotsEl = document.getElementById('docDots');
  if (!dotsEl) return;
  const vis = docVisible();
  dotsEl.innerHTML = '';
  for (let i = 0; i < DOC_TOTAL - vis + 1; i++) {
    const d = document.createElement('button');
    d.className = 'doc-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Слайд ${i + 1}`);
    d.addEventListener('click', () => docGoTo(i));
    dotsEl.appendChild(d);
  }
  updateDocUI();
}

// 3-D tilt on hover
function initDocTilt() {
  document.querySelectorAll('.doc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(700px) translateY(-10px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) scale(1.03)`;
      card.style.boxShadow =
        `${x * -12}px ${14 + y * -8}px 48px rgba(44,24,8,.22)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// Mouse-drag to swipe
function initDocDrag() {
  const outer = document.querySelector('.doc-track-outer');
  const track = document.getElementById('docTrack');
  if (!outer || !track) return;

  let dragging = false, startX = 0, startOffset = 0, moved = 0;

  outer.style.cursor = 'grab';

  outer.addEventListener('mousedown', e => {
    dragging = true; moved = 0;
    startX = e.clientX;
    startOffset = docPos * docCardWidth();
    outer.style.cursor = 'grabbing';
    track.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    moved = startX - e.clientX;
    track.style.transform = `translateX(-${startOffset + moved}px)`;
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    outer.style.cursor = 'grab';
    if      (moved >  70) docGoTo(docPos + 1);
    else if (moved < -70) docGoTo(docPos - 1);
    else                  docGoTo(docPos);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initDocCarousel();
  initDocTilt();
  initDocDrag();

  // Touch / swipe
  const outer = document.querySelector('.doc-track-outer');
  if (outer) {
    let touchX = 0;
    outer.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    outer.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) docSlide(diff > 0 ? 1 : -1);
    }, { passive: true });
  }
});

window.addEventListener('resize', () => {
  const track = document.getElementById('docTrack');
  if (track) { track.style.transition = 'none'; track.style.transform = 'translateX(0)'; }
  docPos = 0;
  initDocCarousel();
});
