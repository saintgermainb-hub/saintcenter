/* Agenda Coordenação · Reunião concluída
   - Só a Karine conclui a reunião, pelo botão "Reunião concluída".
   - Antes de concluir: pauta, anotações, anexos, plano de ação e RESUMO podem ser editados.
   - Data e horário continuam seguindo a regra de sempre (travados depois que a reunião aconteceu).
   - Depois de concluir: a reunião fica só para leitura (não edita mais nada).
   - "Salvar plano na agenda" não conclui mais a reunião sozinho.
   Carregar DEPOIS de extras.js:  <script src="concluir.js?v=1"></script>              */
(function(){
if(window.__sgConcluir) return; window.__sgConcluir = 1;
if(typeof LIBERADO === 'undefined' || !LIBERADO) return;
const dlg = document.getElementById('dlgReuniao'); if(!dlg) return;
const $ = id => document.getElementById(id);
const reu = () => window.SG_reuAtual || null;
const concluida = r => !!(r && r.concluida);
const avisar = m => { try{ if(typeof toast === 'function') toast(m); }catch(_){} };
const gravar = () => { try{ salvar(); }catch(_){} };
let tS = null;
const salvarDepois = () => { clearTimeout(tS); const s = $('rqSalvo'); if(s) s.textContent = 'Salvando…'; tS = setTimeout(() => { gravar(); if(s) s.textContent = 'Salvo ✓'; }, 500); };
const dataBR = s => { try{ return new Date(s).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).replace(',', ' às'); }catch(_){ return ''; } };

/* ---------- visual ---------- */
const css = document.createElement('style');
css.textContent = `
#rqConcluir{background:#414142;border-color:#414142;color:#fff}
#rqConcluir.conf{background:var(--pink);border-color:var(--pink);color:#fff}
.reu-concluida-selo{display:none;align-items:center;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#fff;background:#414142;border-radius:999px;padding:7px 14px}
#dlgReuniao.concluida .reu-concluida-selo{display:inline-flex}
#dlgReuniao.concluida #rqConcluir{display:none}
#rqResumo[contenteditable="plaintext-only"]{cursor:text;outline:none;border:1px solid transparent}
#rqResumo[contenteditable="plaintext-only"]:focus{border-color:var(--pink)}
.rq-res-dica{font-size:11px;color:var(--g2);margin:8px 0 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.rq-res-dica button{font-size:9px;letter-spacing:.16em;text-transform:uppercase;background:none;border:0;color:var(--pink);cursor:pointer;padding:0}
#dlgReuniao.concluida .rq-res-dica button{display:none}
#dlgReuniao.concluida [data-trava]{opacity:.45;cursor:not-allowed}
`;
document.head.appendChild(css);

$('rqSalvarFechar').insertAdjacentHTML('afterend',
  '<button class="btn min" id="rqConcluir" type="button">Reunião concluída</button>' +
  '<span class="reu-concluida-selo" id="rqConcluidaSelo">Concluída · só leitura</span>');
const pre = $('rqResumo');
pre.insertAdjacentHTML('afterend',
  '<p class="rq-res-dica"><span id="rqResInfo">Clique no resumo para editar.</span>' +
  '<button type="button" id="rqResRefazer">Refazer resumo automático</button></p>');

/* ---------- resumo editável ---------- */
let pondo = false;
function mostrarResumo(){
  if(document.activeElement === pre) return;
  const r = reu(); if(!r || !(r.resumoEditado || concluida(r)) || !r.resumo) return;
  if(pre.innerText !== r.resumo){ pondo = true; pre.textContent = r.resumo; pondo = false; }
}
// o sistema redesenha o resumo sozinho; se ele foi editado (ou a reunião foi concluída), volta o texto da Karine
new MutationObserver(() => { if(pondo || document.activeElement === pre) return; mostrarResumo(); })
  .observe(pre, { childList:true, characterData:true, subtree:true });
pre.addEventListener('input', () => {
  const r = reu(); if(!r || concluida(r)) return;
  r.resumo = pre.innerText.replace(/ /g, ' ');
  r.resumoEditado = true;
  $('rqResInfo').textContent = 'Resumo editado por você · salvo sozinho';
  salvarDepois();
});
pre.addEventListener('blur', mostrarResumo);
$('rqResRefazer').onclick = () => {
  const r = reu(); if(!r || concluida(r)) return;
  r.resumoEditado = false;
  $('rqGerar').click();
  if(!$('rqResultado').hidden){ r.resumo = pre.innerText; salvarDepois(); }
  atualizar();
};
// copiar leva o texto que está na tela (com as edições)
$('rqCopiar').onclick = async () => {
  const txt = pre.innerText;
  try{ await navigator.clipboard.writeText(txt); }
  catch(_){ const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  avisar('Resumo copiado. É só colar no WhatsApp ou no e-mail.');
};

/* ---------- "Salvar plano na agenda" não conclui a reunião e não apaga o resumo editado ---------- */
const salvarPlanoBase = $('rqSalvar').onclick;
$('rqSalvar').onclick = function(){
  const r = reu(); if(!r || concluida(r)) return;
  const antes = { editado:r.resumoEditado, resumo:r.resumo, notas:r.notas, feito:r.feito, feitoEm:r.feitoEm };
  if(salvarPlanoBase) salvarPlanoBase.call(this);
  r.feito = antes.feito; r.feitoEm = antes.feitoEm;          // quem conclui é a Karine
  if(antes.editado){ r.resumo = antes.resumo; r.notas = antes.notas; r.resumoEditado = true; mostrarResumo(); }
  gravar(); try{ render(); }catch(_){}
};

/* ---------- botão Reunião concluída (pede confirmação) ---------- */
$('rqConcluir').onclick = () => {
  const r = reu(); if(!r || concluida(r)) return;
  const b = $('rqConcluir');
  if(b.dataset.conf !== '1'){
    b.dataset.conf = '1'; b.classList.add('conf'); b.textContent = 'Confirmar · depois não edita mais';
    clearTimeout(b._t); b._t = setTimeout(() => { b.dataset.conf = ''; b.classList.remove('conf'); b.textContent = 'Reunião concluída'; }, 6000);
    return;
  }
  clearTimeout(b._t); b.dataset.conf = ''; b.classList.remove('conf'); b.textContent = 'Reunião concluída';
  const n = $('rqNotas'); if(n) r.anotacoes = n.value;
  if(!r.resumoEditado && String(r.anotacoes || '').trim()){ $('rqGerar').click(); r.resumo = pre.innerText; }
  r.resumoEditado = true;                                       // o resumo fica congelado como está
  r.concluida = true; r.concluidaEm = new Date().toISOString();
  r.feito = true; if(!r.feitoEm) r.feitoEm = r.concluidaEm;
  gravar(); try{ render(); }catch(_){}
  atualizar();
  avisar('Reunião concluída. A partir de agora ela fica só para leitura.');
};

/* ---------- trava de leitura ---------- */
const LIVRES = ['rqFechar', 'rqSalvarFechar', 'rqCopiar', 'rqProxData', 'rqProxHora', 'rqProxOk', 'rqVerOrigem', 'rqConcluir'];
function livre(el){
  if(LIVRES.includes(el.id)) return true;
  if(el.id === 'rqData' || el.id === 'rqHora' || el.matches('[data-rq-adiar]')) return true; // data/horário: regra de sempre
  if(el.matches('[data-anx-ver]')) return true;
  if(/fechar/i.test(el.getAttribute('aria-label') || '')) return true;
  if(el.closest('#rqLinha, #rqAcomp')) return true;              // linha do tempo e acompanhamento das ações seguem livres
  return false;
}
let aplicando = false;
function atualizar(){
  const r = reu(); const t = concluida(r);
  aplicando = true;
  dlg.classList.toggle('concluida', t);
  pre.setAttribute('contenteditable', t ? 'false' : 'plaintext-only');
  $('rqResInfo').textContent = t ? 'Reunião concluída em ' + dataBR(r.concluidaEm) + ' · somente leitura'
    : (r && r.resumoEditado ? 'Resumo editado por você · salvo sozinho' : 'Clique no resumo para editar.');
  if(t){
    dlg.querySelectorAll('input, textarea, select, button').forEach(el => {
      if(livre(el) || el.dataset.trava) return;
      if(el.disabled) return;
      el.dataset.trava = '1'; el.disabled = true;
      if(el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.readOnly = true;
    });
  } else {
    dlg.querySelectorAll('[data-trava]').forEach(el => { el.disabled = false; el.readOnly = false; delete el.dataset.trava; });
  }
  mostrarResumo();
  aplicando = false;
}
// a janela é redesenhada várias vezes; reaplica a trava quando precisa
let tA = null;
new MutationObserver(() => { if(aplicando) return; clearTimeout(tA); tA = setTimeout(atualizar, 30); })
  .observe(dlg, { childList:true, subtree:true });
new MutationObserver(() => { if(dlg.open) setTimeout(atualizar, 0); })
  .observe(dlg, { attributes:true, attributeFilter:['open'] });
// concluída: não aceita colar nem arrastar anexos
['paste', 'drop'].forEach(ev => document.addEventListener(ev, e => {
  if(dlg.open && concluida(reu())){ e.preventDefault(); e.stopImmediatePropagation(); avisar('Reunião concluída · somente leitura.'); }
}, true));
/* ---------- pauta: cada tópico aparece inteiro (quebra em várias linhas) ---------- */
const cssP = document.createElement('style');
cssP.textContent = `
.reu-pauta .l{align-items:flex-start}
.reu-pauta .l textarea.pt-txt{flex:1;min-width:0;resize:none;overflow:hidden;padding:7px 10px;font:inherit;font-size:13px;line-height:1.45;border:1px solid var(--line, #eadfe6);border-radius:10px;background:#fff;color:var(--fg, #414142);white-space:pre-wrap;word-break:break-word}
.reu-pauta .l.ok textarea.pt-txt{text-decoration:none;color:#5b5b60;background:#faf7f9}
#rqPauta{max-height:560px !important}
.reu-pauta .l.novo textarea.pt-txt{background:#f7f0e8;border-color:#e8d9c6}
.reu-pauta .l button.trat,.reu-pauta .l .pt-vinc{margin-top:4px}
`;
document.head.appendChild(cssP);
const ajustarAltura = ta => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; };
function pautaInteira(){
  document.querySelectorAll('#rqPauta input[data-pt]').forEach(inp => {
    const ta = document.createElement('textarea');
    ta.className = 'pt-txt'; ta.rows = 1;
    ta.dataset.pt = inp.dataset.pt; ta.value = inp.value;
    if(inp.disabled){ ta.disabled = true; ta.readOnly = true; if(inp.dataset.trava) ta.dataset.trava = '1'; }
    inp.replaceWith(ta);
    ajustarAltura(ta);
  });
}
$('rqPauta').addEventListener('input', e => { if(e.target.matches('textarea.pt-txt')) ajustarAltura(e.target); });
$('rqPauta').addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.matches('textarea.pt-txt')){ e.preventDefault(); e.target.blur(); } });
new MutationObserver(pautaInteira).observe($('rqPauta'), { childList:true });
new MutationObserver(() => { if(dlg.open) setTimeout(() => document.querySelectorAll('#rqPauta textarea.pt-txt').forEach(ajustarAltura), 50); })
  .observe(dlg, { attributes:true, attributeFilter:['open'] });
pautaInteira();

if(dlg.open) atualizar();
})();
