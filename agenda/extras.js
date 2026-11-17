/* Agenda Coordenação — personalização da Kah
   Laço rosa com o nome, tipos separados (Reunião, Alinhamento, Projeto) e legenda de cores. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;

  /* ---------- Laço rosa (marca da Kah) ---------- */
  const LACO = `<svg class="laco" viewBox="0 0 64 48" aria-hidden="true">
    <path d="M30 22 C22 8 6 4 4 14 C2 24 16 28 30 25 Z" fill="#ff5cb8"/>
    <path d="M34 22 C42 8 58 4 60 14 C62 24 48 28 34 25 Z" fill="#ff5cb8"/>
    <path d="M28 21 C21 13 11 11 9 15 C8 19 17 23 28 23 Z" fill="#ff8fd0" opacity=".7"/>
    <path d="M36 21 C43 13 53 11 55 15 C56 19 47 23 36 23 Z" fill="#ff8fd0" opacity=".7"/>
    <path d="M29 26 L20 44 L26 42 L29 47 L32 28 Z" fill="#ff3ea5"/>
    <path d="M35 26 L44 44 L38 42 L35 47 L32 28 Z" fill="#ff3ea5"/>
    <rect x="27" y="18" width="10" height="10" rx="4" fill="#ff1fb4"/>
  </svg>`;

  const css = document.createElement('style');
  css.textContent = `
    .laco{width:30px;height:23px;display:inline-block;vertical-align:middle;filter:drop-shadow(0 2px 4px rgba(255,62,165,.35))}
    h1.tit .laco{width:40px;height:30px;margin-left:10px;vertical-align:-2px}
    .selo.dona{font-size:12px;letter-spacing:.14em;padding:6px 16px 6px 10px;gap:8px;color:var(--fg)}
    .selo.dona .laco{width:26px;height:20px}

    /* cores por tipo */
    .tipo.reuniao{background:#f3ecff;border-color:#d9c4ff;color:#5b3fa0}
    .tipo.alinhamento{background:#ffe3f3;border-color:#ff8fd0;color:#c2187a}
    .tipo.projeto{background:#f1eff4;border-color:#aea9b4;color:#414142}
    .tipo.compromisso{background:#fff;border-color:#d8d3dc;color:#5b5b60}
    .tipo.plano{background:#fff;border-color:#ffb3dc}
    .ev{border-left-width:3px!important}
    .ev.tarefa{border-left-color:#ffb3dc}
    .ev.reuniao{border-left-color:#b48cff}
    .ev.alinhamento{background:#ffe9f5;border-color:#ffc4e3;border-left-color:#ff5cb8}
    .ev.projeto{background:#f4f2f6;border-color:#e2dee6;border-left-color:#5b5b60}
    .ev.compromisso{background:#fff;border-left-color:#aea9b4}
    .ev.plano,.ev.objetivo{border-left-color:#ff1fb4}
    .legenda{display:flex;flex-wrap:wrap;gap:8px 16px;margin:-2px 0 14px;font-size:11px;color:var(--g2);letter-spacing:.06em}
    .legenda span{display:inline-flex;align-items:center;gap:6px}
    .legenda i{width:10px;height:10px;border-radius:3px;display:inline-block}
    .legenda .al{background:#ff5cb8;animation:neon 1.1s ease-in-out infinite}
    .legenda .hj{background:#ff3ea5}
  `;
  document.head.appendChild(css);

  /* ---------- Nome + laço no topo ---------- */
  EU.nome = String(EU.nome || 'Karine').toLowerCase().replace(/(^|\s)(\S)/g, (m,e,c) => e + c.toUpperCase()).replace(/ (De|Da|Do|Dos|Das) /g, m => m.toLowerCase());
  const nome = EU.nome.split(/\s+/)[0];
  const selo = document.querySelector('.selo');
  if(selo){ selo.className = 'selo dona'; selo.removeAttribute('title'); selo.innerHTML = LACO + '<span>' + esc(nome) + '</span>'; }
  const tit = document.querySelector('h1.tit');
  if(tit && !tit.querySelector('.laco')) tit.insertAdjacentHTML('beforeend', LACO);

  /* ---------- Saudação + versículo (muda a cada vez que abre) ---------- */
  const VERSICULOS = [
    ['O Senhor é o meu pastor; nada me faltará.', 'Salmos 23:1'],
    ['Tudo posso naquele que me fortalece.', 'Filipenses 4:13'],
    ['Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.', 'Salmos 37:5'],
    ['Esforça-te e tem bom ânimo; não temas, porque o Senhor teu Deus é contigo por onde quer que andares.', 'Josué 1:9'],
    ['Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.', 'Salmos 119:105'],
    ['Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.', 'Provérbios 3:5'],
    ['Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.', 'Salmos 46:1'],
    ['Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.', 'Salmos 118:24'],
    ['Consagra ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.', 'Provérbios 16:3'],
    ['O Senhor é a minha luz e a minha salvação; a quem temerei?', 'Salmos 27:1'],
    ['Todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.', 'Romanos 8:28'],
    ['Lança o teu cuidado sobre o Senhor, e ele te susterá.', 'Salmos 55:22'],
    ['Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.', 'Colossenses 3:23'],
    ['Os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.', 'Isaías 40:31'],
    ['O meu socorro vem do Senhor, que fez o céu e a terra.', 'Salmos 121:2'],
    ['Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.', 'Isaías 41:10'],
    ['Ensina-nos a contar os nossos dias, de tal maneira que alcancemos corações sábios.', 'Salmos 90:12'],
    ['Bendito o homem que confia no Senhor, e cuja esperança é o Senhor.', 'Jeremias 17:7'],
    ['Agrada-te do Senhor, e ele satisfará os desejos do teu coração.', 'Salmos 37:4'],
    ['O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos.', 'Provérbios 16:9'],
    ['Eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal.', 'Jeremias 29:11'],
    ['Aquietai-vos, e sabei que eu sou Deus.', 'Salmos 46:10'],
    ['Em paz me deito e logo durmo, porque só tu, Senhor, me fazes habitar em segurança.', 'Salmos 4:8'],
    ['As misericórdias do Senhor se renovam cada manhã; grande é a tua fidelidade.', 'Lamentações 3:22-23'],
    ['O choro pode durar uma noite, mas a alegria vem pela manhã.', 'Salmos 30:5'],
    ['Grandes coisas fez o Senhor por nós, e por isso estamos alegres.', 'Salmos 126:3'],
    ['Sede fortes, e revigore-se o vosso coração, vós todos que esperais no Senhor.', 'Salmos 31:24'],
    ['A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.', '2 Coríntios 12:9'],
    ['Buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.', 'Mateus 6:33'],
    ['Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes, que não sabes.', 'Jeremias 33:3']
  ];
  let vIdx = Math.floor(Math.random() * VERSICULOS.length);
  try{
    const ult = +localStorage.getItem('sg-agenda-versiculo');
    while(vIdx === ult) vIdx = Math.floor(Math.random() * VERSICULOS.length);
    localStorage.setItem('sg-agenda-versiculo', vIdx);
  }catch(_){}
  const cssOla = document.createElement('style');
  cssOla.textContent = `
    #ola{display:grid;gap:5px;margin-top:4px}
    #ola .saud{font-size:15px;color:var(--fg);letter-spacing:.03em}
    #ola .vers{font-style:italic;color:var(--g1);font-size:13px;line-height:1.55;max-width:680px}
    #ola .vers b{font-style:normal;font-weight:400;color:var(--pink);font-size:10px;letter-spacing:.18em;text-transform:uppercase;margin-left:6px;white-space:nowrap}`;
  document.head.appendChild(cssOla);
  const ola = document.getElementById('ola');
  function pintarOla(){
    const h = new Date().getHours();
    const [texto, ref] = VERSICULOS[vIdx];
    ola.innerHTML = `<span class="saud">${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, ${esc(nome)}.</span>
      <span class="vers">“${esc(texto)}”<b>${esc(ref)}</b></span>`;
  }
  // a agenda reescreve a saudação a cada minuto; aqui ela volta com o versículo
  new MutationObserver(() => { if(!ola.querySelector('.vers')) pintarOla(); }).observe(ola, {childList:true, characterData:true, subtree:true});
  pintarOla();

  /* ---------- Tipos separados ---------- */
  const ORDEM = [
    ['tarefa','Tarefa / obrigação','Tarefa'],
    ['reuniao','Reunião','Reunião'],
    ['alinhamento','Alinhamento','Alinhamento'],
    ['projeto','Projeto','Projeto'],
    ['compromisso','Compromisso','Compromisso'],
    ['objetivo','Objetivo','Objetivo'],
    ['plano','Plano de ação','Plano de ação']
  ];
  Object.keys(TIPOS).forEach(k => delete TIPOS[k]);
  Object.keys(TIPO_CURTO).forEach(k => delete TIPO_CURTO[k]);
  ORDEM.forEach(([k,l,c]) => { TIPOS[k] = l; TIPO_CURTO[k] = c; });

  // alinhamento se comporta como reunião (quando passa, não pisca); projeto tem prazo como tarefa
  const statusOriginal = status;
  status = function(it){ return statusOriginal(it && it.tipo === 'alinhamento' ? Object.assign({}, it, {tipo:'reuniao'}) : it); };

  // o organizador passa a separar alinhamento e projeto
  const organizarOriginal = organizar;
  organizar = function(texto){
    const itens = organizarOriginal(texto);
    itens.forEach(it => {
      const n = norm(it.orig || it.titulo).replace(/^[\s\-•*·▪►✓✔☐☑\d.)\[\]x]+/, '');
      if(/^projeto\b/.test(n) || (/\bprojeto\b/.test(n) && it.tipo === 'tarefa' && !RX_VERBO.test(n))){
        it.tipo = 'projeto';
        it.titulo = it.titulo.replace(/^projeto\s*[:–—-]\s*/i, '') || it.titulo;
        it.titulo = it.titulo.charAt(0).toUpperCase() + it.titulo.slice(1);
      } else if(it.tipo === 'reuniao' && /\b(alinhamento|alinhar|daily|weekly|1:1|1x1|one ?on ?one)\b/.test(n)){
        it.tipo = 'alinhamento';
      }
    });
    return itens;
  };

  /* ---------- Legenda de cores no calendário ---------- */
  const cal = document.getElementById('cal');
  if(cal && !document.querySelector('.legenda')){
    cal.insertAdjacentHTML('beforebegin', `<div class="legenda">
      <span><i style="background:#b48cff"></i>Reunião</span>
      <span><i style="background:#ff5cb8"></i>Alinhamento</span>
      <span><i style="background:#5b5b60"></i>Projeto</span>
      <span><i style="background:#ffb3dc"></i>Tarefa</span>
      <span><i style="background:#aea9b4"></i>Compromisso</span>
      <span><i style="background:#ff1fb4"></i>Objetivo / plano</span>
      <span><i class="al"></i>Atrasada (pisca)</span>
      <span><i class="hj"></i>Vence hoje</span></div>`);
  }

  // texto de exemplo e dica do organizador
  const cap = document.getElementById('txtCaptura');
  if(cap) cap.placeholder = cap.placeholder.replace('Objetivo: chegar', 'Alinhamento com supervisão sexta 9h&#10;Projeto: Saint Center até 15/12&#10;Objetivo: chegar'.replace(/&#10;/g,'\n'));
  const dica = document.querySelector('.captura .dica');
  if(dica) dica.innerHTML = dica.innerHTML.replace('<b>reunião</b>, ', '<b>reunião</b>, <b>alinhamento</b>, <b>projeto</b>, ');

  /* ---------- Modo reunião: pauta, anotações, resumo e plano de ação ---------- */
  const ehReuniao = it => !!it && (it.tipo === 'reuniao' || it.tipo === 'alinhamento');
  const cssR = document.createElement('style');
  cssR.textContent = `
    #dlgReuniao{width:min(1120px,calc(100vw - 24px))}
    .reu-cab{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
    .reu-cab h3{margin:4px 0 2px}
    .reu-cab .dir{display:flex;gap:8px;flex-wrap:wrap}
    .reu-grade{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:14px}
    .reu-res{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
    .reu-col{border:1px solid #f4dcea;border-radius:16px;padding:14px;background:#fff;display:grid;gap:10px;align-content:start}
    .reu-t{display:flex;justify-content:space-between;align-items:center;gap:8px}
    #rqNotas{min-height:300px;background:var(--rosa-bg);border-color:#f7d3e9;font-size:14px}
    .reu-pauta{display:grid;gap:6px;max-height:300px;overflow:auto}
    .reu-pauta .l{display:flex;gap:8px;align-items:center}
    .reu-pauta .l input[type=checkbox]{width:auto;accent-color:#ff3ea5}
    .reu-pauta .l input[type=text]{padding:7px 10px}
    .reu-pauta .l.ok input[type=text]{text-decoration:line-through;color:var(--g2)}
    .reu-pauta .l button{color:var(--g2);font-size:16px;padding:0 6px}
    .reu-dica{font-size:12px;color:var(--g2);line-height:1.5;margin:0}
    .reu-acoes{display:flex;justify-content:center}
    #rqResumo{white-space:pre-wrap;font-family:var(--font);font-size:13px;line-height:1.6;margin:0;max-height:360px;overflow:auto;color:var(--g1);background:var(--rosa-bg);border-radius:12px;padding:12px}
    .reu-plano{display:grid;gap:8px;max-height:360px;overflow:auto;padding-right:4px}
    .ac{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;border:1px solid #f4dcea;border-radius:12px;padding:8px 10px;background:#fff}
    .ac > input[type=checkbox]{width:auto;margin-top:8px;accent-color:#ff3ea5}
    .ac .cps{display:grid;gap:6px}
    .ac .l2{display:grid;grid-template-columns:1fr 1fr .9fr;gap:6px}
    .ac input,.ac select{padding:6px 8px;font-size:12px;border-radius:8px}
    .ac.off{opacity:.45}
    .ac .tg{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--pink)}
    @media(max-width:820px){.reu-grade,.reu-res{grid-template-columns:1fr} .ac .l2{grid-template-columns:1fr}}
  `;
  document.head.appendChild(cssR);
  document.body.insertAdjacentHTML('beforeend', `<dialog id="dlgReuniao"><div class="dlg">
    <div class="reu-cab">
      <div><span class="k" id="rqTipo"></span><h3 id="rqTit"></h3><span class="mut" id="rqQuando"></span></div>
      <div class="dir"><button class="btn ghost min" id="rqEditar">Editar dados</button><button class="btn ghost min" id="rqFechar">Fechar</button></div>
    </div>
    <div class="reu-grade">
      <section class="reu-col">
        <div class="reu-t"><span class="k">1 · Pauta</span><span class="mut" id="rqPautaN"></span></div>
        <input id="rqPautaIn" placeholder="Tópico da pauta e Enter (pode colar vários)">
        <div class="reu-pauta" id="rqPauta"></div>
        <p class="reu-dica">Marque cada tópico quando ele for tratado na reunião.</p>
      </section>
      <section class="reu-col">
        <div class="reu-t"><span class="k">2 · Anotações da reunião</span><span class="mut" id="rqSalvo"></span></div>
        <textarea id="rqNotas" placeholder="Vá anotando o que for falado, uma ideia por linha.&#10;&#10;Exemplos:&#10;Diretoria pediu foco no Reclame Aqui em dezembro&#10;Decidimos manter a escala 12x36 na Black Friday&#10;Vitória: revisar macros do SaintDesk até sexta&#10;Enviar relatório de 5ATM para o Junior amanhã (urgente)&#10;Nova reunião com o Time Avant dia 25 às 15h"></textarea>
        <p class="reu-dica">Tudo é salvo sozinho enquanto você escreve. Quem vai fazer: “Nome: ação”. Prazo: “até sexta”, “amanhã”, “dia 25”. Decisão: comece com “Decidimos…” ou “Ficou definido…”.</p>
      </section>
    </div>
    <div class="reu-acoes"><button class="btn" id="rqGerar">3 · Gerar resumo e plano de ação</button></div>
    <section id="rqResultado" hidden>
      <div class="reu-res">
        <div class="reu-col"><div class="reu-t"><span class="k">Resumo da reunião</span><button class="btn ghost min" id="rqCopiar">Copiar resumo</button></div><pre id="rqResumo"></pre></div>
        <div class="reu-col"><div class="reu-t"><span class="k">Plano de ação</span><span class="mut" id="rqPlanoN"></span></div>
          <div class="reu-plano" id="rqPlano"></div>
          <button class="btn ghost min" id="rqAddAcao" style="justify-self:start">+ Ação</button></div>
      </div>
      <div class="rodape" style="margin-top:14px"><span class="mut" style="font-size:12px">As ações marcadas entram na agenda como Plano de ação, com responsável e prazo.</span>
        <div class="dir"><button class="btn" id="rqSalvar">Salvar plano na agenda</button></div></div>
    </section>
  </div></dialog>`);

  let R = null, PLANO = [], PONTOS = [], DECISOES = [], tSalvar = null;
  const RX_DECISAO = /\b(decid|definid|definimos|aprovad|aprovamos|ficou (combinado|definido|decidido|acordado)|combinamos|acordamos|acordado|fica (definido|combinado))/;
  const ddmm = s => s ? s.slice(8,10) + '/' + s.slice(5,7) : '';

  function salvarDepois(){
    clearTimeout(tSalvar);
    $('rqSalvo').textContent = 'Salvando…';
    tSalvar = setTimeout(() => { salvar(); $('rqSalvo').textContent = 'Salvo ✓'; }, 500);
  }

  function abrirReuniao(it){
    R = it;
    if(!Array.isArray(R.pauta)) R.pauta = [];
    // pauta que veio do organizador ("Pautas: a, b, c") vira lista
    if(!R.pauta.length && R.notas){
      const m = /pautas?\s*:\s*(.+)/i.exec(R.notas);
      if(m) R.pauta = m[1].split(/[,;]| e /).map(t => t.trim()).filter(Boolean).map(t => ({ t: t.charAt(0).toUpperCase() + t.slice(1), ok:false }));
    }
    $('rqTipo').textContent = TIPO_CURTO[R.tipo] || 'Reunião';
    $('rqTit').textContent = R.titulo;
    $('rqQuando').textContent = [R.data ? fmtData(R.data, true) : '', R.hora, R.pessoa].filter(Boolean).join(' · ');
    $('rqNotas').value = R.anotacoes || '';
    $('rqSalvo').textContent = R.anotacoes ? 'Salvo ✓' : '';
    $('rqPautaIn').value = '';
    desenharPauta();
    PLANO = []; $('rqResultado').hidden = true;
    if(R.resumo){ gerarResumo(); }
    $('dlgReuniao').showModal();
  }

  function desenharPauta(){
    const p = R.pauta;
    $('rqPautaN').textContent = p.length ? p.filter(x => x.ok).length + ' de ' + p.length + ' tratados' : '';
    $('rqPauta').innerHTML = p.length ? p.map((x,i) => `<div class="l ${x.ok?'ok':''}"><input type="checkbox" data-pok="${i}" ${x.ok?'checked':''} aria-label="Tratado"><input type="text" data-pt="${i}" value="${esc(x.t)}"><button type="button" data-pdel="${i}" aria-label="Remover">×</button></div>`).join('')
      : '<div class="vazio" style="padding:16px">Monte a pauta antes da reunião.</div>';
  }
  $('rqPautaIn').addEventListener('keydown', e => {
    if(e.key !== 'Enter') return;
    e.preventDefault();
    const novos = e.target.value.split('\n').map(t => t.replace(/^[\s\-•*\d.)]+/, '').trim()).filter(Boolean);
    novos.forEach(t => R.pauta.push({ t, ok:false }));
    e.target.value = ''; desenharPauta(); salvarDepois();
  });
  $('rqPautaIn').addEventListener('paste', e => {
    const txt = (e.clipboardData || window.clipboardData).getData('text');
    if(!txt.includes('\n')) return;
    e.preventDefault();
    txt.split('\n').map(t => t.replace(/^[\s\-•*\d.)]+/, '').trim()).filter(Boolean).forEach(t => R.pauta.push({ t, ok:false }));
    desenharPauta(); salvarDepois();
  });
  $('rqPauta').addEventListener('input', e => {
    const t = e.target;
    if(t.dataset.pt !== undefined){ R.pauta[+t.dataset.pt].t = t.value; salvarDepois(); }
    if(t.dataset.pok !== undefined){ R.pauta[+t.dataset.pok].ok = t.checked; desenharPauta(); salvarDepois(); }
  });
  $('rqPauta').addEventListener('click', e => { const b = e.target.closest('[data-pdel]'); if(b){ R.pauta.splice(+b.dataset.pdel, 1); desenharPauta(); salvarDepois(); } });
  $('rqNotas').addEventListener('input', e => { R.anotacoes = e.target.value; salvarDepois(); });

  // "Time Avant vai liberar…", "Meiriene ficou de enviar…" → responsável
  const quemVai = t => { const m = /^(?:[-•*]\s*)?([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ&]+(?:\s(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ&][\wÀ-ÿ&]*))*)\s+(?:vai|vão|fica de|ficou de|ficaram de|precisa)\s/.exec(String(t||'').trim()); return m && !/^(eu|nós|nos|a gente)$/i.test(m[1]) ? m[1] : ''; };
  function gerarResumo(){
    const linhas = (R.anotacoes || '').split('\n').map(l => l.trim()).filter(Boolean);
    PONTOS = []; DECISOES = [];
    const jaSalvas = new Set(DB.itens.filter(i => i.origem === R.id).map(i => norm(i.titulo)));
    const res = linhas.length ? organizar('Reunião base hoje\n' + linhas.join('\n')) : [];
    const acoes = [];
    const ponto = t => { t = t.replace(/^•\s*/, '').trim(); if(!t) return; (RX_DECISAO.test(norm(t)) ? DECISOES : PONTOS).push(t); };
    res.forEach((r, i) => {
      if(r.tipo === 'reuniao' || r.tipo === 'alinhamento'){
        // reunião futura com data/hora é ação; o resto é ponto discutido
        const q = i ? acharQuando(normMesmoTam(r.orig)) : { data:'' };
        if(i && q.data){ acoes.push(r); }
        else if(i){ ponto(r.orig); }
        (r.notas || '').split('\n').forEach(ponto);
        return;
      }
      if(r.incluir === false){ ponto(r.orig); return; }
      if(RX_DECISAO.test(norm(r.orig)) && !RX_VERBO.test(norm(r.titulo))){ ponto(r.orig); return; }
      acoes.push(r);
    });
    PLANO = acoes.map(r => ({
      tmp: uid(), titulo: r.titulo, pessoa: r.pessoa || quemVai(r.orig) || nome, data: r.data, hora: r.hora,
      prioridade: r.prioridade, tipo: (r.tipo === 'reuniao' || r.tipo === 'alinhamento') ? r.tipo : 'plano',
      salvo: jaSalvas.has(norm(r.titulo)), incluir: !jaSalvas.has(norm(r.titulo))
    }));
    desenharPlano();
    $('rqResultado').hidden = false;
  }

  function textoResumo(){
    const p = R.pauta || [];
    const bl = (tit, l) => l.length ? '\n' + tit + '\n' + l.map(x => '• ' + x).join('\n') + '\n' : '';
    const plano = PLANO.filter(a => a.incluir || a.salvo);
    return 'RESUMO DA REUNIÃO\n' + R.titulo + '\n' + [R.data ? fmtData(R.data, true) : '', R.hora, R.pessoa].filter(Boolean).join(' · ') + '\n'
      + bl('PAUTA TRATADA', p.filter(x => x.ok).map(x => x.t))
      + bl('PAUTA PENDENTE', p.filter(x => !x.ok).map(x => x.t))
      + bl('PONTOS DISCUTIDOS', PONTOS)
      + bl('DECISÕES', DECISOES)
      + (plano.length ? '\nPLANO DE AÇÃO\n' + plano.map((a,i) => (i+1) + '. ' + a.titulo + ' — ' + (a.pessoa || nome) + ' — ' + (a.data ? ddmm(a.data) + (a.hora ? ' ' + a.hora : '') : 'sem prazo')).join('\n') + '\n' : '');
  }

  function desenharPlano(){
    const n = PLANO.filter(a => a.incluir).length;
    $('rqPlanoN').textContent = PLANO.length ? n + (n === 1 ? ' ação marcada' : ' ações marcadas') : '';
    $('rqPlano').innerHTML = PLANO.length ? PLANO.map((a,i) => `<div class="ac ${a.incluir || a.salvo ? '' : 'off'}">
      <input type="checkbox" data-ainc="${i}" ${a.incluir?'checked':''} ${a.salvo?'disabled':''} aria-label="Incluir">
      <div class="cps">
        <input data-ac="titulo" data-i="${i}" value="${esc(a.titulo)}" placeholder="O que fazer">
        <div class="l2">
          <input data-ac="pessoa" data-i="${i}" value="${esc(a.pessoa)}" placeholder="Responsável">
          <input type="date" data-ac="data" data-i="${i}" value="${a.data || ''}">
          <select data-ac="prioridade" data-i="${i}"><option value="alta" ${a.prioridade==='alta'?'selected':''}>Alta</option><option value="media" ${a.prioridade==='media'?'selected':''}>Média</option><option value="baixa" ${a.prioridade==='baixa'?'selected':''}>Baixa</option></select>
        </div>
        ${a.salvo ? '<span class="tg">Já está na agenda</span>' : ''}
      </div></div>`).join('')
      : '<div class="vazio" style="padding:16px">Nenhuma ação encontrada nas anotações. Use “+ Ação” para incluir.</div>';
    $('rqResumo').textContent = textoResumo();
  }
  const editarAcao = e => {
    const t = e.target;
    if(t.dataset.ainc !== undefined){ PLANO[+t.dataset.ainc].incluir = t.checked; desenharPlano(); return; }
    if(t.dataset.ac){ PLANO[+t.dataset.i][t.dataset.ac] = t.value; $('rqResumo').textContent = textoResumo(); }
  };
  $('rqPlano').addEventListener('input', editarAcao);
  $('rqPlano').addEventListener('change', editarAcao);
  $('rqAddAcao').onclick = () => {
    PLANO.push({ tmp:uid(), titulo:'', pessoa:nome, data:'', hora:'', prioridade:'media', tipo:'plano', incluir:true, salvo:false });
    desenharPlano();
    const ins = $('rqPlano').querySelectorAll('input[data-ac="titulo"]'); ins[ins.length-1].focus();
  };
  $('rqGerar').onclick = () => {
    if(!(R.anotacoes || '').trim() && !(R.pauta || []).length){ toast('Escreva as anotações da reunião primeiro.'); $('rqNotas').focus(); return; }
    gerarResumo();
    setTimeout(() => $('rqResultado').scrollIntoView({ behavior:'smooth', block:'start' }), 50);
  };
  $('rqCopiar').onclick = async () => {
    const txt = textoResumo();
    try{ await navigator.clipboard.writeText(txt); }
    catch(_){ const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast('Resumo copiado. É só colar no WhatsApp ou no e-mail.');
  };
  $('rqSalvar').onclick = () => {
    const novas = PLANO.filter(a => a.incluir && !a.salvo && a.titulo.trim());
    novas.forEach(a => {
      DB.itens.push({ id:uid(), titulo:a.titulo.trim(), tipo:a.tipo, data:a.data || '', hora:a.hora || '', prioridade:a.prioridade,
        pessoa: norm(a.pessoa) === norm(nome) ? '' : a.pessoa.trim(), notas:'Da reunião: ' + R.titulo + (R.data ? ' (' + ddmm(R.data) + ')' : ''),
        rec:'', sub:[], paiId:'', origem:R.id, feito:false, feitoEm:'', criadoEm:new Date().toISOString() });
      a.salvo = true; a.incluir = false;
    });
    R.resumo = textoResumo();
    R.notas = R.resumo;
    if(!R.feito){ R.feito = true; R.feitoEm = new Date().toISOString(); }
    salvar(); render(); desenharPlano();
    $('rqResumo').textContent = R.resumo;
    toast(novas.length ? novas.length + (novas.length > 1 ? ' ações salvas na agenda.' : ' ação salva na agenda.') : 'Resumo salvo na reunião.');
  };
  $('rqFechar').onclick = () => { if(tSalvar){ clearTimeout(tSalvar); salvar(); } $('dlgReuniao').close(); render(); };
  $('rqEditar').onclick = () => { const it = R; $('dlgReuniao').close(); abrirItem(it); };

  // clicar numa reunião ou alinhamento abre o modo reunião
  window.addEventListener('click', e => {
    if(e.target.closest('[data-chk]')) return;
    const el = e.target.closest('.item[data-id]');
    if(!el) return;
    const it = DB.itens.find(i => i.id === el.dataset.id);
    if(!ehReuniao(it)) return;
    e.stopPropagation(); e.preventDefault();
    if($('dlgDia').open) $('dlgDia').close();
    abrirReuniao(it);
  }, true);

  // botão "+ Reunião" no topo
  const bNovo = $('btnNovo');
  if(bNovo && !$('btnReuniao')){
    bNovo.insertAdjacentHTML('beforebegin', '<button class="btn ghost" id="btnReuniao">+ Reunião</button>');
    $('btnReuniao').onclick = () => {
      const ag = new Date(); ag.setMinutes(ag.getMinutes() < 30 ? 30 : 60, 0, 0);
      const it = { id:uid(), titulo:'Reunião', tipo:'reuniao', data:iso(ag), hora:pad(ag.getHours()) + ':' + pad(ag.getMinutes()), prioridade:'media', pessoa:'', notas:'', rec:'', sub:[], paiId:'', pauta:[], anotacoes:'', feito:false, feitoEm:'', criadoEm:new Date().toISOString() };
      DB.itens.push(it); salvar(); render();
      abrirItem(it);
      toast('Dê um nome e o horário. Depois clique na reunião para abrir pauta e anotações.');
    };
  }

  render();
})();
