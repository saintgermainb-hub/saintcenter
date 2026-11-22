/* Agenda Coordenação · ajustes (21/11)
   - Menu lateral: sem o laço grande em cima do nome; nome e setor com espaço entre eles.
   - Pauta: responsável em cada tópico e botão "Vincular" que leva o tópico para
     plano de ação, tarefa, pauta de outra reunião ou projeto (novo ou existente).
   - "Limpar pauta" e "Zerar reunião" (guardam uma cópia antes de apagar).
   Carregar por último:  <script src="ajustes.js?v=4"></script>                    */
(function(){
if(window.__sgAjustes) return; window.__sgAjustes = 1;

/* ---------- menu lateral: sem o laço grande em cima do nome; nome e setor com respiro ---------- */
const cssL = document.createElement('style');
cssL.textContent = `
  .hd-perfil > img{display:none !important}
  .hd-perfil{padding-top:6px}
  .hd-perfil .n{margin-top:0 !important;line-height:1.2}
  .hd-perfil .c{margin-top:8px;line-height:1.7}
`;
document.head.appendChild(cssL);

if(typeof LIBERADO === 'undefined' || !LIBERADO) return;
const dlg = document.getElementById('dlgReuniao'); if(!dlg) return;
const $ = id => document.getElementById(id);
const reu = () => window.SG_reuAtual || null;
const travada = () => { const r = reu(); return !!(r && r.concluida); };
const avisar = m => { try{ toast(m); }catch(_){} };
const API = () => window.SG_reu || {};
const salvarDepois = () => { if(API().salvarDepois) API().salvarDepois(); else { try{ salvar(); }catch(_){} } };
const redesenhar = () => { try{ if(API().desenharPauta) API().desenharPauta(); render(); }catch(_){} };
const ehReu = it => !!it && (it.tipo === 'reuniao' || it.tipo === 'alinhamento');
const ddmm = s => s ? s.slice(8,10) + '/' + s.slice(5,7) : '';
const projetos = () => window.SG_projetos ? SG_projetos.lista() : [];

/* ---------- visual ---------- */
const css = document.createElement('style');
css.textContent = `
  .reu-pauta .l .pt-corpo{flex:1;min-width:0;display:grid;gap:5px}
  .reu-pauta .l .pt-corpo > textarea.pt-txt, .reu-pauta .l .pt-corpo > input[data-pt]{width:100%;box-sizing:border-box}
  .reu-pauta .l .pt-sub{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .reu-pauta .l input.pt-resp{flex:0 1 180px;min-width:120px;width:auto;padding:4px 10px;font-size:11px;border-radius:999px;border:1px solid #eadfe6;background:#fff;color:#414142}
  .reu-pauta .l input.pt-resp:focus{border-color:var(--pink);outline:none}
  .reu-pauta .l button.pt-levar{font-size:9px !important;letter-spacing:.14em;text-transform:uppercase;border:1px solid #f2c6dd;border-radius:999px;padding:5px 10px !important;color:var(--pink) !important;background:#fff;line-height:1.2}
  .reu-pauta .l button.pt-levar:hover{background:#fff3f9}
  .reu-pauta .l .pt-tag{font-size:9px;letter-spacing:.12em;text-transform:uppercase;border-radius:999px;padding:3px 8px;background:#f6ecec;color:#573529;white-space:nowrap}
  .reu-pauta .l .pt-vinc{display:none !important}
  .mini-perigo{font-size:9px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #f2c6dd;border-radius:999px;padding:3px 8px;color:#c2187a;background:#fff;margin-left:6px;cursor:pointer}
  .mini-perigo.conf{background:#c2187a;color:#fff;border-color:#c2187a}
  #rqZerar.conf{background:#c2187a;border-color:#c2187a;color:#fff}
  .ac .ac-rem{justify-self:start;font-size:9px;letter-spacing:.14em;text-transform:uppercase;background:none;border:0;color:var(--g2);cursor:pointer;padding:2px 0}
  .ac .ac-rem:hover{color:#c2187a}
  #dlgPtVinc{width:min(520px,calc(100vw - 24px))}
  #dlgPtVinc .lv-sobre{font-size:13px;line-height:1.5;color:var(--g1);background:#faf7f9;border-radius:12px;padding:10px 12px;margin:8px 0 0;max-height:120px;overflow:auto;white-space:pre-wrap}
  #dlgPtVinc .lv-opc{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
  #dlgPtVinc .lv-opc button{border:1px solid #eadfe6;border-radius:12px;padding:10px 6px;background:#fff;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--g1);cursor:pointer;line-height:1.3}
  #dlgPtVinc .lv-opc button[aria-pressed="true"]{border-color:var(--pink);color:var(--pink);box-shadow:0 0 0 2px #ffe0f0}
  #dlgPtVinc .lv-painel{display:grid;gap:10px}
  #dlgPtVinc .lv-painel label{display:grid;gap:4px}
  #dlgPtVinc .lv-painel .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  #dlgPtVinc .lv-l{display:grid;gap:6px;max-height:240px;overflow:auto}
  #dlgPtVinc .lv-l button{text-align:left;border:1px solid #ece3dc;border-radius:12px;padding:10px 12px;background:#fff;display:flex;justify-content:space-between;gap:10px;align-items:center;cursor:pointer}
  #dlgPtVinc .lv-l button[aria-pressed="true"]{border-color:var(--pink);box-shadow:0 0 0 2px #ffe0f0}
  #dlgPtVinc .lv-l small{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--g2);white-space:nowrap}
  #dlgPtVinc .lv-chk{display:flex !important;grid-template-columns:none;align-items:center;gap:8px;font-size:12px;color:var(--g2)}
  #dlgPtVinc .lv-chk input{width:auto}
  @media(max-width:560px){ #dlgPtVinc .lv-opc{grid-template-columns:1fr 1fr} #dlgPtVinc .lv-painel .g2{grid-template-columns:1fr} }
`;
document.head.appendChild(css);

/* ---------- pessoas já usadas (sugestão no campo Responsável) ---------- */
document.body.insertAdjacentHTML('beforeend', '<datalist id="ptPessoas"></datalist>');
function pessoas(){
  const s = new Set();
  (DB.itens || []).forEach(i => { if(i.pessoa) s.add(String(i.pessoa).trim()); (i.pauta || []).forEach(x => { if(x.resp) s.add(String(x.resp).trim()); }); });
  try{ s.add(String(EU.nome || '').split(/\s+/)[0]); }catch(_){}
  return [...s].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
const encherPessoas = () => { $('ptPessoas').innerHTML = pessoas().map(p => `<option value="${esc(p)}">`).join(''); };

/* ---------- pauta: responsável + vincular em cada tópico ---------- */
function etiquetas(x){
  const t = [];
  if(x.planoId){ const it = DB.itens.find(i => i.id === x.planoId); t.push(it ? 'Plano de ação' + (it.data ? ' · ' + ddmm(it.data) : '') : 'Plano de ação'); }
  if(x.tarefaId) t.push('Tarefa');
  if(x.levadoPara){ const r = DB.itens.find(i => i.id === x.levadoPara); t.push('→ ' + (r ? r.titulo + (r.data ? ' ' + ddmm(r.data) : '') : 'outra reunião')); }
  if(x.projetoId){ const p = projetos().find(p => p.id === x.projetoId); if(p) t.push('● ' + p.nome); }
  return t.map(s => `<span class="pt-tag">${esc(s)}</span>`).join('');
}
function decorar(){
  const r = reu(); if(!r) return;
  const p = r.pauta || [];
  $('rqPauta').querySelectorAll('.l').forEach(l => {
    const del = l.querySelector(':scope > [data-pdel]'); if(!del) return;
    const i = +del.dataset.pdel, x = p[i]; if(!x) return;
    const txt = l.querySelector('textarea.pt-txt, input[data-pt]');
    let corpo = l.querySelector(':scope > .pt-corpo');
    if(!corpo){
      corpo = document.createElement('div'); corpo.className = 'pt-corpo';
      if(txt) txt.before(corpo); else l.insertBefore(corpo, del);
      corpo.insertAdjacentHTML('beforeend', '<div class="pt-sub"><input class="pt-resp" list="ptPessoas" placeholder="Responsável" aria-label="Responsável"><button type="button" class="pt-levar">Vincular</button><span class="pt-tags"></span></div>');
    }
    if(txt && txt.parentNode !== corpo) corpo.insertBefore(txt, corpo.firstChild);
    const enc = l.querySelector(':scope > .orig-enc'); if(enc) corpo.querySelector('.pt-sub').appendChild(enc);
    const ri = corpo.querySelector('.pt-resp'); ri.dataset.presp = i;
    if(document.activeElement !== ri) ri.value = x.resp || '';
    const bl = corpo.querySelector('.pt-levar'); bl.dataset.plev = i;
    corpo.querySelector('.pt-tags').innerHTML = etiquetas(x);
  });
}
$('rqPauta').addEventListener('input', e => {
  const ri = e.target.closest('.pt-resp'); if(!ri) return;
  const r = reu(); if(!r || travada()) return;
  const x = (r.pauta || [])[+ri.dataset.presp]; if(!x) return;
  x.resp = ri.value.trim(); salvarDepois();
});
$('rqPauta').addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.closest('.pt-resp')){ e.preventDefault(); e.target.blur(); } });
$('rqPauta').addEventListener('click', e => {
  const b = e.target.closest('.pt-levar'); if(!b) return;
  e.preventDefault(); e.stopPropagation();
  if(travada()) return;
  abrirLevar(+b.dataset.plev);
}, true);
new MutationObserver(() => decorar()).observe($('rqPauta'), { childList:true });
new MutationObserver(() => { if(dlg.open){ encherPessoas(); setTimeout(decorar, 0); } }).observe(dlg, { attributes:true, attributeFilter:['open'] });

