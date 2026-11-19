/* Agenda Coordenação · Cores
   "Vence hoje" em rosa delicado, o resto em marrom bem leve. Atrasada continua piscando.
   Botão "Cores" no topo para testar paletas (vale no computador e no aplicativo). */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;

  const PALETAS = [
    { id:'head',       nome:'Head · Rosa & Chocolate', hoje:'#e0bcbc', outros:'#ffffff', acento:'#b75675', head:true },
    { id:'bebe',       nome:'Rosinha bebê',     hoje:'#e4c6c6', outros:'#fff5fb', acento:'#573529', fundoRosa:true, tituloRosa:true, cartoesRosa:true },
    { id:'rose',       nome:'Rosé & Chocolate', hoje:'#e4c6c6', outros:'#faf7f4', acento:'#573529' },
    { id:'buttermilk', nome:'Buttermilk',       hoje:'#e4c6c6', outros:'#efece3', acento:'#573529' },
    { id:'chocolate',  nome:'Chocolate leve',   hoje:'#e4c6c6', outros:'#f3ece7', acento:'#573529' },
    { id:'nude',       nome:'Rosé suave',       hoje:'#efdcdc', outros:'#fcfaf8', acento:'#8a5f55' },
    { id:'original',   nome:'Rosa original',    hoje:'#ff3ea5', outros:'#ffffff', acento:'' }
  ];
  const PADRAO = PALETAS[0];   // Head · Rosa & Chocolate

  /* ---------- contas de cor ---------- */
  const hex = h => { h = String(h || '').replace('#', ''); if(h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mistura = (a, b, t) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
  const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
  const claro = c => lum(c) > .45;

  function atual(){
    const t = (DB.ajustes && DB.ajustes.tema) || null;
    if(!t) return PADRAO;
    if(t.id && t.id !== 'meu') return PALETAS.find(p => p.id === t.id) || PADRAO;
    return Object.assign({ id:'meu', nome:'Minhas cores', fundoRosa:true, tituloRosa:true }, t);
  }

  const css = document.createElement('style'); css.id = 'temaCss'; document.head.appendChild(css);
  function aplicar(p){
    p = p || atual();
    document.documentElement.dataset.tema = p.id;
    document.documentElement.classList.toggle('layout-head', !!p.head);
    window.dispatchEvent(new Event('sg-tema'));
    if(p.id === 'original'){ css.textContent = ''; return; }
    const choc = '#573529';
    const hojeFg = claro(p.hoje) ? choc : '#ffffff';
    const hojeBorda = mistura(p.hoje, choc, .18);
    const outBorda = mistura(p.outros, choc, .09);
    const ac = p.acento || choc, acFg = claro(ac) ? choc : '#ffffff';
    const acSuave = mistura(ac, '#ffffff', .86);
    css.textContent = `
      :root{--grad:${ac};${p.cartoesRosa ? '' : `--pink:${ac};--rosa:${mistura(p.hoje, choc, .3)};--rosa2:${hojeBorda};--rosa-claro:${mistura(p.hoje, '#ffffff', .45)};--rosa-bg:${mistura(p.hoje, '#ffffff', .78)};--lilas-claro:${mistura(p.outros, choc, .04)};`}--t-hoje:${p.hoje};--t-hoje-fg:${hojeFg};--t-out:${p.outros};--t-out-b:${outBorda};--t-ac:${ac};--t-ac-fg:${acFg};--t-ac-s:${acSuave};
        ${p.cartoesRosa ? '' : '--sombra:0 10px 28px -16px rgba(87,53,41,.22),0 2px 6px -2px rgba(65,65,66,.06)'}}
      ${p.fundoRosa ? '' : `body{background-image:radial-gradient(900px 420px at 100% -10%,${mistura(p.hoje, '#ffffff', .55)} 0%,rgba(255,255,255,0) 60%),radial-gradient(700px 380px at -10% 110%,${mistura(p.outros, '#ffffff', .2)} 0%,rgba(255,255,255,0) 60%)}`}
      ${p.tituloRosa ? 'h1.tit span{background:linear-gradient(135deg,#ff6fc0 0%,#ffa3d6 45%,#c9a6ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' : `h1.tit span{background:linear-gradient(135deg,${ac} 0%,${mistura(p.hoje, ac, .35)} 100%);-webkit-background-clip:text;background-clip:text;color:transparent}`}
      .btn{background:${ac};color:${acFg};box-shadow:0 8px 18px -10px ${mistura(ac, '#ffffff', .2)}}
      .btn:hover{box-shadow:0 10px 22px -10px ${ac}}
      .btn.ghost,.btn.perigo{background:#fff;color:var(--g1);${p.cartoesRosa ? '' : `border-color:${outBorda};`}box-shadow:none}
      .btn.ghost:hover{border-color:${ac}}
      ${p.cartoesRosa ? '' : `nav.abas{border-color:${outBorda}}`}
      nav.abas button[aria-selected="true"]{background:${ac};color:${acFg}}
      nav.abas button .n{background:${acSuave};color:${ac}}
      ${p.cartoesRosa ? '' : `.chk{border-color:${mistura(p.hoje, choc, .3)}}`}
      .chk.on{background:${ac};color:${acFg}}
      .pill[aria-pressed="true"]{background:${acSuave};border-color:${ac}}
      .barra i{background:${ac}}
      .anel{background:conic-gradient(${ac} calc(var(--p)*1%), ${p.cartoesRosa ? '#f7e6f1' : p.outros} 0)}
      .dia.hoje-d{border-color:${ac}} .dia.hoje-d .num b{background:${ac};color:${acFg}}
      input:focus,select:focus,textarea:focus{border-color:${ac};box-shadow:0 0 0 3px ${acSuave}}

      ${p.cartoesRosa ? '' : `      /* os outros: marrom bem leve */
      html[data-tema] .card,html[data-tema] .item,html[data-tema] .nota,html[data-tema] .dia{background-color:${p.outros};border-color:${outBorda}}
      html[data-tema] .kpi::after{background:${mistura(p.outros, choc, .05)}}
      html[data-tema] .vazio{background:${p.outros};border-color:${outBorda}}
      html[data-tema] .grupo-t::after{background:${outBorda}}
      html[data-tema] .captura textarea{background:#fff;border-color:${outBorda}}
      html[data-tema] .item:hover{border-color:${mistura(p.hoje, choc, .3)}}`}
      /* vence hoje: rosa delicado */
      html[data-tema] .st-hoje{background:${p.hoje}!important;border-color:${hojeBorda}!important;color:${hojeFg}!important}
      html[data-tema] .st-hoje .mut,html[data-tema] .st-hoje .when,html[data-tema] .st-hoje .meta,html[data-tema] .st-hoje .tipo,
      html[data-tema] .st-hoje .k,html[data-tema] .st-hoje .d,html[data-tema] .st-hoje .v,html[data-tema] .st-hoje h2{color:${hojeFg}!important}
      html[data-tema] .st-hoje .tipo{background:rgba(255,255,255,.55)!important;border-color:transparent!important}
      html[data-tema] .st-hoje .chk{border-color:${hojeFg}!important;background:rgba(255,255,255,.6)}
      html[data-tema] .st-hoje::after{background:rgba(255,255,255,.28)!important}
      html[data-tema] .kpi.hoje .v{color:${hojeFg === '#ffffff' ? ac : choc}}
      html[data-tema] .ev.st-hoje{color:${hojeFg}!important}
      html[data-tema] .legenda .hj{background:${p.hoje};border:1px solid ${hojeBorda}}
      html[data-tema] .dia .pontos i.st-hoje{background:${hojeBorda}}
      ${p.cartoesRosa ? '' : `      /* secretária */
      html[data-tema] .sec-msg.eu{background:${mistura(p.hoje, '#ffffff', .55)};border-color:${hojeBorda}}
      html[data-tema] .sec-base button.mic{background:${ac};color:${acFg};box-shadow:none}
      html[data-tema] .sec-base textarea{background:${p.outros};border-color:${outBorda}}
      html[data-tema] .sec-fab,html[data-tema] .sec{border-color:${outBorda};box-shadow:0 18px 40px -20px rgba(87,53,41,.35)}
      html[data-tema] dialog{box-shadow:0 30px 80px -24px rgba(87,53,41,.35)}`}
      /* atrasada: continua piscando como está */
      html[data-tema] .st-atrasada{border-color:var(--neon)!important}
    `;
  }

  function guardar(t){ DB.ajustes = Object.assign({}, DB.ajustes || {}, { tema:t }); salvar(); }

  /* ---------- botão Cores ---------- */
  const cssP = document.createElement('style');
  cssP.textContent = `
    .cores-bt{display:inline-flex;align-items:center;gap:7px}
    .cores-bt i{width:12px;height:12px;border-radius:50%;display:inline-block;border:1px solid rgba(0,0,0,.08)}
    #dlgCores{width:min(520px,calc(100vw - 24px))}
    .pal{display:grid;gap:8px}
    .pal button{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;text-align:left;border:1px solid #ece3dc;border-radius:14px;padding:10px 12px;background:#fff}
    .pal button[aria-pressed="true"]{border-color:#573529;box-shadow:0 0 0 2px #e4c6c6}
    .pal .sw{display:flex;border-radius:9px;overflow:hidden;border:1px solid rgba(0,0,0,.06)}
    .pal .sw span{width:26px;height:30px}
    .pal .nm{font-size:13px;letter-spacing:.06em}
    .pal .nm small{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g2);margin-top:2px}
    .meu{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .meu label{display:grid;gap:5px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g2)}
    .meu input[type=color]{height:42px;padding:3px;cursor:pointer}
    .cores-prev{display:grid;gap:8px;padding:12px;border-radius:14px;border:1px dashed #e3d6cc}
  `;
  document.head.appendChild(cssP);

  const topo = document.querySelector('header.topo .selo') && document.querySelector('header.topo .selo').parentElement;
  if(topo){
    const b = document.createElement('button'); b.className = 'btn ghost min cores-bt'; b.id = 'btnCores'; b.type = 'button';
    topo.insertBefore(b, $('btnNovo'));
    b.onclick = abrir;
  }
  function pintarBotao(){ const b = $('btnCores'); if(!b) return; const p = atual(); b.innerHTML = `<i style="background:${p.hoje}"></i><i style="background:${p.outros}"></i><i style="background:${p.acento || '#ff3ea5'}"></i>Cores`; }

  document.body.insertAdjacentHTML('beforeend', `<dialog id="dlgCores"><div class="dlg">
    <div><h3>Cores da agenda</h3><p class="mut" style="margin:6px 0 0;font-size:12px">Toque para testar. A cor de “vence hoje”, a dos demais e a dos botões. Atrasada continua piscando.</p></div>
    <div class="pal" id="palLista"></div>
    <div class="c" style="display:grid;gap:8px"><span class="k">Minhas cores</span>
      <div class="meu">
        <label>Vence hoje<input type="color" id="cHoje"></label>
        <label>Demais<input type="color" id="cOut"></label>
        <label>Botões<input type="color" id="cAc"></label>
      </div>
    </div>
    <div class="cores-prev">
      <div class="item st-hoje"><span class="chk"></span><div><div class="t">Exemplo: enviar relatório</div><div class="meta"><span class="tipo tarefa">Tarefa</span></div></div><div class="when">Vence hoje</div></div>
      <div class="item"><span class="chk"></span><div><div class="t">Exemplo: alinhamento com fornecedor</div><div class="meta"><span class="tipo alinhamento">Alinhamento</span></div></div><div class="when">Sex · 10:00</div></div>
    </div>
    <div class="rodape"><button type="button" class="btn ghost min" id="cPadrao">Voltar ao padrão</button><div class="dir"><button type="button" class="btn ghost" id="cCancelar">Cancelar</button><button type="button" class="btn" id="cSalvar">Usar estas cores</button></div></div>
  </div></dialog>`);

  let ANTES = null, ESCOLHA = null;
  function desenharLista(){
    const a = ESCOLHA || atual();
    $('palLista').innerHTML = PALETAS.map(p => `<button type="button" data-pal="${p.id}" aria-pressed="${a.id === p.id}">
      <span class="sw"><span style="background:${p.hoje}"></span><span style="background:${p.outros}"></span><span style="background:${p.acento || '#ff3ea5'}"></span></span>
      <span class="nm">${esc(p.nome)}<small>${p.id === PADRAO.id ? 'Padrão' : p.id === 'original' ? 'Como era antes' : ''}</small></span><span></span></button>`).join('');
    $('cHoje').value = a.hoje; $('cOut').value = a.outros; $('cAc').value = a.acento || '#ff3ea5';
  }
  function abrir(){ ANTES = atual(); ESCOLHA = ANTES; desenharLista(); $('dlgCores').showModal(); }
  $('palLista').addEventListener('click', e => { const b = e.target.closest('[data-pal]'); if(!b) return; ESCOLHA = PALETAS.find(p => p.id === b.dataset.pal); aplicar(ESCOLHA); desenharLista(); });
  ['cHoje','cOut','cAc'].forEach(id => $(id).addEventListener('input', () => {
    ESCOLHA = { id:'meu', nome:'Minhas cores', fundoRosa:true, tituloRosa:true, hoje:$('cHoje').value, outros:$('cOut').value, acento:$('cAc').value };
    aplicar(ESCOLHA); desenharLista();
  }));
  $('cPadrao').onclick = () => { ESCOLHA = PADRAO; aplicar(PADRAO); desenharLista(); };
  $('cCancelar').onclick = () => { aplicar(ANTES); $('dlgCores').close(); };
  $('dlgCores').addEventListener('cancel', () => aplicar(ANTES));
  $('cSalvar').onclick = () => {
    const e = ESCOLHA || PADRAO;
    guardar(e.id === 'meu' ? { id:'meu', hoje:e.hoje, outros:e.outros, acento:e.acento } : { id:e.id });
    aplicar(); pintarBotao(); $('dlgCores').close(); toast('Cores salvas. Valem no computador e no aplicativo.');
  };

  // reaplica quando a agenda muda (ex.: cor escolhida no celular)
  const renderAnt = render;
  let ultimo = '';
  render = function(){ renderAnt.apply(this, arguments); const k = JSON.stringify((DB.ajustes || {}).tema || null); if(k !== ultimo){ ultimo = k; aplicar(); pintarBotao(); } };
  aplicar(); pintarBotao(); ultimo = JSON.stringify((DB.ajustes || {}).tema || null);
  window.SG_tema = { aplicar, PALETAS };
})();
