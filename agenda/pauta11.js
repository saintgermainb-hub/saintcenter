/* Agenda Coordenação · Pauta 1:1
Uma pasta por colaborador com os pontos notados no dia a dia (processo, comportamento, atraso, atitude, melhoria…),
com texto, fotos e documentos. Fica em aberto até ser tratado no 1:1; ao finalizar, recebe a data e trava.
Nome, setor e turno vêm do Acessos (e podem ser completados aqui). */
(function(){
if(typeof LIBERADO === 'undefined' || !LIBERADO) return;

const TAGS_BASE = ['Processo','Comportamento','Atraso','Atitude','Melhoria','Elogio','Treinamento'];
const TURNOS = ['1º turno','2º turno','Comercial'];
const p2 = n => String(n).padStart(2, '0');
const isoD = d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
const dmy = s => s ? s.slice(8,10) + '/' + s.slice(5,7) + '/' + s.slice(0,4) : '';
const quando = s => s ? new Date(s).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';

/* ---------- dados ---------- */
function base(){
if(!DB.pauta11 || typeof DB.pauta11 !== 'object') DB.pauta11 = {};
const b = DB.pauta11;
if(!Array.isArray(b.pontos)) b.pontos = [];
if(!Array.isArray(b.colabs)) b.colabs = [];
if(!Array.isArray(b.tags)) b.tags = [];
return b;
}
const colabs = () => base().colabs;
const pontos = () => base().pontos;
const colab = id => colabs().find(c => c.id === id);
const todasTags = () => TAGS_BASE.concat(base().tags.filter(t => !TAGS_BASE.includes(t)));
const abertosDe = id => pontos().filter(p => p.status !== 'finalizado' && (!id || p.colabId === id)).length;
const ordemNome = (a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
const setorTurno = c => [c && c.setor, c && c.turno].filter(Boolean).join(' · ');

/* ---------- Acessos: nome, setor e turno ---------- */
const API_ACESSOS = 'https://script.google.com/macros/s/AKfycbwQPyL6HaJGebsEyQjYYmc6zqh4hLRFYrwD4fWBntIb6zAwH9YzUIVMlMosWojUa-U/exec';
const CAMPOS_TURNO = ['turno','periodo','horario','turma','escala'];
async function puxarAcessos(manual){
const tk = localStorage.getItem('sc-token') || '';
if(!tk){ if(manual) toast('Abra a agenda pelo Saint Center para puxar do Acessos.'); return; }
try{
const r = await fetch(API_ACESSOS, { method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify({ fn:'carregar', args:[tk] }) });
const j = await r.json(); if(!j.ok) throw new Error(j.erro || 'erro');
const pos = (j.resultado && j.resultado.posicoes) || [];
let novos = 0, atual = 0;
pos.forEach(p => {
const nome = String(p.resp || '').trim(); if(!nome || p.status === 'off') return;
const campo = CAMPOS_TURNO.find(k => p[k]);
const turno = campo ? String(p[campo]).trim() : '';
const setor = String(p.setor || '').trim();
const ja = colabs().find(c => norm(c.nome) === norm(nome));
if(ja){
if(!ja.manual && ((setor && ja.setor !== setor) || (turno && ja.turno !== turno))){ ja.setor = setor || ja.setor; ja.turno = turno || ja.turno; ja.origem = 'acessos'; atual++; }
} else { colabs().push({ id:uid(), nome, setor, turno, origem:'acessos' }); novos++; }
});
base().acessosEm = isoD(new Date());
salvar(); render();
if(manual) toast(novos || atual ? `Do Acessos: ${novos} novo(s), ${atual} atualizado(s).` : 'Lista já está igual à do Acessos.');
}catch(e){ if(manual) toast('Não consegui falar com o Acessos agora. Entre de novo pelo Saint Center e tente outra vez.'); }
}

/* ---------- anexos (guardados como os anexos de reunião) ---------- */
const URLS = {};
async function urlDe(id){
if(URLS[id]) return URLS[id];
try{ const u = window.SG_anexos && await SG_anexos.abrirArquivo(id); if(u) URLS[id] = u; return u || ''; }catch(_){ return ''; }
}
function anexosHTML(l, editar){
if(!l || !l.length) return '';
return `<div class="p11-anx">${l.map((a, i) => {
const img = /^image\//.test(a.tipo || '');
return `<button type="button" class="p11-th" data-p11-arq="${esc(a.id)}" title="${esc(a.nome)}">${img ? `<img data-p11-img="${esc(a.id)}" alt="${esc(a.nome)}">` : `<span>${esc(a.nome || 'arquivo')}</span>`}${editar ? `<span class="p11-x" data-p11-rm="${i}" aria-label="Remover">×</span>` : ''}</button>`;
}).join('')}</div>`;
}
function carregarImgs(raiz){
raiz.querySelectorAll('img[data-p11-img]').forEach(async im => { const u = await urlDe(im.dataset.p11Img); if(u) im.src = u; });
}
async function abrirArq(id){
const u = await urlDe(id);
if(u) window.open(u, '_blank', 'noopener'); else toast('Esse arquivo não está neste computador.');
}

/* ---------- aparência ---------- */
const css = document.createElement('style');
css.textContent = `
.p11{display:grid;grid-template-columns:260px minmax(0,1fr);gap:18px;align-items:start}
.p11-pastas{display:grid;gap:6px;position:sticky;top:12px}
.p11-pasta{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #f4dcea;border-radius:14px;padding:10px 12px;background:#fff;min-height:48px}
.p11-pasta:hover{border-color:var(--rosa2)}
.p11-pasta[aria-pressed="true"]{border-color:var(--rosa);box-shadow:0 0 0 3px var(--rosa-claro)}
.p11-pasta svg{flex:none;width:20px;height:20px;color:#77503f}
.p11-pasta .nm{flex:1;font-size:14px;line-height:1.25}
.p11-pasta .nm small{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--g2);margin-top:2px}
.p11-pasta .ct{flex:none;min-width:22px;text-align:center;font-size:11px;border-radius:999px;padding:2px 7px;background:var(--rosa-claro);color:var(--pink)}
.p11-pasta .ct.zero{background:#f6f2f4;color:var(--g3)}
.p11-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:12px}
.p11-cab h2{font-size:24px!important;margin:4px 0 2px!important}
.p11-fil{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:14px}
.p11-fil input{flex:1 1 200px;width:auto;border-radius:999px}
.p11-pt{border:1px solid #f4dcea;border-radius:14px;padding:14px 16px;background:#fff;margin-bottom:10px}
.p11-pt.fim{background:#fcfafc}
.p11-pt .top{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font-size:11px;color:var(--g2);letter-spacing:.04em}
.p11-pt .top b{font-weight:400;font-size:14px;color:var(--fg);letter-spacing:0}
.p11-tag{display:inline-block;font-size:9px;letter-spacing:.16em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--rosa-claro);color:var(--pink);border:1px solid #f7c6e2}
.p11-pt .txt{white-space:pre-wrap;font-size:14px;line-height:1.55;margin:8px 0 0;word-break:break-word}
.p11-trat{margin-top:10px;padding:10px 12px;border-radius:12px;background:#f3ecff;border:1px solid #e3d3ff;font-size:13px;line-height:1.5}
.p11-trat .k{color:#6b4fa8}
.p11-trat p{margin:4px 0 0;white-space:pre-wrap}
.p11-pt .bts{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.p11-anx{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.p11-th{position:relative;width:78px;height:78px;border-radius:12px;border:1px solid #f4dcea;background:#faf7fb;overflow:hidden;display:grid;place-items:center;padding:4px;font-size:10px;line-height:1.2;color:var(--g1);word-break:break-all}
.p11-th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.p11-x{position:absolute;top:3px;right:3px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;font-size:14px;line-height:22px;text-align:center;z-index:2}
.p11-drop{border:1.5px dashed #f0c9df;border-radius:14px;padding:12px;text-align:center;color:var(--g2);font-size:12px;background:var(--rosa-bg)}
.p11-drop.on{border-color:var(--pink);color:var(--pink)}
.p11-tags{display:flex;flex-wrap:wrap;gap:6px}
.p11-cad{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,.9fr) auto;gap:6px;align-items:center;margin-bottom:6px}
.p11-cad input,.p11-cad select{padding:8px 10px}
.p11-cad small{grid-column:1/-1;margin-top:-2px;font-size:10px;color:var(--g3);letter-spacing:.08em}
.p11-cad button{color:var(--g2);font-size:18px;padding:0 8px}
@media (max-width:900px){ .p11{grid-template-columns:1fr} .p11-pastas{position:static;display:flex;overflow-x:auto;padding-bottom:4px} .p11-pasta{flex:none;min-width:170px} }
@media (max-width:640px){ .p11-cad{grid-template-columns:1fr 1fr} .p11-cad input:first-child{grid-column:1/-1} }
`;
document.head.appendChild(css);
const PASTA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7.5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

/* ---------- aba ---------- */
const nav = document.querySelector('nav.abas');
const bAba = document.createElement('button');
bAba.setAttribute('role', 'tab'); bAba.dataset.aba = 'pauta11'; bAba.setAttribute('aria-selected', 'false'); bAba.textContent = 'Pauta 1:1';
const refA = nav && (nav.querySelector('[data-aba="datas"]') || nav.querySelector('[data-aba="projetos"]') || nav.querySelector('[data-aba="objetivos"]'));
if(refA) refA.after(bAba); else if(nav) nav.appendChild(bAba);
const sec = document.createElement('section'); sec.id = 'aba-pauta11'; sec.hidden = true;
(document.getElementById('aba-datas') || document.getElementById('aba-projetos') || document.getElementById('aba-objetivos')).after(sec);
const irAbaAnt = irAba;
irAba = function(a){ irAbaAnt(a); sec.hidden = a !== 'pauta11'; if(a === 'pauta11' && (base().acessosEm || '') !== isoD(new Date())) puxarAcessos(false); };
bAba.onclick = () => irAba('pauta11');

let SEL = '', FILTRO = 'aberto', BUSCA = '';

function desenhar(){
base();
if(SEL && !colab(SEL)) SEL = '';
const cs = colabs().slice().sort(ordemNome);
const c = colab(SEL);
const q = norm(BUSCA);
const l = pontos().filter(p => (!SEL || p.colabId === SEL)
&& (FILTRO === 'todos' || (FILTRO === 'finalizado' ? p.status === 'finalizado' : p.status !== 'finalizado'))
&& (!q || norm([p.nome, p.texto, p.tratativa, (p.tags || []).join(' ')].join(' ')).includes(q)))
.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
const nAb = abertosDe(SEL), nFim = pontos().filter(p => p.status === 'finalizado' && (!SEL || p.colabId === SEL)).length;

sec.innerHTML = `<div class="p11">
<div class="p11-pastas">
<button class="p11-pasta" data-p11-sel="" aria-pressed="${!SEL}">${PASTA}<span class="nm">Todos<small>todas as pastas</small></span><span class="ct ${abertosDe('') ? '' : 'zero'}">${abertosDe('')}</span></button>
${cs.map(x => { const n = abertosDe(x.id); return `<button class="p11-pasta" data-p11-sel="${esc(x.id)}" aria-pressed="${SEL === x.id}">${PASTA}<span class="nm">${esc(x.nome)}<small>${esc(setorTurno(x) || 'sem setor')}</small></span><span class="ct ${n ? '' : 'zero'}">${n}</span></button>`; }).join('')}
<button class="btn ghost min" data-p11="colabs" style="margin-top:6px">Colaboradores, setor e turno</button>
</div>
<div class="card">
<div class="p11-cab"><div><span class="k">${c ? 'Pasta do próximo 1:1' : 'Pauta 1:1'}</span><h2>${c ? esc(c.nome) : 'Todos os colaboradores'}</h2>
<div class="mut" style="font-size:12px">${c ? esc(setorTurno(c) || 'Setor e turno não cadastrados') + ' · ' : ''}${nAb} em aberto · ${nFim} finalizado(s)</div></div>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost min" data-p11="copiar">Copiar pauta</button><button class="btn" data-p11="novo">+ Registrar ponto</button></div></div>
<div class="p11-fil">
<button class="pill" data-p11-f="aberto" aria-pressed="${FILTRO === 'aberto'}">Em aberto</button>
<button class="pill" data-p11-f="finalizado" aria-pressed="${FILTRO === 'finalizado'}">Finalizados</button>
<button class="pill" data-p11-f="todos" aria-pressed="${FILTRO === 'todos'}">Todos</button>
<input type="search" id="p11Busca" placeholder="Buscar texto, tag ou pedido" value="${esc(BUSCA)}">
</div>
${l.length ? l.map(cartao).join('') : `<div class="vazio">${pontos().length ? 'Nada aqui com esse filtro.' : 'Nenhum ponto ainda. Quando notar algo no dia a dia, use “Registrar ponto” e ele fica guardado na pasta do colaborador até o 1:1.'}</div>`}
</div></div>`;
carregarImgs(sec);
}

function cartao(p){
const fim = p.status === 'finalizado';
return `<div class="p11-pt ${fim ? 'fim' : ''}">
<div class="top">${!SEL ? `<b>${esc(p.nome)}</b>` : ''}${setorTurno(p) ? `<span>${esc(setorTurno(p))}</span>` : ''}<span>Registrado em ${esc(quando(p.criadoEm))}</span>${fim ? '<span>🔒 Finalizado</span>' : ''}</div>
${(p.tags || []).length ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px">${p.tags.map(t => `<span class="p11-tag">${esc(t)}</span>`).join('')}</div>` : ''}
${p.texto ? `<div class="txt">${esc(p.texto)}</div>` : ''}
${anexosHTML(p.anexos, false)}
${fim || p.tratativa ? `<div class="p11-trat"><span class="k">${fim ? 'Tratado no 1:1 de ' + esc(dmy(p.finalizadoEm)) : 'Anotação do 1:1 · ainda em aberto'}</span><p>${esc(p.tratativa || 'Sem anotação.')}</p></div>` : ''}
${fim ? '' : `<div class="bts"><button class="btn min" data-p11-trat="${esc(p.id)}">Tratar no 1:1</button><button class="btn ghost min" data-p11-ed="${esc(p.id)}">Editar</button></div>`}
</div>`;
}

sec.addEventListener('click', e => {
const arq = e.target.closest('[data-p11-arq]'); if(arq){ abrirArq(arq.dataset.p11Arq); return; }
const s = e.target.closest('[data-p11-sel]'); if(s){ SEL = s.dataset.p11Sel; desenhar(); return; }
const f = e.target.closest('[data-p11-f]'); if(f){ FILTRO = f.dataset.p11F; desenhar(); return; }
const ed = e.target.closest('[data-p11-ed]'); if(ed){ abrirPonto(pontos().find(p => p.id === ed.dataset.p11Ed)); return; }
const tr = e.target.closest('[data-p11-trat]'); if(tr){ abrirTratar(pontos().find(p => p.id === tr.dataset.p11Trat)); return; }
const b = e.target.closest('[data-p11]'); if(!b) return;
const q = b.dataset.p11;
if(q === 'novo'){ if(!colabs().length){ toast('Cadastre ou puxe os colaboradores primeiro.'); abrirColabs(); } else abrirPonto(null); }
if(q === 'colabs') abrirColabs();
if(q === 'copiar') copiar();
});
sec.addEventListener('input', e => { if(e.target.id === 'p11Busca'){ BUSCA = e.target.value; const pos = e.target.selectionStart; desenhar(); const i = $('p11Busca'); i.focus(); try{ i.setSelectionRange(pos, pos); }catch(_){} } });

async function copiar(){
const l = pontos().filter(p => p.status !== 'finalizado' && (!SEL || p.colabId === SEL))
.sort((a, b) => ordemNome(a, b) || (a.criadoEm || '').localeCompare(b.criadoEm || ''));
if(!l.length){ toast('Nenhum ponto em aberto.'); return; }
let txt = '', ult = '';
l.forEach(p => {
if(p.nome !== ult){ txt += (txt ? '\n' : '') + 'PAUTA 1:1 · ' + p.nome + (setorTurno(p) ? ' (' + setorTurno(p) + ')' : '') + '\n'; ult = p.nome; }
txt += '• ' + ((p.tags || []).length ? '[' + p.tags.join(', ') + '] ' : '') + quando(p.criadoEm).slice(0, 10) + ': ' + String(p.texto || '').replace(/\s*\n+\s*/g, ' ') + '\n';
});
try{ await navigator.clipboard.writeText(txt); toast('Pauta copiada.'); }catch(_){ toast('Não consegui copiar.'); }
}

/* ---------- diálogos ---------- */
document.body.insertAdjacentHTML('beforeend', `
<dialog id="dlgP11"><form class="dlg" id="fP11" method="dialog">
<h3 id="p11Tit">Registrar ponto</h3>
<label class="c"><span class="k">Colaborador</span><select id="p11Colab"></select></label>
<div class="mut" id="p11Info" style="font-size:12px;margin-top:-6px"></div>
<div class="c"><span class="k">Do que se trata</span><div class="p11-tags" id="p11Tags"></div>
<div style="display:flex;gap:8px;margin-top:4px"><input id="p11TagNova" placeholder="Outra tag"><button type="button" class="btn ghost min" id="p11TagAdd">Adicionar</button></div></div>
<label class="c"><span class="k">O que aconteceu</span><textarea id="p11Texto" rows="5" placeholder="Ex.: aceitou a troca de um erro da expedição e não lançou na planilha"></textarea></label>
<div class="c"><span class="k">Fotos e documentos</span>
<div class="p11-drop" id="p11Drop">Cole aqui com Ctrl+V, arraste os arquivos ou <label class="btn ghost min" style="cursor:pointer">escolher arquivo<input type="file" id="p11Arq" multiple hidden></label></div>
<div id="p11Anx"></div></div>
<div class="rodape"><button type="button" class="btn perigo min" id="p11Excluir">Excluir</button>
<div class="dir"><button type="button" class="btn ghost" id="p11Cancelar">Cancelar</button><button type="submit" class="btn" id="p11Salvar">Salvar em aberto</button></div></div>
</form></dialog>
<dialog id="dlgP11Trat"><form class="dlg" id="fP11Trat" method="dialog">
<h3>Tratar no 1:1</h3>
<div id="p11TrResumo"></div>
<label class="c"><span class="k">O que foi conversado e combinado</span><textarea id="p11TrTexto" rows="5"></textarea></label>
<label class="c"><span class="k">Data do 1:1</span><input type="date" id="p11TrData" required></label>
<p class="mut" style="margin:0;font-size:12px">Ao finalizar, o ponto fecha e não pode mais ser editado.</p>
<div class="rodape"><span></span><div class="dir"><button type="button" class="btn ghost" id="p11TrCancelar">Cancelar</button><button type="button" class="btn ghost" id="p11TrSalvar">Salvar anotação</button><button type="submit" class="btn" id="p11TrFinal">Finalizar</button></div></div>
</form></dialog>
<dialog id="dlgP11Col"><form class="dlg" id="fP11Col" method="dialog">
<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3>Colaboradores</h3><button type="button" class="btn ghost min" id="p11ColAcessos">Puxar do Acessos</button></div>
<p class="mut" style="margin:0;font-size:12px">Nome, setor e turno vêm do Acessos. O que você mudar aqui fica valendo.</p>
<div id="p11ColLista"></div>
<button type="button" class="btn ghost min" id="p11ColAdd" style="justify-self:start">+ Colaborador</button>
<div class="rodape"><span></span><div class="dir"><button type="button" class="btn ghost" id="p11ColCancelar">Cancelar</button><button type="submit" class="btn">Salvar</button></div></div>
</form></dialog>`);

/* registrar / editar */
let ED = null, R = null, ENV = 0, VOLTA = false;
function abrirPonto(p){
if(p && p.status === 'finalizado'){ toast('Ponto finalizado não pode ser editado.'); return; }
ED = p || null;
R = { colabId: p ? p.colabId : (SEL || ''), tags: (p && p.tags || []).slice(), anexos: (p && p.anexos || []).slice() };
$('p11Tit').textContent = p ? 'Editar ponto' : 'Registrar ponto';
$('p11Texto').value = p ? (p.texto || '') : ''; $('p11TagNova').value = '';
$('p11Excluir').hidden = !p; $('p11Excluir').dataset.c = ''; $('p11Excluir').textContent = 'Excluir';
formP();
$('dlgP11').showModal(); setTimeout(() => $('p11Texto').focus(), 40);
}
function formP(){
$('p11Colab').innerHTML = '<option value="">Selecione…</option>' + colabs().slice().sort(ordemNome).map(c => `<option value="${esc(c.id)}">${esc(c.nome)}</option>`).join('') + '<option value="__novo">+ Novo colaborador…</option>';
$('p11Colab').value = R.colabId || '';
const c = colab(R.colabId);
$('p11Info').textContent = c ? 'Setor: ' + (c.setor || '—') + ' · Turno: ' + (c.turno || '—') : '';
$('p11Tags').innerHTML = todasTags().map(t => `<button type="button" class="pill" data-p11-tag="${esc(t)}" aria-pressed="${R.tags.includes(t)}">${esc(t)}</button>`).join('');
$('p11Anx').innerHTML = anexosHTML(R.anexos, true) + (ENV ? `<div class="mut" style="font-size:12px;margin-top:6px">Anexando ${ENV}…</div>` : '');
carregarImgs($('p11Anx'));
$('p11Salvar').disabled = ENV > 0;
}
$('p11Colab').onchange = e => {
if(e.target.value === '__novo'){ e.target.value = R.colabId || ''; VOLTA = true; abrirColabs(true); return; }
R.colabId = e.target.value; formP();
};
$('p11Tags').onclick = e => { const b = e.target.closest('[data-p11-tag]'); if(!b) return; const t = b.dataset.p11Tag; R.tags = R.tags.includes(t) ? R.tags.filter(x => x !== t) : R.tags.concat(t); formP(); };
$('p11TagAdd').onclick = () => {
const t = $('p11TagNova').value.trim(); if(!t) return;
const ja = todasTags().find(x => norm(x) === norm(t));
const nome = ja || t.charAt(0).toUpperCase() + t.slice(1);
if(!ja){ base().tags.push(nome); salvar(); }
if(!R.tags.includes(nome)) R.tags.push(nome);
$('p11TagNova').value = ''; formP();
};
$('p11TagNova').onkeydown = e => { if(e.key === 'Enter'){ e.preventDefault(); $('p11TagAdd').click(); } };
$('p11Anx').onclick = e => {
const rm = e.target.closest('[data-p11-rm]'); if(rm){ e.preventDefault(); e.stopPropagation(); R.anexos.splice(+rm.dataset.p11Rm, 1); formP(); return; }
const a = e.target.closest('[data-p11-arq]'); if(a) abrirArq(a.dataset.p11Arq);
};
async function anexar(files){
files = [...(files || [])].filter(Boolean); if(!files.length) return;
if(!window.SG_anexos){ toast('Anexos indisponíveis agora.'); return; }
for(const f of files){
ENV++; formP();
try{
const ext = (f.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
const nome = f.name && f.name !== 'image.png' ? f.name : 'print-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.' + ext;
const id = await SG_anexos.guardar(f);
R.anexos.push({ id, nome, tipo:f.type || '', tamanho:f.size || 0 });
}catch(_){ toast('Não consegui anexar ' + (f.name || 'o arquivo') + '.'); }
ENV--; formP();
}
}
$('p11Arq').onchange = e => { anexar(e.target.files); e.target.value = ''; };
const drop = $('p11Drop');
drop.ondragover = e => { e.preventDefault(); drop.classList.add('on'); };
drop.ondragleave = () => drop.classList.remove('on');
drop.ondrop = e => { e.preventDefault(); drop.classList.remove('on'); anexar(e.dataTransfer.files); };
$('dlgP11').addEventListener('paste', e => { const fs = [...((e.clipboardData && e.clipboardData.files) || [])]; if(fs.length){ e.preventDefault(); anexar(fs); } });
$('fP11').addEventListener('submit', e => {
e.preventDefault();
const c = colab(R.colabId); if(!c){ toast('Selecione o colaborador.'); return; }
const texto = $('p11Texto').value.trim();
if(!texto && !R.anexos.length){ toast('Escreva o que aconteceu ou anexe algo.'); return; }
const d = { colabId:c.id, nome:c.nome, setor:c.setor || '', turno:c.turno || '', tags:R.tags.slice(), texto, anexos:R.anexos.slice() };
if(ED){ if(ED.status === 'finalizado') return; Object.assign(ED, d); }
else pontos().push(Object.assign({ id:uid(), status:'aberto', criadoEm:new Date().toISOString() }, d));
salvar(); $('dlgP11').close(); render();
toast(ED ? 'Ponto atualizado.' : 'Guardado na pasta de ' + c.nome + '.');
});
$('p11Cancelar').onclick = () => $('dlgP11').close();
$('p11Excluir').onclick = () => {
if(!ED) return;
if($('p11Excluir').dataset.c !== '1'){ $('p11Excluir').dataset.c = '1'; $('p11Excluir').textContent = 'Confirmar exclusão'; return; }
base().pontos = pontos().filter(p => p.id !== ED.id); salvar(); $('dlgP11').close(); render(); toast('Ponto excluído.');
};

/* tratar no 1:1 */
let TR = null;
function abrirTratar(p){
if(!p || p.status === 'finalizado') return;
TR = p;
$('p11TrResumo').innerHTML = `<div class="p11-pt" style="margin:0"><div class="top"><b>${esc(p.nome)}</b><span>Registrado em ${esc(quando(p.criadoEm))}</span></div>
${(p.tags || []).length ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px">${p.tags.map(t => `<span class="p11-tag">${esc(t)}</span>`).join('')}</div>` : ''}
${p.texto ? `<div class="txt">${esc(p.texto)}</div>` : ''}${anexosHTML(p.anexos, false)}</div>`;
carregarImgs($('p11TrResumo'));
$('p11TrTexto').value = p.tratativa || ''; $('p11TrData').value = isoD(new Date());
$('p11TrFinal').dataset.c = ''; $('p11TrFinal').textContent = 'Finalizar';
$('dlgP11Trat').showModal();
}
$('p11TrResumo').onclick = e => { const a = e.target.closest('[data-p11-arq]'); if(a) abrirArq(a.dataset.p11Arq); };
$('p11TrCancelar').onclick = () => $('dlgP11Trat').close();
$('p11TrSalvar').onclick = () => { if(!TR) return; TR.tratativa = $('p11TrTexto').value.trim(); salvar(); $('dlgP11Trat').close(); render(); toast('Anotação salva. O ponto segue em aberto.'); };
$('fP11Trat').addEventListener('submit', e => {
e.preventDefault();
if(!TR) return;
if(!$('p11TrData').value){ toast('Informe a data do 1:1.'); return; }
if($('p11TrFinal').dataset.c !== '1'){ $('p11TrFinal').dataset.c = '1'; $('p11TrFinal').textContent = 'Confirmar: finalizar e travar'; return; }
Object.assign(TR, { tratativa:$('p11TrTexto').value.trim(), status:'finalizado', finalizadoEm:$('p11TrData').value, finalizadoReg:new Date().toISOString() });
salvar(); $('dlgP11Trat').close(); render(); toast('Ponto finalizado.');
});

/* colaboradores */
let CR = [];
function abrirColabs(comLinha){
CR = colabs().map(c => Object.assign({}, c)).sort(ordemNome);
if(comLinha === true || !CR.length) CR.push({ nome:'', setor:'', turno:'' });
if(comLinha !== true) VOLTA = false;
formC(); $('dlgP11Col').showModal();
}
function formC(){
const setores = [...new Set(colabs().map(c => c.setor).filter(Boolean))];
$('p11ColLista').innerHTML = `<datalist id="p11DlSet">${setores.map(s => `<option value="${esc(s)}">`).join('')}</datalist>` + CR.map((c, i) => `<div class="p11-cad">
<input data-i="${i}" data-k="nome" value="${esc(c.nome)}" placeholder="Nome" aria-label="Nome">
<input data-i="${i}" data-k="setor" value="${esc(c.setor)}" placeholder="Setor" list="p11DlSet" aria-label="Setor">
<select data-i="${i}" data-k="turno" aria-label="Turno"><option value="">Turno</option>${[...new Set(TURNOS.concat(c.turno ? [c.turno] : []))].map(t => `<option ${t === c.turno ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
<button type="button" data-rm="${i}" aria-label="Remover">×</button>
${c.origem === 'acessos' && !c.manual ? '<small>do Acessos</small>' : ''}</div>`).join('');
}
$('p11ColLista').addEventListener('input', e => { const el = e.target.closest('[data-k]'); if(el){ CR[+el.dataset.i][el.dataset.k] = el.value; CR[+el.dataset.i].mudou = true; } });
$('p11ColLista').addEventListener('change', e => { const el = e.target.closest('[data-k]'); if(el){ CR[+el.dataset.i][el.dataset.k] = el.value; CR[+el.dataset.i].mudou = true; } });
$('p11ColLista').addEventListener('click', e => {
const b = e.target.closest('[data-rm]'); if(!b) return;
const c = CR[+b.dataset.rm];
if(c.id && pontos().some(p => p.colabId === c.id)){ toast('Essa pessoa tem pontos registrados e não pode ser removida.'); return; }
CR.splice(+b.dataset.rm, 1); formC();
});
$('p11ColAdd').onclick = () => { CR.push({ nome:'', setor:'', turno:'' }); formC(); };
$('p11ColAcessos').onclick = async () => { await puxarAcessos(true); abrirColabsAtualizar(); };
function abrirColabsAtualizar(){ const novos = CR.filter(c => !c.id); CR = colabs().map(c => Object.assign({}, c)).sort(ordemNome).concat(novos); formC(); }
$('p11ColCancelar').onclick = () => { VOLTA = false; $('dlgP11Col').close(); };
$('fP11Col').addEventListener('submit', e => {
e.preventDefault();
let novo = null;
const ficam = CR.filter(c => String(c.nome || '').trim());
const ids = new Set(ficam.map(c => c.id).filter(Boolean));
base().colabs = colabs().filter(c => ids.has(c.id) || pontos().some(p => p.colabId === c.id));
ficam.forEach(c => {
const d = { nome:String(c.nome).trim(), setor:String(c.setor || '').trim(), turno:c.turno || '' };
const at = c.id && colab(c.id);
if(at){ if(c.mudou){ Object.assign(at, d, { manual:true }); pontos().forEach(p => { if(p.colabId === at.id && p.status !== 'finalizado') Object.assign(p, d); }); } }
else { novo = Object.assign({ id:uid(), origem:'manual', manual:true }, d); colabs().push(novo); }
});
salvar(); $('dlgP11Col').close(); render(); toast('Colaboradores salvos.');
if(VOLTA && $('dlgP11').open){ if(novo) R.colabId = novo.id; formP(); }
VOLTA = false;
});

/* ---------- liga tudo ---------- */
const renderAnt = render;
render = function(){ renderAnt.apply(this, arguments); try{ if(ABA === 'pauta11') desenhar(); }catch(err){ console.error(err); } };

window.SG_pauta11 = {
abertos: () => pontos().filter(p => p.status !== 'finalizado').map(p => ({ nome:p.nome, tags:p.tags, texto:p.texto, em:p.criadoEm })),
abrir(colabNome){ const c = colabNome && colabs().find(x => norm(x.nome).includes(norm(colabNome))); SEL = c ? c.id : ''; irAba('pauta11'); }
};
base();
})();
