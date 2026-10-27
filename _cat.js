
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl = n => Number(n || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
const IMGDIR = 'img/', CFG = window.APP_CONFIG || {};
let items = [], cfg = {}, q = '', brand = '', loaded = false, failed = false, sb = null;
function pimg(p) { const im = String(p.img || ''), src = /^https?:/.test(im) ? im : (im ? IMGDIR + im + '.jpg' : ''); return src ? `<img src="${src}" alt="" loading="lazy">` : esc((p.name || '?').trim().charAt(0).toUpperCase()); }
function render() {
  const brands = [...new Set(items.map(p => p.brand).filter(Boolean))].sort();
  const list = items.filter(p => (!brand || p.brand === brand) && (!q.trim() || (p.name + ' ' + (p.brand || '')).toLowerCase().includes(q.trim().toLowerCase())));
  const chip = (k, t) => `<button class="chip" data-brand="${esc(k)}" aria-pressed="${brand === k}">${esc(t)}</button>`;
  const title = cfg.title || 'Catálogo de Cosméticos'; document.title = title;
  $('#app').innerHTML = `<header class="hero"><small>${cfg.whatsapp ? 'Peça pelo WhatsApp' : 'Preços e produtos'}</small><h1>${esc(title)}</h1><p class="muted">Toque num produto para ver os detalhes.</p></header>
  <section><div class="tools"><input id="cq" type="search" placeholder="Buscar produto" value="${esc(q)}" aria-label="Buscar produto"></div>
  ${brands.length > 1 ? `<div class="chips">${chip('', 'Todos')}${brands.map(b => chip(b, b)).join('')}</div>` : ''}
  ${!loaded ? '<div class="empty">Carregando catálogo…</div>' : failed && !items.length ? '<div class="empty">Não foi possível carregar o catálogo agora. Tente de novo em instantes.</div>' : list.length ? `<div class="cat">${list.map(p => `<button class="prod" data-id="${esc(p.id)}"><div class="im">${pimg(p)}</div><div class="bd"><div class="nm">${esc(p.name)}</div><div class="muted">${esc(p.brand || '')}</div><div class="price">${brl(p.price)}</div>${p.avail === false ? '<div><span class="pill bad">Esgotado</span></div>' : ''}</div></button>`).join('')}</div>` : '<div class="empty">Nenhum produto encontrado.</div>'}</section>`;
  const e = document.activeElement; if (e && e.id === 'cq') { /* mantém foco na busca */ }
}
function detail(id) {
  const p = items.find(x => x.id === id); if (!p) return;
  const d = String(cfg.whatsapp || '').replace(/\D/g, ''), n = d && d.length <= 11 ? '55' + d : d;
  const href = n ? `https://wa.me/${n}?text=${encodeURIComponent('Olá! Tenho interesse em: ' + p.name + ' (' + brl(p.price) + ')')}` : '';
  $('#sheet-body').innerHTML = `<div class="sheet-h"><h3>${esc(p.name)}</h3><button class="x-btn" data-close aria-label="Fechar">×</button></div><div class="form"><div class="prod" style="max-width:340px;margin:0 auto;width:100%"><div class="im">${pimg(p)}</div></div>
    <div><div class="muted">${esc(p.brand || '')}</div><div class="price" style="font-size:30px">${brl(p.price)}</div>${p.avail === false ? '<span class="pill bad">Esgotado</span>' : '<span class="pill ok">Disponível</span>'}</div>
    ${href ? `<a class="btn" style="text-align:center;text-decoration:none;display:grid;place-items:center" href="${href}" target="_blank" rel="noopener">Quero este pelo WhatsApp</a>` : ''}</div>`;
  $('#sheet').hidden = false;
}
const closeSheet = () => { $('#sheet').hidden = true; };
document.addEventListener('click', e => {
  const c = e.target.closest('[data-brand]'); if (c) { brand = c.dataset.brand; render(); return; }
  const p = e.target.closest('.prod[data-id]'); if (p) { detail(p.dataset.id); return; }
  if (e.target.closest('[data-close]') || e.target === $('#sheet')) closeSheet();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
$('#app').addEventListener('input', e => { if (e.target.id === 'cq') { q = e.target.value; const pos = e.target.selectionStart; render(); const n = $('#cq'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } });
async function load() {
  try {
    const [a, b] = await Promise.all([sb.from('public_catalog').select('*').order('n'), sb.from('public_config').select('*')]);
    if (a.error) throw a.error; items = a.data || []; cfg = (b.data && b.data[0]) || {}; failed = false;
  } catch (e) { failed = true; }
  loaded = true;
  const act = document.activeElement; if (act && act.id === 'cq') return; render();
}
render();
if (!CFG.SUPABASE_URL || /SEU-PROJETO/.test(CFG.SUPABASE_URL) || !window.supabase) { loaded = true; failed = true; render(); }
else { sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY); load(); setInterval(() => { if (document.visibilityState === 'visible') load(); }, 60000); }
})();
