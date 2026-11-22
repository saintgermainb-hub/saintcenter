/* Agenda Coordenação · corretor de português (como no Word)
   - Sublinhado vermelho do navegador em português do Brasil em todos os campos de texto.
   - Enquanto digita: acentos das palavras mais comuns (nao → não, reuniao → reunião, acao → ação…)
     e letra maiúscula no começo da frase.
   - Ao parar de digitar: revisão do LanguageTool (pt-BR). Acentos, pontuação e maiúsculas são
     corrigidos sozinhos; o que pode mudar o sentido (concordância, palavras parecidas) vira sugestão
     no selo "Português" do campo, para aplicar com um clique.
   - Nomes de pessoas (campos de responsável, palavras com maiúscula) não são trocados sozinhos.
   - Ctrl+Z desfaz qualquer correção.
   Carregar por último:  <script src="corretor.js?v=1"></script>                                  */
(function(){
if(window.__sgCorretor) return; window.__sgCorretor = 1;

const LT = 'https://api.languagetool.org/v2/check';
const KLIGADO = 'sg-agenda-corretor-auto';
const auto = () => localStorage.getItem(KLIGADO) !== 'nao';
const semAcento = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ---------- quais campos ---------- */
const FORA = '#iPessoa, [data-ac="pessoa"], .pt-resp, #pvResp, #busca, #buscaTxt, [type="search"], [list], [readonly], [disabled], [data-sem-corretor]';
function ehCampo(el){
  if(!el || !el.matches) return false;
  if(el.matches(FORA)) return false;
  if(/buscar|pesquis|e-?mail|senha|link|url|c[oó]digo|respons[aá]vel|pessoa/i.test((el.placeholder || '') + ' ' + (el.getAttribute('aria-label') || ''))) return false;
  if(el.tagName === 'TEXTAREA') return true;
  if(el.tagName === 'INPUT') return !el.type || el.type === 'text';
  return el.isContentEditable;
}
const ehEditavel = el => el && el.isContentEditable && el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT';
function marcarLingua(raiz){
  (raiz || document).querySelectorAll('textarea, input:not([type]), input[type="text"], [contenteditable]').forEach(el => {
    if(el.dataset.ptbr) return; el.dataset.ptbr = '1';
    el.setAttribute('lang', 'pt-BR');
    if(ehCampo(el)) el.setAttribute('spellcheck', 'true');
  });
}
document.documentElement.setAttribute('lang', 'pt-BR');
marcarLingua();
new MutationObserver(ms => { if(ms.some(m => m.addedNodes.length)) marcarLingua(); }).observe(document.body, { childList:true, subtree:true });

/* ---------- texto e cursor (textarea/input e contenteditable) ---------- */
const textoDe = el => ehEditavel(el) ? el.innerText : el.value;
function cursorDe(el){
  if(!ehEditavel(el)) return el.selectionStart;
  const s = getSelection(); if(!s.rangeCount || !el.contains(s.anchorNode)) return -1;
  const r = document.createRange(); r.selectNodeContents(el); r.setEnd(s.anchorNode, s.anchorOffset);
  return r.toString().length;
}
function pontoEm(el, pos){      // posição no texto → nó/offset (contenteditable)
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, resto = pos;
  while((n = w.nextNode())){ if(resto <= n.length) return [n, resto]; resto -= n.length; }
  return [el, el.childNodes.length];
}
let mexendo = false;
// troca um pedaço do texto mantendo o Ctrl+Z e o lugar do cursor; dispara "input" para salvar
function trocar(el, ini, fim, novo){
  const txt = textoDe(el);
  if(ini < 0 || fim > txt.length || ini > fim) return false;
  const cur = cursorDe(el), foco = document.activeElement === el;
  mexendo = true;
  try{
    if(foco){
      if(ehEditavel(el)){
        const [a, ao] = pontoEm(el, ini), [b, bo] = pontoEm(el, fim);
        const r = document.createRange(); r.setStart(a, ao); r.setEnd(b, bo);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      } else el.setSelectionRange(ini, fim);
      if(!document.execCommand('insertText', false, novo)) throw 0;
    } else throw 0;
  }catch(_){
    if(ehEditavel(el)) el.textContent = txt.slice(0, ini) + novo + txt.slice(fim);
    else el.value = txt.slice(0, ini) + novo + txt.slice(fim);
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }
  // cursor volta para onde estava (andando junto se a troca foi antes dele)
  if(foco && cur >= 0){
    const nc = cur >= fim ? cur + novo.length - (fim - ini) : Math.min(cur, ini + novo.length);
    if(ehEditavel(el)){ const [n, o] = pontoEm(el, nc); const r = document.createRange(); r.setStart(n, o); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    else el.setSelectionRange(nc, nc);
  }
  mexendo = false;
  return true;
}

/* ---------- na hora: acentos das palavras comuns ---------- */
const LISTA = `nao não|voce você|voces vocês|tambem também|entao então|ja já|so só|ate até|porem porém|alem além|apos após|atraves através|ninguem ninguém|alguem alguém|amanha amanhã|mes mês|tres três|sera será|serao serão|estao estão|sao são|vao vão|terao terão|irao irão|farao farão|estarao estarão|poderao poderão|deverao deverão|sabado sábado|terca terça|proximo próximo|proxima próxima|proximos próximos|proximas próximas|ultimo último|ultima última|ultimos últimos|ultimas últimas|numero número|numeros números|pagina página|paginas páginas|negocio negócio|negocios negócios|analise análise|analises análises|historico histórico|unico único|unica única|otimo ótimo|otima ótima|rapido rápido|rapida rápida|pratico prático|publico público|basico básico|tecnico técnico|tecnica técnica|logistica logística|estrategia estratégia|estrategias estratégias|estrategico estratégico|codigo código|codigos códigos|periodo período|relatorio relatório|relatorios relatórios|responsavel responsável|responsaveis responsáveis|disponivel disponível|possivel possível|possiveis possíveis|impossivel impossível|necessario necessário|necessaria necessária|necessarios necessários|necessarias necessárias|obrigatorio obrigatório|obrigatoria obrigatória|area área|areas áreas|experiencia experiência|referencia referência|urgencia urgência|sequencia sequência|frequencia frequência|pendencia pendência|pendencias pendências|inicio início|midia mídia|midias mídias|video vídeo|videos vídeos|conteudo conteúdo|conteudos conteúdos|usuario usuário|usuarios usuários|funcionario funcionário|funcionarios funcionários|calendario calendário|horario horário|horarios horários|salario salário|comentario comentário|comentarios comentários|cenario cenário|diario diário|especifico específico|especifica específica|automatico automático|automatica automática|automaticos automáticos|automaticas automáticas|metodo método|titulo título|nivel nível|niveis níveis|facil fácil|dificil difícil|util útil|uteis úteis|saude saúde|orcamento orçamento|orcamentos orçamentos|preco preço|precos preços|servico serviço|servicos serviços|comecar começar|comeco começo|endereco endereço|forca força|licenca licença|diferenca diferença|mudanca mudança|mudancas mudanças|seguranca segurança|cobranca cobrança|lancamento lançamento|lancamentos lançamentos|balanco balanço|almoco almoço|espaco espaço|alcancar alcançar|padrao padrão|padroes padrões|botao botão|botoes botões|razao razão|visao visão|versao versão|versoes versões|conexao conexão|sessao sessão|comissao comissão|gestao gestão|questao questão|questoes questões|decisao decisão|decisoes decisões|reuniao reunião|reunioes reuniões|expansao expansão|prioritario prioritário|prioritaria prioritária|proprio próprio|propria própria|proprios próprios|proprias próprias|duvida dúvida|duvidas dúvidas|sugestao sugestão|sugestoes sugestões|indice índice|indices índices|metrica métrica|metricas métricas|grafico gráfico|graficos gráficos|equivoco equívoco|veiculo veículo`;
const DIC = new Map();
LISTA.split('|').forEach(p => { const [a, b] = p.trim().split(' '); if(a && b && a !== b && !/[-.]/.test(a)) DIC.set(a, b); });
function acentuar(w){
  const k = w.toLowerCase();
  let r = DIC.get(k);
  if(!r && k.length >= 4 && k !== 'cacao'){
    if(/cao$/.test(k)) r = k.replace(/cao$/, 'ção');
    else if(/coes$/.test(k)) r = k.replace(/coes$/, 'ções');
    else if(/(ss|ns|rs|ls)ao$/.test(k)) r = k.replace(/ao$/, 'ão');
  }
  if(!r) return null;
  if(w === w.toUpperCase() && w.length > 1) return r.toUpperCase();
  if(w[0] === w[0].toUpperCase()) return r[0].toUpperCase() + r.slice(1);
  return r;
}
const LETRA = /[A-Za-zÀ-ÿ]/;
document.addEventListener('input', e => {
  const el = e.target;
  if(mexendo || !auto() || !ehCampo(el)) return;
  const fimPalavra = (e.inputType === 'insertText' && /^[\s.,;:!?)]$/.test(e.data || '')) || e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph';
  if(!fimPalavra) return;
  const txt = textoDe(el), cur = cursorDe(el); if(cur < 2) return;
  let fim = cur - 1; if(e.inputType !== 'insertText') fim = cur;
  // a palavra que acabou de ser digitada
  let fimP = fim; while(fimP > 0 && /\s/.test(txt[fimP - 1]) && e.inputType !== 'insertText') fimP--;
  let ini = fimP; while(ini > 0 && LETRA.test(txt[ini - 1])) ini--;
  const w = txt.slice(ini, fimP); if(!w || /[@/\d]/.test(txt.slice(Math.max(0, ini - 1), fimP + 1))) return;
  let novo = acentuar(w) || w;
  // maiúscula no começo da frase (início do campo, nova linha ou depois de . ! ?)
  const antes = txt.slice(0, ini);
  if(/^[a-zà-ÿ]/.test(novo) && (/^\s*$/.test(antes) || /[.!?]\s+$/.test(antes) || /\n\s*$/.test(antes)) && el.tagName !== 'INPUT') novo = novo[0].toUpperCase() + novo.slice(1);
  if(novo !== w) trocar(el, ini, fimP, novo);
});

/* ---------- ao parar de digitar: revisão completa ---------- */
const css = document.createElement('style');
css.textContent = `
  .crt-selo{position:fixed;z-index:2147483000;display:none;align-items:center;gap:6px;font:10px/1 var(--font, sans-serif);letter-spacing:.14em;text-transform:uppercase;background:#fff;border:1px solid #f2c6dd;color:#8a7d86;border-radius:999px;padding:5px 10px;box-shadow:0 6px 16px -8px rgba(255,62,165,.45);cursor:pointer;user-select:none}
  .crt-selo.on{display:inline-flex}
  .crt-selo i{width:6px;height:6px;border-radius:50%;background:#c9bfc6;display:inline-block}
  .crt-selo.ok i{background:#3fb37f}.crt-selo.tem{color:#c2187a;border-color:#ff9fcf}.crt-selo.tem i{background:#ff3ea5}
  .crt-selo.ind i{animation:crtPisca 1s ease-in-out infinite}
  @keyframes crtPisca{50%{opacity:.25}}
  .crt-pop{position:fixed;z-index:2147483001;width:min(360px,calc(100vw - 24px));max-height:340px;overflow:auto;background:#fff;border:1px solid #f4dcea;border-radius:16px;box-shadow:0 24px 50px -20px rgba(255,62,165,.5);padding:12px;display:none;font-family:var(--font, sans-serif)}
  .crt-pop.on{display:grid;gap:8px}
  .crt-pop .cab{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8a7d86}
  .crt-pop .cab button,.crt-pop .rod button{font-size:9px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #f2c6dd;border-radius:999px;background:#fff;color:#c2187a;padding:5px 10px;cursor:pointer}
  .crt-it{border:1px solid #f1e6ec;border-radius:12px;padding:8px 10px;display:grid;gap:6px;font-size:13px;color:#414142}
  .crt-it .msg{font-size:12px;color:#5b5b60;line-height:1.4}
  .crt-it s{color:#c2187a}
  .crt-it .ops{display:flex;gap:6px;flex-wrap:wrap}
  .crt-it .ops button{font-size:12px;border:1px solid #ff9fcf;background:#fff3f9;color:#414142;border-radius:999px;padding:4px 10px;cursor:pointer}
  .crt-it .ops button.ign{border-color:#eee;background:#fff;color:#8a7d86;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
  .crt-pop .vazio{font-size:12px;color:#5b5b60;padding:6px 2px}
  .crt-pop .rod{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:11px;color:#8a7d86}
`;
document.head.appendChild(css);
const selo = document.createElement('div'); selo.className = 'crt-selo'; selo.innerHTML = '<i></i><span>Português</span>';
const pop = document.createElement('div'); pop.className = 'crt-pop';
let ATUAL = null, SUG = [], IGNORADOS = new Set(), tRev = null, seq = 0, ultimaChamada = 0;

function lugar(el){      // selo e lista ficam no mesmo "andar" da janela aberta (senão somem atrás dela)
  const casa = el.closest('dialog[open]') || document.body;
  if(selo.parentNode !== casa) casa.appendChild(selo);
  if(pop.parentNode !== casa) casa.appendChild(pop);
  const r = el.getBoundingClientRect();
  selo.classList.add('on');
  const w = selo.offsetWidth;
  selo.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.right - w - 6)) + 'px';
  selo.style.top = Math.max(8, Math.min(innerHeight - 30, r.bottom - 12)) + 'px';
  if(pop.classList.contains('on')){
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(innerWidth - pw - 8, r.right - pw)) + 'px';
    const abaixo = r.bottom + 22;
    pop.style.top = (abaixo + ph < innerHeight - 8 ? abaixo : Math.max(8, r.top - ph - 8)) + 'px';
  }
}
function estadoSelo(cls, txt){ selo.className = 'crt-selo on ' + cls; selo.lastChild.textContent = txt; if(ATUAL) lugar(ATUAL); }
function esconder(){ selo.classList.remove('on'); pop.classList.remove('on'); }

