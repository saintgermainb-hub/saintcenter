/* Agenda Coordenação · Visual Head
   Paleta: Branco suave #f8f8f8 · Rosé claro #e0bcbc · Rosa #b75675 · Marrom chocolate #4b290d
   Menu lateral em chocolate, relógio ao vivo, monitoramento em tempo real, laço da Kah no sistema e na secretária. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;
  const C = { painel:'#77503f', branco:'#f8f8f8', rose:'#e0bcbc', rosa:'#b75675', choc:'#4b290d', choc2:'#6b4a33', linha:'#efe2e2', roseBg:'#f6ecec' };
  const LACO_IMG = window.SG_LACO || 'laco.png?v=2';

  /* ---------- laço do sistema: troca o desenho pelo laço da Kah ---------- */
  function trocarLacos(raiz){
    (raiz || document).querySelectorAll('svg.laco').forEach(svg => {
      const noTitulo = !!svg.closest('h1.tit');
      const img = document.createElement('img'); img.src = noTitulo ? (window.SG_LACO_FITA || 'laco-fita.png?v=1') : LACO_IMG; img.alt = ''; img.className = noTitulo ? 'laco laco-fita' : 'laco laco-img';
      svg.replaceWith(img);
    });
  }
  trocarLacos();
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; if(n.matches && n.matches('svg.laco')) trocarLacos(n.parentNode); else if(n.querySelector && n.querySelector('svg.laco')) trocarLacos(n); }))).observe(document.body, { childList:true, subtree:true });

  /* ---------- aparência ---------- */
  const css = document.createElement('style');
  css.textContent = `
    img.laco-img{width:auto;height:32px;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(75,41,13,.22));vertical-align:middle;border-radius:0;box-shadow:none}
    h1.tit img.laco-img{height:46px;margin-left:12px;vertical-align:-10px}
    h1.tit{position:relative;display:inline-block;padding-right:52px}
    h1.tit img.laco-fita{position:absolute;right:0;top:-18px;height:84px;width:auto;filter:drop-shadow(0 6px 8px rgba(75,41,13,.18));pointer-events:none;z-index:1}
    .selo.dona img.laco-img{height:24px}

    html.layout-head body{background:${C.branco}!important;background-image:none!important;color:#1d1410}
    html.layout-head{--fg:#1d1410;--g1:#4a3a33;--g2:#7a6a63;--g3:#b9a9a4}

    /* menu lateral */
    .hd-side{display:none}
    html.layout-head .hd-side{display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;width:256px;z-index:20;background:linear-gradient(180deg,#7d5543 0%,${C.painel} 100%);color:#f6ecec;padding:26px 18px 18px;gap:18px;overflow:auto}
    html.layout-head .wrap{margin-left:256px;max-width:none;padding:26px 34px 70px}
    .hd-perfil{display:grid;justify-items:center;text-align:center;gap:6px;padding-bottom:16px;border-bottom:1px solid rgba(246,236,236,.14)}
    .hd-perfil img{width:auto;height:104px;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(0,0,0,.3))}
    .hd-perfil .n{font-size:18px;letter-spacing:.06em;margin-top:8px}
    .hd-perfil .c{font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:${C.rose}}
    .hd-relogio{display:grid;gap:2px;text-align:center}
    .hd-relogio b{font-weight:400;font-size:34px;letter-spacing:.06em;font-variant-numeric:tabular-nums}
    .hd-relogio b small{font-size:15px;color:${C.rose};margin-left:2px}
    .hd-relogio span{font-size:11px;letter-spacing:.08em;color:#d9c7c0}
    .hd-vivo{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:${C.rose}}
    .hd-vivo i{width:7px;height:7px;border-radius:50%;background:#ff8fb4;box-shadow:0 0 0 0 rgba(255,143,180,.7);animation:vivo 1.8s infinite}
    @keyframes vivo{0%{box-shadow:0 0 0 0 rgba(255,143,180,.7)}70%{box-shadow:0 0 0 9px rgba(255,143,180,0)}100%{box-shadow:0 0 0 0 rgba(255,143,180,0)}}
    html.layout-head .hd-side nav.abas{flex-direction:column;flex-wrap:nowrap;gap:3px;background:transparent;border:0;box-shadow:none;padding:0;margin:0!important;border-radius:0}
    html.layout-head .hd-side nav.abas button{text-align:left;border-radius:12px;padding:12px 14px;color:#f6ecec;font-size:10px;letter-spacing:.22em;display:flex;justify-content:space-between;align-items:center}
    html.layout-head .hd-side nav.abas button:hover{background:rgba(246,236,236,.07)}
    html.layout-head .hd-side nav.abas button[aria-selected="true"]{background:${C.rose};color:${C.choc}}
    html.layout-head .hd-side nav.abas button .n{background:${C.rosa};color:#fff}
    html.layout-head .hd-side nav.abas button[aria-selected="true"] .n{background:${C.choc};color:#fff}
    .hd-sec{margin-top:auto;display:grid;gap:10px;margin-bottom:22px}
    .hd-sec button.sec-bt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:rgba(246,236,236,.08);border:1px solid rgba(224,188,188,.35);border-radius:16px;padding:10px 12px;color:#f6ecec}
    .hd-sec button.sec-bt:hover{background:rgba(246,236,236,.14)}
    .hd-sec button.sec-bt img{width:auto;height:44px;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}
    .hd-sec .sec-bt b{display:block;font-weight:400;font-size:14px;letter-spacing:.06em}
    .hd-sec .sec-bt small{display:block;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${C.rose};margin-top:3px}
    .hd-sec .sec-bt small.off{color:#d9a2a2}
    html.layout-head .sync-selo{left:24px;bottom:12px;color:#cdb9b2;z-index:21}
    html.layout-head .sync-selo.ok i{background:${C.rose}}
    html.layout-head .sec-fab{display:none}

    /* topo */
    html.layout-head header.topo{align-items:center;margin-bottom:18px}
    html.layout-head .marca{color:${C.choc2}}
    html.layout-head h1.tit{font-size:32px;color:${C.choc}}
    html.layout-head h1.tit span{background:none!important;-webkit-text-fill-color:${C.rosa};color:${C.rosa}}
    html.layout-head #ola,html.layout-head .sub{color:${C.choc2}}
    html.layout-head #ola .vers b,html.layout-head #ola b{color:${C.rosa}}
    html.layout-head header.topo .selo.dona{display:none}
    html.layout-head .busca .cx{border-color:${C.linha};box-shadow:0 12px 28px -22px rgba(75,41,13,.45)}
    html.layout-head .busca .cx svg{color:${C.rosa}}
    html.layout-head .busca .cx:focus-within{border-color:${C.rose};box-shadow:0 0 0 3px ${C.roseBg}}

    /* botões */
    html.layout-head .btn{background:${C.rosa};color:#fff;box-shadow:0 10px 22px -12px rgba(183,86,117,.8)}
    html.layout-head .btn.ghost,html.layout-head .btn.perigo{background:#fff;color:${C.choc};border:1px solid ${C.linha};box-shadow:none}
    html.layout-head .btn.ghost:hover{border-color:${C.rose};background:${C.roseBg}}
    html.layout-head .pill{border-color:${C.linha};color:${C.choc2}}
    html.layout-head .pill[aria-pressed="true"]{background:${C.rose};border-color:${C.rose};color:${C.choc}}

    /* cartões */
    html.layout-head .card{background:#fff!important;border:1px solid ${C.linha};border-radius:22px;box-shadow:0 18px 40px -30px rgba(75,41,13,.35),0 1px 2px rgba(75,41,13,.04)}
    html.layout-head .card h2{color:${C.choc}}
    html.layout-head .k{color:${C.choc2}}
    html.layout-head .kpi{padding:20px 22px}
    html.layout-head .kpi .v{font-size:44px;color:${C.choc}}
    html.layout-head .kpi .k{letter-spacing:.18em;position:relative;z-index:1}
    html.layout-head .kpi .v{position:relative;z-index:1}
    html.layout-head .kpi::after{background:${C.roseBg}}
    html.layout-head .kpi.atrasada .v{color:var(--neon)}
    html.layout-head .kpi.st-hoje{background:${C.rose}!important;border-color:${C.rose}!important}
    html.layout-head .kpi.st-hoje .v,html.layout-head .kpi.st-hoje .k{color:${C.choc}!important}
    html.layout-head .kpi.st-hoje::after{background:rgba(255,255,255,.35)!important}
    html.layout-head .item{background:#fff;border-color:${C.linha};border-radius:16px}
    html.layout-head .item:hover{border-color:${C.rose}}
    html.layout-head .item .when{color:${C.choc2}}
    html.layout-head .st-hoje{background:${C.rose}!important;border-color:#d4a9a9!important;color:${C.choc}!important}
    html.layout-head .st-hoje .t,html.layout-head .st-hoje .when,html.layout-head .st-hoje .meta,html.layout-head .st-hoje .mut{color:${C.choc}!important}
    html.layout-head .chk{border-color:${C.rose}}
    html.layout-head .chk.on{background:${C.rosa}}
    html.layout-head .st-hoje .chk{border-color:${C.choc}!important;background:rgba(255,255,255,.55)}
    html.layout-head .tipo{background:${C.branco};border-color:${C.linha};color:${C.choc2}}
    html.layout-head .tipo.reuniao{background:#f6ecec;border-color:#e6cfcf;color:${C.choc}}
    html.layout-head .tipo.alinhamento{background:#fbeef2;border-color:#e9b9c8;color:${C.rosa}}
    html.layout-head .tipo.projeto{background:#f3ece7;border-color:#dccbbf;color:${C.choc}}
    html.layout-head .tipo.plano{background:#fff;border-color:${C.rosa};color:${C.rosa}}
    html.layout-head .prio.alta{background:${C.rosa}} html.layout-head .prio.media{background:${C.rose}}
    html.layout-head .proj-tag{background:${C.choc};border-color:${C.choc};color:#fff}
    html.layout-head .vazio{background:${C.branco};border-color:${C.linha}}
    html.layout-head .grupo-t::after{background:${C.linha}}
    html.layout-head .captura textarea{background:${C.branco};border-color:${C.linha}}
    html.layout-head .anel{background:conic-gradient(${C.rosa} calc(var(--p)*1%), ${C.roseBg} 0)}
    html.layout-head .dia{background:#fff;border-color:${C.linha}}
    html.layout-head .dia.hoje-d{border-color:${C.rosa}} html.layout-head .dia.hoje-d .num b{background:${C.rosa}}
    html.layout-head input:focus,html.layout-head select:focus,html.layout-head textarea:focus{border-color:${C.rose};box-shadow:0 0 0 3px ${C.roseBg}}
    html.layout-head dialog{box-shadow:0 40px 90px -30px rgba(75,41,13,.45)}

    /* monitoramento em tempo real */
    .hd-mon{display:none}
    html.layout-head .hd-mon{display:grid;grid-template-columns:1.25fr 1.25fr 1fr 1fr;gap:0;margin-bottom:16px;background:${C.painel};color:#fff;border-radius:22px;overflow:hidden;box-shadow:0 22px 44px -32px rgba(75,41,13,.55)}
    .hd-mon .cel{padding:18px 22px;border-right:1px solid rgba(246,236,236,.12);display:grid;gap:6px;align-content:start;min-width:0;cursor:default}
    .hd-mon .cel:last-child{border-right:0}
    .hd-mon .cel[data-ir]{cursor:pointer}
    .hd-mon .cel[data-ir]:hover{background:rgba(246,236,236,.05)}
    .hd-mon .r{font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:${C.rose};display:flex;align-items:center;gap:7px}
    .hd-mon .t{font-size:15px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .hd-mon .s{font-size:11px;color:#d9c7c0;letter-spacing:.04em}
    .hd-mon .big{font-size:30px;line-height:1;font-variant-numeric:tabular-nums}
    .hd-mon .barra2{height:6px;border-radius:999px;background:rgba(246,236,236,.15);overflow:hidden;margin-top:4px}
    .hd-mon .barra2 i{display:block;height:100%;background:${C.rose};border-radius:999px;transition:width .6s}
    .hd-mon .agora .t{color:#fff}
    .hd-mon .contagem{display:inline-block;background:${C.rosa};color:#fff;border-radius:999px;padding:2px 9px;font-size:10px;letter-spacing:.12em}

    /* secretária */
    html.layout-head .sec{border:1px solid ${C.linha};border-radius:24px;box-shadow:0 40px 80px -30px rgba(75,41,13,.5)}
    html.layout-head .sec-cab h3{color:${C.choc}}
    html.layout-head .sec-cab h3 img.laco-img{height:42px}
    html.layout-head .sec-msg.eu{background:${C.rose};border-color:${C.rose};color:${C.choc}}
    html.layout-head .sec-msg.ela{border-color:${C.linha}}
    html.layout-head .sec-base{border-color:${C.linha}}
    html.layout-head .sec-base button.mic{background:${C.choc};color:#fff;box-shadow:none}
    html.layout-head .sec-base textarea{background:${C.branco};border-color:${C.linha}}
    .sec-ia{flex:none;display:flex;gap:10px;align-items:flex-start;background:${C.roseBg};border:1px solid ${C.rose};border-radius:14px;padding:10px 12px;font-size:12px;line-height:1.45;color:${C.choc}}
    .sec-ia a{color:${C.rosa}}
    .sec-st{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${C.rosa};display:block;margin-top:2px}
    .sec-st.off{color:#a08080}

    @media (max-width:980px){
      html.layout-head .hd-side{position:static;width:auto;flex-direction:row;flex-wrap:wrap;align-items:center;padding:14px;gap:12px}
      html.layout-head .hd-perfil{display:flex;border:0;padding:0;text-align:left}
      html.layout-head .hd-perfil img{height:48px}
      html.layout-head .hd-relogio,html.layout-head .hd-sec{display:none}
      html.layout-head .hd-side nav.abas{flex-direction:row;overflow-x:auto;width:100%}
      html.layout-head .wrap{margin-left:0;padding:18px 14px 60px}
      html.layout-head .hd-mon{grid-template-columns:1fr 1fr}
      html.layout-head .hd-mon .cel{border-bottom:1px solid rgba(246,236,236,.12)}
      html.layout-head .sec-fab{display:flex}
    }
    html.layout-head.modo-app .hd-side{display:none}
    html.layout-head.modo-app nav.abas{background:#fff;border-color:${C.linha};box-shadow:none;overflow-x:auto;flex-wrap:nowrap}
    html.layout-head.modo-app nav.abas button{white-space:nowrap;flex:none}
    html.layout-head.modo-app nav.abas button[aria-selected="true"]{background:${C.rosa};color:#fff}
    @media (max-width:640px){
      html.layout-head h1.tit{font-size:24px}
      html.layout-head h1.tit img.laco-img{height:32px;margin-left:6px;vertical-align:-6px}
      h1.tit{padding-right:40px} h1.tit img.laco-fita{height:60px;top:-10px}
      html.layout-head .kpi::after{width:70px;height:70px;right:-24px;top:-24px}
      html.layout-head .kpi .v{font-size:34px}
      html.layout-head .hd-mon .cel{padding:14px 16px}
    }
    html.layout-head.modo-app .wrap{margin-left:0}
  `;
  document.head.appendChild(css);

  /* ---------- menu lateral ---------- */
  const nomeCurto = String(EU.nome || 'Karine').split(/\s+/)[0];
  const side = document.createElement('aside'); side.className = 'hd-side';
  side.innerHTML = `<div class="hd-perfil"><img src="${LACO_IMG}" alt=""><div><div class="n">${esc(nomeCurto)}</div><div class="c">Coordenação · Suporte &amp; CS</div></div></div>
    <div class="hd-relogio"><b id="hdHora">--:--</b><span id="hdData"></span><span class="hd-vivo" style="margin-top:6px"><i></i>Ao vivo</span></div>
    <div id="hdNav"></div>
    <div class="hd-sec"><button type="button" class="sec-bt" id="hdSec"><img src="${LACO_IMG}" alt=""><span><b>Minha secretária</b><small id="hdSecSt">online</small></span></button></div>`;
  document.getElementById('app').prepend(side);
  const nav = document.querySelector('nav.abas');
  if(nav && !/[?&]app=1/.test(location.search)) $('hdNav').appendChild(nav);
  $('hdSec').onclick = () => { const b = $('secAbrir'); if(b) b.click(); };

  /* ---------- monitoramento em tempo real ---------- */
  const mon = document.createElement('div'); mon.className = 'hd-mon'; mon.id = 'hdMon';
  const kpis = document.querySelector('#aba-painel .kpis');
  if(kpis) kpis.before(mon);
  mon.addEventListener('click', e => {
    const c = e.target.closest('[data-ir]'); if(!c) return;
    if(c.dataset.ir === 'item' && c.dataset.id && window.SG_verItem) SG_verItem(c.dataset.id);
    if(c.dataset.ir === 'diretoria'){ const b = document.querySelector('nav.abas [data-aba="lista"]'); if(b) b.click(); }
  });

  const min = h => { const [a, b] = String(h || '').split(':').map(Number); return a * 60 + (b || 0); };
  const evento = it => ['reuniao','alinhamento','compromisso'].includes(it.tipo);
  function falta(m){ if(m < 1) return 'agora'; if(m < 60) return 'em ' + m + ' min'; const h = Math.floor(m / 60), r = m % 60; return 'em ' + h + 'h' + (r ? String(r).padStart(2, '0') : ''); }

  function monitor(){
    const ag = new Date(), agM = ag.getHours() * 60 + ag.getMinutes(), h = iso(hojeD());
    const abertos = DB.itens.filter(i => !i.feito && i.tipo !== 'objetivo');
    const agora = abertos.filter(i => i.data === h && i.hora && evento(i) && agM >= min(i.hora) && agM < min(i.hora) + 60).sort((a, b) => a.hora.localeCompare(b.hora))[0];
    const prox = abertos.filter(i => i.data === h && i.hora && min(i.hora) > agM).sort((a, b) => a.hora.localeCompare(b.hora))[0]
      || abertos.filter(i => i.data && i.data > h).sort((a, b) => (a.data + (a.hora || '99')).localeCompare(b.data + (b.hora || '99')))[0];
    const dir = abertos.filter(i => i.prioridade === 'diretoria');
    const doDia = DB.itens.filter(i => i.tipo !== 'objetivo' && i.data === h), ok = doDia.filter(i => i.feito).length;
    const pct = doDia.length ? Math.round(ok / doDia.length * 100) : 0;
    const proxTxt = prox ? (prox.data === h ? `<span class="contagem">${falta(min(prox.hora) - agM)}</span>` : esc(fmtData(prox.data, true) + (prox.hora ? ' · ' + prox.hora : ''))) : '';
    mon.innerHTML = `
      <div class="cel agora" ${agora ? `data-ir="item" data-id="${esc(agora.id)}"` : ''}><span class="r"><span class="hd-vivo" style="letter-spacing:0"><i></i></span>Agora</span>
        <div class="t">${agora ? esc(agora.titulo) : 'Livre neste momento'}</div><div class="s">${agora ? esc((TIPO_CURTO[agora.tipo] || '') + ' · desde ' + agora.hora + (agora.pessoa ? ' · ' + agora.pessoa : '')) : 'Nenhuma reunião acontecendo'}</div></div>
      <div class="cel" ${prox ? `data-ir="item" data-id="${esc(prox.id)}"` : ''}><span class="r">Próximo</span>
        <div class="t">${prox ? esc(prox.titulo) : 'Nada marcado à frente'}</div><div class="s">${prox ? proxTxt + (prox.data === h && prox.hora ? ' · às ' + prox.hora : '') : ''}</div></div>
      <div class="cel" data-ir="diretoria"><span class="r">Diretoria</span><div class="big">${dir.length}</div><div class="s">${dir.length === 1 ? 'solicitação em aberto' : 'solicitações em aberto'}</div></div>
      <div class="cel"><span class="r">Meu dia</span><div class="big">${pct}%</div><div class="barra2"><i style="width:${pct}%"></i></div><div class="s">${ok} de ${doDia.length} concluídos</div></div>`;
  }
  function relogio(){
    const d = new Date();
    const hEl = $('hdHora'); if(hEl) hEl.innerHTML = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + `<small>${String(d.getSeconds()).padStart(2, '0')}</small>`;
    const dEl = $('hdData'); if(dEl) { const t = d.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' }); dEl.textContent = t.charAt(0).toUpperCase() + t.slice(1); }
    if(d.getSeconds() === 0) monitor();
  }
  setInterval(relogio, 1000); relogio();
  const renderAnt = render;
  render = function(){ renderAnt.apply(this, arguments); try{ monitor(); estadoIA(); }catch(_){} };

  /* ---------- secretária: laço, status da inteligência e como ligar ---------- */
  const secCab = document.querySelector('#sec .sec-cab h3');
  if(secCab && !secCab.querySelector('.sec-st')){ secCab.insertAdjacentHTML('beforeend', '<span><span style="display:block">Minha secretária</span><span class="sec-st" id="secSt"></span></span>'); [...secCab.childNodes].forEach(n => { if(n.nodeType === 3 && /Secret/.test(n.textContent)) n.remove(); }); }
  const secRes = $('secRes');
  if(secRes && !$('secIA')) secRes.insertAdjacentHTML('afterend', `<div class="sec-ia" id="secIA" hidden><span>Para eu conversar de verdade: abra <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>, crie a chave (começa com AIza… ou AQ.) e cole aqui na conversa. Uma vez só, vale também no celular.</span></div>`);
  function estadoIA(){
    const S = window.SG_secretaria, on = !!(S && S.ia && S.ia.ligada());
    const a = $('secSt'); if(a){ a.textContent = on ? 'Inteligência ligada' : 'Inteligência desligada'; a.classList.toggle('off', !on); }
    const b = $('hdSecSt'); if(b){ b.textContent = on ? 'Online · inteligência ligada' : 'Ligar inteligência'; b.classList.toggle('off', !on); }
    const c = $('secIA'); if(c) c.hidden = on;
  }
  window.addEventListener('sg-tema', () => { try{ monitor(); }catch(_){} });
  setTimeout(() => { monitor(); estadoIA(); }, 0);
})();
