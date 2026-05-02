// ── Quiz state ──
let cur = 1;
const ans = {};

function openQuiz() {
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

// ── Keyboard ──
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuiz(); });

// ── Header shadow on scroll ──
window.addEventListener('scroll', () => {
  document.querySelector('.site-header').style.boxShadow =
    window.scrollY > 8 ? '0 2px 16px rgba(26,40,64,.12)' : '0 2px 8px rgba(26,40,64,.07)';
});
