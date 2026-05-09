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