document.addEventListener('focusin', e => {
  const el = e.target;
  if(selo.contains(el) || pop.contains(el)) return;
  if(!ehCampo(el)){ if(!pop.contains(el)){ ATUAL = null; esconder(); } return; }
  if(ATUAL !== el){ ATUAL = el; SUG = []; pop.classList.remove('on'); }
  estadoSelo(SUG.length ? 'tem' : '', SUG.length ? SUG.length + (SUG.length > 1 ? ' sugestões' : ' sugestão') : 'Português');
  if(textoDe(el).trim().length > 3) agendar(el, 300);
});
document.addEventListener('focusout', e => {
  setTimeout(() => {
    const a = document.activeElement;
    if(a && (selo.contains(a) || pop.contains(a) || a === ATUAL)) return;
    if(pop.matches(':hover') || selo.matches(':hover')) return;
    esconder();
  }, 150);
});
document.addEventListener('input', e => { if(!mexendo && ehCampo(e.target)){ ATUAL = e.target; agendar(e.target, 1300); } });
window.addEventListener('scroll', () => { if(ATUAL && selo.classList.contains('on')) lugar(ATUAL); }, true);
window.addEventListener('resize', () => { if(ATUAL && selo.classList.contains('on')) lugar(ATUAL); });

function agendar(el, ms){
  clearTimeout(tRev);
  estadoSelo('ind', 'Revisando');
  tRev = setTimeout(() => revisar(el), ms);
}
// pedaço do texto em volta do cursor (texto grande vai em partes, para não pesar)
function janela(txt, cur){
  if(txt.length <= 4000) return [0, txt.length];
  let ini = Math.max(0, cur - 2500), fim = Math.min(txt.length, cur + 1200);
  const a = txt.lastIndexOf('\n', ini); ini = a < 0 ? 0 : a + 1;
  const b = txt.indexOf('\n', fim); fim = b < 0 ? txt.length : b;
  return [ini, fim];
}
const SEGUROS_CAT = new Set(['PUNCTUATION', 'TYPOGRAPHY', 'CASING']);
function seguroSozinho(m, trecho, txt, pos){
  const rep = (m.replacements || [])[0]; if(!rep) return false;
  const orig = trecho.slice(m.offset, m.offset + m.length), novo = rep.value;
  if(orig === novo) return false;
  const cat = (m.rule && m.rule.category && m.rule.category.id) || '';
  // nomes próprios e siglas não são mexidos
  if(/^[A-ZÀ-Ý]/.test(orig) && !(cat === 'CASING')) return false;
  if(/[@/\d]/.test(orig)) return false;
  // erro de digitação: só quando é a mesma palavra sem acento (nao → não)
  if(cat === 'TYPOS' || /MORFOLOGIK|HUNSPELL|SPELL/i.test(m.rule && m.rule.id || '')) return semAcento(orig) === semAcento(novo) && m.replacements.length >= 1;
  if(cat === 'CASING'){
    const antes = txt.slice(0, pos + m.offset);
    return semAcento(orig) === semAcento(novo) && (/^\s*$/.test(antes) || /[.!?]\s+$/.test(antes) || /\n\s*$/.test(antes));
  }
  if(SEGUROS_CAT.has(cat)) return Math.abs(novo.length - orig.length) <= 3 && semAcento(novo.replace(/[\s,.;:!?]/g, '')) === semAcento(orig.replace(/[\s,.;:!?]/g, ''));
  return false;
}
async function revisar(el){
  if(!el || !el.isConnected || !ehCampo(el)) return;
  const txt = textoDe(el); if(txt.trim().length < 4){ estadoSelo('ok', 'Português'); SUG = []; desenharPop(); return; }
  const cur = Math.max(0, cursorDe(el)); const [ini, fim] = janela(txt, cur);
  const trecho = txt.slice(ini, fim);
  // o servidor gratuito aceita ~20 revisões por minuto
  const espera = 3200 - (Date.now() - ultimaChamada); if(espera > 0){ clearTimeout(tRev); tRev = setTimeout(() => revisar(el), espera); return; }
  ultimaChamada = Date.now();
  const meu = ++seq;
  let j;
  try{
    const body = new URLSearchParams({ text:trecho, language:'pt-BR', level:'default' });
    const r = await fetch(LT, { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body });
    if(!r.ok) throw new Error(r.status);
    j = await r.json();
  }catch(_){ if(meu === seq) estadoSelo('', 'Revisão sem internet'); return; }
  if(meu !== seq || !el.isConnected) return;
  const agora = textoDe(el);
  if(agora.slice(ini, ini + trecho.length) !== trecho){ agendar(el, 900); return; }   // mudou enquanto revisava
  const ms = (j.matches || []).filter(m => !IGNORADOS.has(chaveIgn(m, trecho)));
  const cursorAgora = Math.max(0, cursorDe(el));
  const foco = document.activeElement === el;
  const automaticas = [], sugestoes = [];
  ms.forEach(m => {
    const abs = ini + m.offset;
    // não mexe na palavra que ainda está sendo digitada
    const longeDoCursor = !foco || abs + m.length < cursorAgora - 1 || abs > cursorAgora + 1;
    if(auto() && longeDoCursor && seguroSozinho(m, trecho, agora, ini)) automaticas.push(m);
    else if((m.replacements || []).length || /TYPOS|GRAMMAR|CONFUSED|PUNCTUATION|CASING|TYPOGRAPHY|SEMANTICS|AGREEMENT/.test((m.rule && m.rule.category && m.rule.category.id) || '')) sugestoes.push(m);
  });
  // aplica de trás para frente (as posições da frente não mudam)
  automaticas.sort((a, b) => b.offset - a.offset).forEach(m => trocar(el, ini + m.offset, ini + m.offset + m.length, m.replacements[0].value));
  // sugestões guardam a posição já ajustada pelas trocas feitas
  SUG = sugestoes.map(m => {
    const antesDela = automaticas.filter(a => a.offset < m.offset).reduce((s, a) => s + a.replacements[0].value.length - a.length, 0);
    const pos = ini + m.offset + antesDela;
    return { pos, len:m.length, orig:trecho.slice(m.offset, m.offset + m.length), msg:m.shortMessage || m.message, msgLonga:m.message,
      reps:(m.replacements || []).slice(0, 4).map(r => r.value), ign:chaveIgn(m, trecho) };
  });
  estadoSelo(SUG.length ? 'tem' : 'ok', SUG.length ? SUG.length + (SUG.length > 1 ? ' sugestões' : ' sugestão') : (automaticas.length ? 'Corrigido ✓' : 'Português ✓'));
  desenharPop();
}
const chaveIgn = (m, trecho) => ((m.rule && m.rule.id) || '') + '|' + trecho.slice(m.offset, m.offset + m.length).toLowerCase();