/* ---------- janela Vincular tópico ---------- */
document.body.insertAdjacentHTML('beforeend', `<dialog id="dlgPtVinc"><div class="dlg">
  <div><h3>Vincular tópico da pauta</h3><p class="lv-sobre" id="pvSobre"></p></div>
  <div class="lv-opc" id="pvOpc">
    <button type="button" data-lv="plano">Plano de ação</button>
    <button type="button" data-lv="tarefa">Tarefa</button>
    <button type="button" data-lv="pauta">Pauta de outra reunião</button>
    <button type="button" data-lv="projeto">Projeto</button>
  </div>
  <div class="lv-painel" id="pvPainel"></div>
  <div class="rodape"><span class="mut" id="pvInfo" style="font-size:12px"></span>
    <div class="dir"><button type="button" class="btn ghost" id="pvFechar">Fechar</button><button type="button" class="btn" id="pvOk">Confirmar</button></div></div>
</div></dialog>`);

let LV = { i:-1, modo:'plano', reuAlvo:'', projAlvo:null };
const topico = () => { const r = reu(); return r && (r.pauta || [])[LV.i]; };
function abrirLevar(i){
  const x = (reu().pauta || [])[i]; if(!x) return;
  LV = { i, modo:'plano', reuAlvo:'', projAlvo: x.projetoId || '' };
  $('pvSobre').textContent = x.t;
  encherPessoas(); desenharLevar(); $('dlgPtVinc').showModal();
}
function outrasReunioes(){
  const r = reu(), hoje = iso(hojeD());
  const l = DB.itens.filter(i => ehReu(i) && i.id !== r.id && !i.concluida);
  const fut = l.filter(i => (i.data || '') >= hoje).sort((a, b) => ((a.data || '') + (a.hora || '')).localeCompare((b.data || '') + (b.hora || '')));
  const pas = l.filter(i => (i.data || '') < hoje).sort((a, b) => ((b.data || '') + (b.hora || '')).localeCompare((a.data || '') + (a.hora || ''))).slice(0, 15);
  return fut.concat(pas);
}
function desenharLevar(){
  const x = topico(); if(!x) return;
  $('pvOpc').querySelectorAll('[data-lv]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lv === LV.modo)));
  const P = $('pvPainel'); let info = '';
  if(LV.modo === 'plano' || LV.modo === 'tarefa'){
    const ja = LV.modo === 'plano' ? x.planoId : x.tarefaId;
    const it = ja && DB.itens.find(i => i.id === ja);
    P.innerHTML = `
      <label><span class="k">O que fazer</span><input id="pvTit" value="${esc(it ? it.titulo : x.t)}"></label>
      <div class="g2">
        <label><span class="k">Responsável</span><input id="pvResp" list="ptPessoas" value="${esc(it ? (it.pessoa || '') : (x.resp || ''))}" placeholder="Quem vai fazer"></label>
        <label><span class="k">Prazo</span><input id="pvData" type="date" value="${esc(it ? (it.data || '') : '')}"></label>
      </div>
      <label><span class="k">Prioridade</span><select id="pvPri">
        ${[['diretoria','Diretoria'],['alta','Alta'],['media','Média'],['baixa','Baixa']].map(([v, t]) => `<option value="${v}" ${(it ? it.prioridade : 'media') === v ? 'selected' : ''}>${t}</option>`).join('')}
      </select></label>`;
    info = it ? 'Já está na agenda. Confirmar atualiza o que mudou.' : (LV.modo === 'plano' ? 'Entra na agenda como Plano de ação desta reunião.' : 'Entra na agenda como Tarefa.');
  } else if(LV.modo === 'pauta'){
    const l = outrasReunioes();
    if(!LV.reuAlvo && x.levadoPara) LV.reuAlvo = x.levadoPara;
    P.innerHTML = l.length ? `<div class="lv-l">${l.map(i => `<button type="button" data-lvr="${esc(i.id)}" aria-pressed="${LV.reuAlvo === i.id}"><span>${esc(i.titulo)}</span><small>${i.data ? fmtData(i.data) : 'sem data'}${i.hora ? ' · ' + esc(i.hora) : ''}</small></button>`).join('')}</div>
      <label class="lv-chk"><input type="checkbox" id="pvTratado"> Marcar como tratado nesta reunião</label>`
      : '<div class="vazio" style="padding:14px">Nenhuma outra reunião aberta. Crie a reunião na agenda e volte aqui.</div>';
    info = 'O tópico entra na pauta da reunião escolhida (com o responsável).';
  } else {
    if(LV.projAlvo === null) LV.projAlvo = x.projetoId || '';
    const ps = projetos().filter(p => p.ativo || p.id === x.projetoId);
    P.innerHTML = `<div class="lv-l">
      <button type="button" data-lvp="" aria-pressed="${!LV.projAlvo}"><span>Nenhum projeto</span><small>${x.projetoId ? 'tirar vínculo' : ''}</small></button>
      ${ps.map(p => `<button type="button" data-lvp="${esc(p.id)}" aria-pressed="${LV.projAlvo === p.id}"><span>${esc(p.nome)}</span><small>${x.projetoId === p.id ? 'vinculado' : ''}</small></button>`).join('')}
      <button type="button" data-lvp="__novo" aria-pressed="${LV.projAlvo === '__novo'}"><span>+ Novo projeto</span><small>com o nome abaixo</small></button>
    </div>
    <label id="pvNovoWrap" ${LV.projAlvo === '__novo' ? '' : 'hidden'}><span class="k">Nome do novo projeto</span><input id="pvNovoNome" value="${esc(x.t.slice(0, 80))}"></label>`;
    info = 'O tópico fica ligado ao projeto e aparece na linha do tempo dele.';
  }
  $('pvInfo').textContent = info;
}
$('pvOpc').addEventListener('click', e => { const b = e.target.closest('[data-lv]'); if(!b) return; LV.modo = b.dataset.lv; desenharLevar(); });
$('pvPainel').addEventListener('click', e => {
  const r = e.target.closest('[data-lvr]'); if(r){ LV.reuAlvo = r.dataset.lvr; desenharLevar(); return; }
  const p = e.target.closest('[data-lvp]'); if(p){ LV.projAlvo = p.dataset.lvp; desenharLevar(); if(LV.projAlvo === '__novo') setTimeout(() => $('pvNovoNome').select(), 20); }
});
$('pvFechar').onclick = () => $('dlgPtVinc').close();
$('pvOk').onclick = () => {
  const r = reu(), x = topico(); if(!r || !x || travada()) return;
  if(LV.modo === 'plano' || LV.modo === 'tarefa'){
    const titulo = $('pvTit').value.trim(); if(!titulo){ $('pvTit').focus(); return; }
    const resp = $('pvResp').value.trim(), data = $('pvData').value, pri = $('pvPri').value;
    const chaveId = LV.modo === 'plano' ? 'planoId' : 'tarefaId';
    let it = x[chaveId] && DB.itens.find(i => i.id === x[chaveId]);
    if(it){ Object.assign(it, { titulo, pessoa:resp, data, prioridade:pri }); }
    else {
      it = { id:uid(), titulo, tipo: LV.modo === 'plano' ? 'plano' : 'tarefa', data, hora:'', prioridade:pri, pessoa:resp,
        notas:'Da pauta da reunião: ' + r.titulo + (r.data ? ' (' + ddmm(r.data) + ')' : ''), rec:'', sub:[], paiId:'', origem:r.id,
        projetoId: x.projetoId || '', feito:false, feitoEm:'', criadoEm:new Date().toISOString() };
      DB.itens.push(it); x[chaveId] = it.id;
    }
    if(resp && !x.resp) x.resp = resp;
    if(LV.modo === 'plano'){
      if(!Array.isArray(r.plano)) r.plano = [];
      let a = r.plano.find(a => a.itemId === it.id);
      if(!a){ a = { tmp:uid(), chave:'pauta:' + it.id, tipo:'plano', salvo:true, incluir:false, itemId:it.id }; r.plano.push(a); }
      Object.assign(a, { titulo, pessoa:resp, data, hora:'', prioridade:pri, removida:false });
    }
    try{ salvar(); }catch(_){}
    redesenhar();
    if(LV.modo === 'plano' && API().gerar) API().gerar();
    avisar(LV.modo === 'plano' ? 'Virou plano de ação e já está na agenda.' : 'Virou tarefa na agenda.');
  } else if(LV.modo === 'pauta'){
    const alvo = DB.itens.find(i => i.id === LV.reuAlvo); if(!alvo){ avisar('Escolha a reunião.'); return; }
    if(!Array.isArray(alvo.pauta)) alvo.pauta = [];
    if(!alvo.pauta.some(y => norm(y.t) === norm(x.t))) alvo.pauta.push({ t:x.t, ok:false, resp:x.resp || '', enc:alvo.id, veioDe:r.id, projetoId:x.projetoId || '' });
    x.levadoPara = alvo.id;
    if($('pvTratado') && $('pvTratado').checked) x.ok = true;
    try{ salvar(); }catch(_){}
    redesenhar();
    avisar('Entrou na pauta de “' + alvo.titulo + '”.');
  } else {
    let pid = LV.projAlvo || '';
    if(pid === '__novo'){
      const nomeP = ($('pvNovoNome').value || '').trim(); if(!nomeP){ $('pvNovoNome').focus(); return; }
      if(!window.SG_projetos){ avisar('Projetos ainda não carregou. Tente de novo.'); return; }
      pid = SG_projetos.criar(nomeP).id;
    }
    x.projetoId = pid;
    [x.planoId, x.tarefaId].forEach(id => { const it = id && DB.itens.find(i => i.id === id); if(it && !it.projetoId) it.projetoId = pid; });
    try{ salvar(); }catch(_){}
    redesenhar();
    const p = projetos().find(p => p.id === pid);
    avisar(p ? 'Vinculado ao projeto ' + p.nome + '.' : 'Sem projeto.');
  }
  $('dlgPtVinc').close();
};

/* ---------- Limpar pauta e Zerar reunião ---------- */
const guardarCopia = (r, motivo) => { try{ localStorage.setItem(CHAVE + ':copia-antes-de-' + motivo + ':' + r.id, JSON.stringify({ em:new Date().toISOString(), reuniao:r })); }catch(_){} };
// a linha "Pauta: a, b, c" da descrição remontaria a pauta ao abrir; sai junto
const semPautaNasNotas = r => { if(r.notas) r.notas = String(r.notas).replace(/^.*pautas?\s*:.*$/gim, '').trim(); };
function confirmar2(b, txtConf, txtNormal, fazer){
  if(b.dataset.conf !== '1'){
    b.dataset.conf = '1'; b.classList.add('conf'); b.textContent = txtConf;
    clearTimeout(b._t); b._t = setTimeout(() => { b.dataset.conf = ''; b.classList.remove('conf'); b.textContent = txtNormal; }, 6000);
    return;
  }
  clearTimeout(b._t); b.dataset.conf = ''; b.classList.remove('conf'); b.textContent = txtNormal;
  fazer();
}
const ref = $('rqVerOrigem') || $('rqPautaN');
ref.insertAdjacentHTML('afterend', '<button type="button" class="mini-perigo" id="rqLimparPauta" title="Apagar todos os tópicos desta pauta">limpar pauta</button>');
$('rqLimparPauta').onclick = () => {
  const r = reu(); if(!r || travada() || !(r.pauta || []).length) return;
  confirmar2($('rqLimparPauta'), 'confirmar: apagar ' + r.pauta.length + ' tópicos', 'limpar pauta', () => {
    guardarCopia(r, 'limpar-pauta'); r.pauta = []; semPautaNasNotas(r);
    try{ salvar(); }catch(_){}
    redesenhar(); avisar('Pauta limpa. Pode montar de novo.');
  });
};
const dir = dlg.querySelector('.reu-cab .dir');
if(dir) dir.insertAdjacentHTML('afterbegin', '<button type="button" class="btn ghost min" id="rqZerar" title="Apaga pauta, anotações, anexos, resumo e plano desta reunião">Zerar reunião</button>');
const bZ = $('rqZerar');
if(bZ) bZ.onclick = () => {
  const r = reu(); if(!r || travada()) return;
  confirmar2(bZ, 'Confirmar: apagar tudo desta reunião', 'Zerar reunião', () => {
    guardarCopia(r, 'zerar');
    if(r.notas && r.notas === r.resumo) r.notas = '';
    semPautaNasNotas(r);
    Object.assign(r, { pauta:[], anotacoes:'', anexos:[], resumo:'', resumoEditado:false, plano:[] });
    try{ salvar(); }catch(_){}
    dlg.close();
    try{ render(); }catch(_){}
    setTimeout(() => { if(API().abrir) API().abrir(r); else if(window.SG_verItem) SG_verItem(r.id); }, 30);
    avisar('Reunião zerada. As ações que já estavam na agenda continuam lá.');
  });
};

/* ---------- Plano de ação · acompanhamento: excluir uma ação ou limpar todas ---------- */
const cssA = document.createElement('style');
cssA.textContent = `
  #rqAcomp .acp{grid-template-columns:auto minmax(0,1fr) auto !important}
  #rqAcomp .acp-del{font-size:9px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #eee;border-radius:999px;background:#fff;color:#8a7d86;padding:5px 9px;cursor:pointer;white-space:nowrap}
  #rqAcomp .acp-del:hover{color:#c2187a;border-color:#f2c6dd}
  #rqAcomp .acp-del.conf{background:#c2187a;border-color:#c2187a;color:#fff}
`;
document.head.appendChild(cssA);
function excluirAcoes(ids, r){
  const set = new Set(ids); if(!set.size) return;
  try{ localStorage.setItem(CHAVE + ':copia-antes-de-excluir-acoes:' + Date.now(), JSON.stringify(DB.itens.filter(i => set.has(i.id)))); }catch(_){}
  DB.itens = DB.itens.filter(i => !set.has(i.id));
  DB.itens.forEach(i => {
    if(Array.isArray(i.plano)) i.plano = i.plano.filter(a => !set.has(a.itemId));
    (i.pauta || []).forEach(x => { if(set.has(x.planoId)) delete x.planoId; if(set.has(x.tarefaId)) delete x.tarefaId; });
  });
  try{ salvar(); }catch(_){}
  dlg.close();
  try{ render(); }catch(_){}
  setTimeout(() => { if(API().abrir) API().abrir(r); else if(window.SG_verItem) SG_verItem(r.id); setTimeout(() => { const a = $('rqAcomp'); if(a && !a.hidden) a.scrollIntoView({ block:'center' }); }, 120); }, 30);
}
function marcarAcomp(){
  const lista = $('rqAcompLista'); if(!lista) return;
  lista.querySelectorAll('.acp').forEach(l => {
    if(l.querySelector('.acp-del')) return;
    const b = l.querySelector('[data-acp]'); if(!b) return;
    l.insertAdjacentHTML('beforeend', `<button type="button" class="acp-del" data-acpdel="${esc(b.dataset.acp)}" title="Apagar esta ação da agenda">Excluir</button>`);
  });
  const n = $('rqAcompN');
  if(n && !$('rqAcompLimpar')) n.insertAdjacentHTML('afterend', '<button type="button" class="mini-perigo" id="rqAcompLimpar" title="Apagar da agenda todas as ações desta lista">limpar todas</button>');
}
if($('rqAcompLista')){
  new MutationObserver(marcarAcomp).observe($('rqAcompLista'), { childList:true });
  marcarAcomp();
  $('rqAcomp').addEventListener('click', e => {
    const r = reu(); if(!r || travada()) return;
    const d = e.target.closest('[data-acpdel]');
    if(d){
      e.stopPropagation();
      confirmar2(d, 'Confirmar', 'Excluir', () => { excluirAcoes([d.dataset.acpdel], r); avisar('Ação excluída da agenda.'); });
      return;
    }
    const t = e.target.closest('#rqAcompLimpar');
    if(t){
      const ids = [...$('rqAcompLista').querySelectorAll('[data-acp]')].map(b => b.dataset.acp);
      if(!ids.length) return;
      confirmar2(t, 'confirmar: apagar ' + ids.length + ' ações da agenda', 'limpar todas', () => { excluirAcoes(ids, r); avisar(ids.length + ' ações excluídas da agenda.'); });
    }
  });
}

/* ---------- Tipos (Todos, Tarefa, Reunião…) no menu lateral, embaixo de Tarefas ---------- */
const cssT = document.createElement('style');
cssT.textContent = `
  .hd-tipos{display:none}
  html.layout-head:not(.modo-app) .hd-side .hd-tipos{display:grid;gap:1px;margin:2px 0 8px 14px;padding-left:10px;border-left:1px solid rgba(246,236,236,.18)}
  .hd-tipos button{display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left;border-radius:10px;padding:7px 10px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(246,236,236,.78);background:none;border:0;cursor:pointer}
  .hd-tipos button:hover{background:rgba(246,236,236,.07);color:#f6ecec}
  .hd-tipos button[aria-pressed="true"]{background:rgba(246,236,236,.14);color:#fff}
  .hd-tipos button small{font-size:9px;letter-spacing:0;opacity:.7}
  @media (min-width:981px){ html.layout-head:not(.modo-app) #pillsTipo{display:none} }
  @media (max-width:980px){ html.layout-head .hd-side .hd-tipos{display:none !important} }
`;
document.head.appendChild(cssT);
function desenharTipos(){
  const bTar = document.querySelector('nav.abas [data-aba="lista"]'); if(!bTar) return;
  let box = document.getElementById('hdTipos');
  if(!box){ box = document.createElement('div'); box.className = 'hd-tipos'; box.id = 'hdTipos'; bTar.after(box); }
  const tipos = [['', 'Todos']].concat(Object.entries(typeof TIPO_CURTO === 'object' ? TIPO_CURTO : {}));
  const abertos = (DB.itens || []).filter(i => !i.feito);
  const naLista = typeof ABA !== 'undefined' && ABA === 'lista';
  const atual = typeof FILTRO_TIPO !== 'undefined' ? FILTRO_TIPO : '';
  box.innerHTML = tipos.map(([k, v]) => {
    const n = k ? abertos.filter(i => i.tipo === k).length : abertos.length;
    return `<button type="button" data-hdtipo="${esc(k)}" aria-pressed="${naLista && atual === k}"><span>${esc(v)}</span><small>${n || ''}</small></button>`;
  }).join('');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-hdtipo]'); if(!b) return;
  try{ FILTRO_TIPO = b.dataset.hdtipo; }catch(_){}
  try{ irAba('lista'); }catch(_){ const t = document.querySelector('nav.abas [data-aba="lista"]'); if(t) t.click(); }
  try{ renderLista(); }catch(_){}
  desenharTipos();
});
// o filtro de cima (quando aparece) e a troca de aba também atualizam o menu
document.addEventListener('click', e => { if(e.target.closest('[data-ftipo], nav.abas [data-aba]')) setTimeout(desenharTipos, 0); });
try{ const renderTiposAnt = render; render = function(){ const r = renderTiposAnt.apply(this, arguments); desenharTipos(); return r; }; }catch(_){}
desenharTipos();

if(dlg.open){ encherPessoas(); decorar(); }
})();