const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function desenharPop(){
  if(!pop.classList.contains('on')) return;
  pop.innerHTML = `<div class="cab"><span>Revisão de português</span>${SUG.some(s => s.reps.length) ? '<button type="button" data-crt-todas>Aplicar todas</button>' : ''}</div>` +
    (SUG.length ? SUG.map((s, i) => `<div class="crt-it"><div><s>${escH(s.orig || '(espaço)')}</s></div><div class="msg">${escH(s.msgLonga)}</div>
      <div class="ops">${s.reps.map((r, k) => `<button type="button" data-crt="${i}" data-k="${k}">${escH(r || '(apagar)')}</button>`).join('')}<button type="button" class="ign" data-crt-ign="${i}">Ignorar</button></div></div>`).join('')
      : '<div class="vazio">Nada para corrigir neste campo.</div>') +
    `<div class="rod"><span>Correção automática</span><button type="button" data-crt-auto>${auto() ? 'Ligada' : 'Desligada'}</button></div>`;
  if(ATUAL) lugar(ATUAL);
}
function aplicarSug(i, k){
  const s = SUG[i]; if(!s || !ATUAL) return;
  const txt = textoDe(ATUAL);
  if(txt.slice(s.pos, s.pos + s.len) !== s.orig) return false;
  const novo = s.reps[k];
  trocar(ATUAL, s.pos, s.pos + s.len, novo);
  const d = novo.length - s.len;
  SUG.splice(i, 1); SUG.forEach(o => { if(o.pos > s.pos) o.pos += d; });
  return true;
}
selo.addEventListener('mousedown', e => e.preventDefault());       // não tira o foco do campo
pop.addEventListener('mousedown', e => e.preventDefault());
selo.addEventListener('click', () => { pop.classList.toggle('on'); desenharPop(); if(ATUAL) lugar(ATUAL); });
pop.addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.crtAuto !== undefined){ localStorage.setItem(KLIGADO, auto() ? 'nao' : 'sim'); desenharPop(); return; }
  if(b.dataset.crtIgn !== undefined){ const s = SUG[+b.dataset.crtIgn]; if(s){ IGNORADOS.add(s.ign); SUG.splice(+b.dataset.crtIgn, 1); } }
  else if(b.dataset.crtTodas !== undefined){ for(let i = SUG.length - 1; i >= 0; i--){ if(SUG[i].reps.length && !aplicarSug(i, 0)){ /* texto mudou */ } } SUG = SUG.filter(s => !s.reps.length); }
  else if(b.dataset.crt !== undefined){ if(aplicarSug(+b.dataset.crt, +b.dataset.k) === false) agendar(ATUAL, 100); }
  estadoSelo(SUG.length ? 'tem' : 'ok', SUG.length ? SUG.length + (SUG.length > 1 ? ' sugestões' : ' sugestão') : 'Português ✓');
  desenharPop();
});
document.addEventListener('keydown', e => { if(e.key === 'Escape' && pop.classList.contains('on')){ pop.classList.remove('on'); } }, true);
})();
