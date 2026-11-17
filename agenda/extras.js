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
        <p class="reu-dica">Na reunião, toque em “A tratar” para marcar o tópico como “Tratado”.</p>
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
    desenharPauta(); desenharAnexos(); desenharLinha(); desenharAcomp(); preencherQuando();
    PLANO = []; $('rqResultado').hidden = true;
    if(R.resumo){ gerarResumo(); }
    $('dlgReuniao').showModal();
  }

  function desenharPauta(){
    const p = R.pauta;
    $('rqPautaN').textContent = p.length ? p.filter(x => x.ok).length + ' de ' + p.length + ' tratados' : '';
    $('rqPauta').innerHTML = p.length ? p.map((x,i) => `<div class="l ${x.ok?'ok':''} ${ehNovoPauta(x)?'novo':''}"><button type="button" class="trat ${x.ok?'on':''}" data-ptog="${i}">${x.ok?'Tratado':'A tratar'}</button><input type="text" data-pt="${i}" value="${esc(x.t)}"><span class="orig-enc">${ehNovoPauta(x) ? 'Novo · ' : ''}${ordemEncontro(x.enc)}</span><button type="button" data-pdel="${i}" aria-label="Remover">×</button></div>`).join('')
      : '<div class="vazio" style="padding:16px">Monte a pauta antes da reunião.</div>';
  }
  $('rqPautaIn').addEventListener('keydown', e => {
    if(e.key !== 'Enter') return;
    e.preventDefault();
    const novos = e.target.value.split('\n').map(t => t.replace(/^[\s\-•*\d.)]+/, '').trim()).filter(Boolean);
    novos.forEach(t => R.pauta.push({ t, ok:false, enc:R.id }));
    e.target.value = ''; desenharPauta(); salvarDepois();
  });
  $('rqPautaIn').addEventListener('paste', e => {
    const txt = (e.clipboardData || window.clipboardData).getData('text');
    if(!txt.includes('\n')) return;
    e.preventDefault();
    txt.split('\n').map(t => t.replace(/^[\s\-•*\d.)]+/, '').trim()).filter(Boolean).forEach(t => R.pauta.push({ t, ok:false, enc:R.id }));
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
    PONTOS = []; DECISOES = [];
    // seções do texto: "O que decidimos", "Próximos passos", "Pontos discutidos"…
    const HDR_DEC = /^(o que (foi )?decidi(mos|do)|decisoes|decisao|decidido|ficou decidido|deliberacoes|resolutiva|pontos acordados|acordos|o que foi acordado)\s*:?$/;
    const HDR_ACAO = /^(proximos passos|proximas (acoes|etapas)|acoes|plano de acao|encaminhamentos|tarefas|pendencias|a fazer|o que fazer|to ?do|responsaveis( e prazos)?|prazos e responsaveis|pontos a validar.{0,40})\s*:?$/;
    const HDR_NOTA = /^(contexto|diagnostico|pontos discutidos|discutido|observacoes|notas|o que foi discutido|assuntos tratados|resumo|o que a reuniao (confirmou|mostrou|levantou)|como (deve )?funciona(r)?|enquanto .{3,60}|sistema \d+\b.{0,80})\s*:?$/;
    const limpa = l => l.replace(/^[\s\-–—•*·▪►✓✔☐☑]+/, '').replace(/^\d{1,2}[.)]\s+/, '').trim();
    const livres = [], daAcao = [];
    let secao = '';
    (R.anotacoes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
      const n = norm(l).replace(/[*_#]/g, '').trim();
      if(/^(resumo|ata)( d[aeo])? reuniao\b/.test(n) && n.length < 80) return;
      if(HDR_DEC.test(n)){ secao = 'dec'; return; }
      if(HDR_ACAO.test(n)){ secao = 'acao'; return; }
      if(HDR_NOTA.test(n)){ secao = 'nota'; if(/^sistema \d/.test(n)) PONTOS.push('▸ ' + l); return; }
      if(/^o que\s+quem\s+prazo$/.test(n)) return;
      const sub = l.length < 45 && !/[.:;!?,]$/.test(l) && !/\d/.test(l) && !RX_VERBO.test(n);
      if(secao === 'dec'){ DECISOES.push(sub ? '▸ ' + l : limpa(l)); return; }
      if(secao === 'nota'){ PONTOS.push(sub ? '▸ ' + l : limpa(l)); return; }
      (secao === 'acao' ? daAcao : livres).push(l);
    });
    const linhas = livres.concat(daAcao.length ? ['Próximos passos:'].concat(daAcao) : []);
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
      + bl('PAUTA TRATADA', p.filter(x => x.ok).map(rotPauta))
      + bl('PAUTA PENDENTE', p.filter(x => !x.ok).map(rotPauta))
      + bl('PONTOS DISCUTIDOS', PONTOS)
      + bl('DECISÕES', DECISOES)
      + bl('ANEXOS', (R.anexos || []).map(a => a.nome))
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

  /* ---------- Anexos na reunião: arquivos, fotos e prints (Ctrl+V) ---------- */
  const LIBS = {
    pdf: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
    docx: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
    xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    ocr: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'
  };
  const libsCarregadas = {};
  const usarLib = url => libsCarregadas[url] || (libsCarregadas[url] = new Promise((ok, erro) => {
    const s = document.createElement('script'); s.src = url; s.onload = ok;
    s.onerror = () => { delete libsCarregadas[url]; erro(new Error('Sem internet para ler este arquivo agora. Ele ficou guardado.')); };
    document.head.appendChild(s);
  }));

  // os arquivos ficam no navegador (IndexedDB), separados da agenda
  let dbAnexos = null;
  const abrirDBA = () => dbAnexos || (dbAnexos = new Promise((ok, erro) => {
    const r = indexedDB.open('sg-agenda-anexos', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('arquivos');
    r.onsuccess = () => ok(r.result); r.onerror = () => erro(r.error);
  }));
  const guardarArq = async (id, blob) => { const db = await abrirDBA(); return new Promise((ok, erro) => { const tx = db.transaction('arquivos', 'readwrite'); tx.objectStore('arquivos').put(blob, id); tx.oncomplete = ok; tx.onerror = () => erro(tx.error); }); };
  const lerArq = async id => { const db = await abrirDBA(); return new Promise((ok, erro) => { const r = db.transaction('arquivos').objectStore('arquivos').get(id); r.onsuccess = () => ok(r.result); r.onerror = () => erro(r.error); }); };
  const apagarArq = async id => { const db = await abrirDBA(); db.transaction('arquivos', 'readwrite').objectStore('arquivos').delete(id); };

  async function lerImagem(fonte, progresso){
    await usarLib(LIBS.ocr);
    const r = await Tesseract.recognize(fonte, 'por', { logger: m => { if(m.status === 'recognizing text' && progresso) progresso(Math.round(m.progress * 100)); } });
    return r.data.text;
  }
  async function lerPdf(blob, progresso){
    await usarLib(LIBS.pdf);
    pdfjsLib.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker;
    const pdf = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
    let txt = '';
    for(let p = 1; p <= pdf.numPages; p++){
      const c = await (await pdf.getPage(p)).getTextContent();
      txt += c.items.map(i => i.str + (i.hasEOL ? '\n' : ' ')).join('') + '\n';
      if(progresso) progresso(Math.round(p / pdf.numPages * 100));
    }
    if(txt.replace(/\s/g, '').length > 20) return refluir(txt);
    // PDF escaneado: lê as páginas como foto (até 3)
    let out = '';
    for(let p = 1; p <= Math.min(3, pdf.numPages); p++){
      const pg = await pdf.getPage(p), vp = pg.getViewport({ scale: 2 });
      const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height;
      await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
      out += await lerImagem(cv, progresso) + '\n';
    }
    return out;
  }
  async function extrairTexto(blob, nomeArq, progresso){
    const ext = (String(nomeArq).split('.').pop() || '').toLowerCase(), tipo = blob.type || '';
    if(tipo.startsWith('image/')) return lerImagem(blob, progresso);
    if(tipo === 'application/pdf' || ext === 'pdf') return lerPdf(blob, progresso);
    if(ext === 'docx'){ await usarLib(LIBS.docx); return (await mammoth.extractRawText({ arrayBuffer: await blob.arrayBuffer() })).value; }
    if(['xlsx', 'xls', 'ods'].includes(ext)){ await usarLib(LIBS.xlsx); const wb = XLSX.read(await blob.arrayBuffer()); return wb.SheetNames.map(n => XLSX.utils.sheet_to_csv(wb.Sheets[n], { FS: ' · ' })).join('\n'); }
    if(tipo.startsWith('text/') || ['txt', 'md', 'csv', 'tsv', 'json', 'html', 'htm'].includes(ext)){
      let t = await blob.text();
      if(/html?/.test(ext) || tipo === 'text/html'){ const d = document.createElement('div'); d.innerHTML = t; t = d.innerText; }
      return t;
    }
    return null;
  }

  // pauta ou resolutiva (pontos acordados)?
  const RX_EH_PAUTA = /\b(pautas?|agenda|topicos|assuntos|itens a tratar|a discutir|a tratar|ordem do dia|apresentar)\b/g;
  const RX_EH_RESOL = /\b(ata|resolutiv\w*|decid\w*|acordad\w*|definid\w*|combinad\w*|aprovad\w*|ficou|encaminhamentos?|proximos passos|responsave(l|is)|prazos?|deliberad\w*)\b/g;
  function linhasDoTexto(t){
    return String(t || '').replace(/\r/g, '').split('\n')
      .flatMap(l => l.length > 220 ? l.split(/(?<=[.;!?])\s+/) : [l])
      .map(l => l.replace(/^[\s\-–—•*·▪►✓✔☐☑|]+/, '').replace(/^\d{1,2}[.)]\s+/, '').replace(/\s{2,}/g, ' ').trim())
      .filter(l => l.length >= 3 && /[A-Za-zÀ-ÿ]{3}/.test(l))
      .filter(l => !/^((pautas?|agenda|ata)( d[aeo] reuniao)?|resumo|topicos|assuntos|participantes|data|local|horario|resolutiva|pontos acordados)\s*:?\s*$/.test(norm(l)))
      .slice(0, 150);
  }
  function sugerirUso(texto){
    const n = norm(texto);
    const p = (n.match(RX_EH_PAUTA) || []).length, r = (n.match(RX_EH_RESOL) || []).length;
    if(r > p) return 'resolutiva';
    if(p > r) return 'pauta';
    return (R.feito || status(R) === 'passou') ? 'resolutiva' : 'pauta';
  }
  function desfazerUso(a){
    if(a.uso === 'pauta') R.pauta = (R.pauta || []).filter(x => x.de !== a.id);
    if(a.uso === 'resolutiva' && a.add){
      R.anotacoes = (R.anotacoes || '').replace('\n' + a.add, '').replace(a.add, '').trim();
      $('rqNotas').value = R.anotacoes;
    }
    a.uso = 'guardar'; a.add = '';
  }
  function aplicarUso(a, uso){
    desfazerUso(a);
    const ls = linhasDoTexto(a.texto);
    if(uso === 'pauta'){
      topicosDoTexto(a.texto).filter(t => norm(t) !== norm(a.nome.replace(/\.[a-z0-9]+$/i, '')) && !R.pauta.some(x => norm(x.t) === norm(t))).forEach(t => R.pauta.push({ t, ok:false, de:a.id, enc:R.id }));
      a.uso = 'pauta';
    } else if(uso === 'resolutiva' && ls.length){
      a.add = ls.join('\n');
      R.anotacoes = (R.anotacoes ? R.anotacoes.replace(/\s+$/, '') + '\n' : '') + a.add;
      $('rqNotas').value = R.anotacoes;
      a.uso = 'resolutiva';
    }
    desenharPauta(); desenharAnexos(); salvarDepois();
  }

  const cssA = document.createElement('style');
  cssA.textContent = `
    .reu-anx{border:1px dashed #f0b9d9;border-radius:16px;padding:12px 14px;background:var(--rosa-bg);display:grid;gap:10px}
    .reu-anx.sobre{border-color:var(--pink);background:#ffe4f3}
    .reu-anx .topo{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
    .reu-anx .topo .mut{font-size:12px}
    .anx-lista{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
    .anx{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;background:#fff;border:1px solid #f4dcea;border-radius:12px;padding:8px}
    .anx-th{width:64px;height:64px;border-radius:9px;background:#f7eef4;display:grid;place-items:center;overflow:hidden;cursor:pointer;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--g1);border:0}
    .anx-th img{width:100%;height:100%;object-fit:cover}
    .anx-info{display:grid;gap:4px;min-width:0;align-content:start}
    .anx-info b{font-weight:400;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .anx-info .mut{font-size:11px}
    .anx-bt{display:flex;flex-wrap:wrap;gap:4px}
    .anx-bt button{font-size:9px;letter-spacing:.12em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:4px 8px;color:var(--g2);background:#fff}
    .anx-bt button[aria-pressed="true"]{background:var(--pink);border-color:var(--pink);color:#fff}
    .anx-bt button:disabled{opacity:.4;cursor:default}
    .anx pre{grid-column:1/-1;white-space:pre-wrap;font-family:var(--font);font-size:12px;line-height:1.5;max-height:180px;overflow:auto;background:var(--rosa-bg);border-radius:8px;padding:8px;margin:0;color:var(--g1)}
  `;
  document.head.appendChild(cssA);
  document.querySelector('#dlgReuniao .reu-acoes').insertAdjacentHTML('beforebegin', `<section class="reu-anx" id="rqAnexos">
    <div class="topo">
      <div><span class="k">Anexos · documentos, fotos e prints</span><br><span class="mut">Arraste aqui, clique em “Anexar” ou cole um print com Ctrl+V. Eu leio e coloco na pauta ou nos pontos acordados.</span></div>
      <label class="btn ghost min" style="cursor:pointer">Anexar<input type="file" id="rqArq" multiple hidden accept="image/*,.pdf,.docx,.xlsx,.xls,.csv,.txt,.md,.html"></label>
    </div>
    <div class="anx-lista" id="rqAnxLista"></div>
  </section>`);

  const urlsAnexo = {};
  const ehImg = a => /^image\//.test(a.tipo);
  function estadoAnexo(a){
    if(a.estado === 'lendo') return 'Lendo… ' + (a.pct ? a.pct + '%' : '');
    if(a.estado === 'erro' || a.estado === 'guardado') return a.erro || 'Guardado.';
    if(a.estado === 'vazio') return 'Guardado. Não encontrei texto para ler.';
    const n = (R.pauta || []).filter(x => x.de === a.id).length;
    if(a.uso === 'pauta') return 'Lido · ' + n + (n === 1 ? ' tópico entrou' : ' tópicos entraram') + ' na pauta';
    if(a.uso === 'resolutiva') return 'Lido · entrou nas anotações como pontos acordados';
    return 'Lido · só guardado';
  }
  function desenharAnexos(){
    if(!R) return;
    const l = R.anexos || [];
    $('rqAnxLista').innerHTML = l.map(a => `<div class="anx" data-aid="${a.id}">
      <button class="anx-th" data-anx-abrir="${a.id}" title="Abrir">${ehImg(a) ? '<img alt="">' : esc((a.nome.split('.').pop() || 'arq').slice(0, 4))}</button>
      <div class="anx-info"><b title="${esc(a.nome)}">${esc(a.nome)}</b><span class="mut" data-anx-st="${a.id}">${esc(estadoAnexo(a))}</span>
        <div class="anx-bt">
          <button data-anx-uso="pauta" aria-pressed="${a.uso === 'pauta'}" ${a.texto ? '' : 'disabled'}>Pauta</button>
          <button data-anx-uso="resolutiva" aria-pressed="${a.uso === 'resolutiva'}" ${a.texto ? '' : 'disabled'}>Resolutiva</button>
          <button data-anx-uso="guardar" aria-pressed="${a.uso === 'guardar'}">Só guardar</button>
          <button data-anx-ver ${a.texto ? '' : 'disabled'}>Ver texto</button>
          <button data-anx-rm>Remover</button>
        </div></div>
      <pre hidden>${esc(a.texto)}</pre></div>`).join('');
    l.filter(ehImg).forEach(async a => {
      try{
        if(!urlsAnexo[a.id]){ const b = await lerArq(a.id); if(!b) return; urlsAnexo[a.id] = URL.createObjectURL(b); }
        const img = $('rqAnxLista').querySelector(`[data-anx-abrir="${a.id}"] img`); if(img) img.src = urlsAnexo[a.id];
      }catch(_){}
    });
  }
  function atualizarEstado(a){ const el = document.querySelector(`[data-anx-st="${a.id}"]`); if(el) el.textContent = estadoAnexo(a); }

  async function adicionarAnexos(arquivos){
    if(!R || !arquivos.length) return;
    if(!Array.isArray(R.anexos)) R.anexos = [];
    const reuniao = R;
    for(const f of arquivos){
      if(f.size > 25 * 1024 * 1024){ toast(f.name + ': acima de 25 MB.'); continue; }
      const print = !f.name || /^image\.(png|jpe?g)$/i.test(f.name);
      const nomeA = print ? 'Print ' + new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(',', '') + '.png' : f.name;
      const a = { id: uid(), nome: nomeA, tipo: f.type || '', tamanho: f.size, em: new Date().toISOString(), texto: '', uso: 'guardar', estado: 'lendo', pct: 0 };
      try{ await guardarArq(a.id, f); }
      catch(_){ toast('Não consegui guardar ' + nomeA + ' neste navegador.'); continue; }
      reuniao.anexos.push(a); salvar();
      if(reuniao === R) desenharAnexos();
      extrairTexto(f, nomeA, pct => { a.pct = pct; atualizarEstado(a); })
        .then(t => {
          if(t === null){ a.estado = 'guardado'; a.erro = 'Guardado. Este tipo de arquivo eu não consigo ler.'; }
          else { a.texto = String(t).replace(/ /g, ' ').slice(0, 20000).trim(); a.estado = a.texto ? 'lido' : 'vazio'; }
          if(a.texto && reuniao === R && $('dlgReuniao').open){ aplicarUso(a, sugerirUso(a.texto)); toast(a.uso === 'pauta' ? 'Li “' + nomeA + '” e coloquei na pauta.' : 'Li “' + nomeA + '” e coloquei nos pontos acordados.'); }
          else { salvar(); if(reuniao === R) desenharAnexos(); }
        })
        .catch(e => { a.estado = 'erro'; a.erro = (e && e.message) || 'Não consegui ler. O arquivo ficou guardado.'; salvar(); if(reuniao === R) desenharAnexos(); });
    }
  }

  $('rqArq').addEventListener('change', e => { adicionarAnexos([...e.target.files]); e.target.value = ''; });
  // Ctrl+V de print ou arquivo em qualquer parte da tela da reunião
  $('dlgReuniao').addEventListener('paste', e => {
    const fs = [...(e.clipboardData && e.clipboardData.files || [])];
    if(!fs.length) return;
    e.preventDefault(); e.stopPropagation();
    adicionarAnexos(fs);
  }, true);
  const zona = $('rqAnexos');
  ['dragenter', 'dragover'].forEach(ev => $('dlgReuniao').addEventListener(ev, e => { if([...(e.dataTransfer && e.dataTransfer.types || [])].includes('Files')){ e.preventDefault(); zona.classList.add('sobre'); } }));
  ['dragleave', 'drop'].forEach(ev => $('dlgReuniao').addEventListener(ev, () => zona.classList.remove('sobre')));
  $('dlgReuniao').addEventListener('drop', e => { const fs = [...(e.dataTransfer && e.dataTransfer.files || [])]; if(fs.length){ e.preventDefault(); adicionarAnexos(fs); } });

  $('rqAnxLista').addEventListener('click', async e => {
    const card = e.target.closest('[data-aid]'); if(!card) return;
    const a = (R.anexos || []).find(x => x.id === card.dataset.aid); if(!a) return;
    const uso = e.target.closest('[data-anx-uso]');
    if(uso){ const u = uso.dataset.anxUso; if(u === 'guardar'){ desfazerUso(a); desenharPauta(); desenharAnexos(); salvarDepois(); } else aplicarUso(a, u); return; }
    if(e.target.closest('[data-anx-ver]')){ const pre = card.querySelector('pre'); pre.hidden = !pre.hidden; return; }
    if(e.target.closest('[data-anx-abrir]')){
      try{ const b = await lerArq(a.id); if(!b){ toast('Arquivo não encontrado neste navegador.'); return; } window.open(urlsAnexo[a.id] || (urlsAnexo[a.id] = URL.createObjectURL(b)), '_blank'); }catch(_){ toast('Não consegui abrir o arquivo.'); }
      return;
    }
    const rm = e.target.closest('[data-anx-rm]');
    if(rm){
      if(rm.dataset.conf !== '1'){ rm.dataset.conf = '1'; rm.textContent = 'Confirmar'; setTimeout(() => { rm.dataset.conf = ''; rm.textContent = 'Remover'; }, 3000); return; }
      R.anexos = R.anexos.filter(x => x.id !== a.id);
      apagarArq(a.id).catch(() => {});
      if(urlsAnexo[a.id]){ URL.revokeObjectURL(urlsAnexo[a.id]); delete urlsAnexo[a.id]; }
      salvar(); desenharAnexos(); toast('Anexo removido. O que já tinha ido para a pauta e as anotações continua lá.');
    }
  });

  /* ---------- Anexos no organizador ("Jogue aqui. Eu organizo.") ---------- */
  const cssC = document.createElement('style');
  cssC.textContent = `
    .cap-anx{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:10px}
    .cap-anx .mut{font-size:12px}
    .cap-lista{display:flex;flex-wrap:wrap;gap:6px;width:100%}
    .cap-lista:empty{display:none}
    .cap-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;background:#fff;border:1px solid #f2d3e6;border-radius:999px;padding:5px 6px 5px 12px;font-size:12px}
    .cap-chip b{font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}
    .cap-chip .mut{font-size:11px;white-space:nowrap}
    .cap-chip button{color:var(--g2);font-size:15px;padding:0 6px;line-height:1}
    .captura.sobre textarea{border-color:var(--pink);background:#ffe4f3}
    .nota .anx-ent{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .nota .anx-ent button{font-size:10px;letter-spacing:.1em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:4px 10px;color:var(--g1);background:var(--rosa-bg)}
  `;
  document.head.appendChild(cssC);
  const capTxt = $('txtCaptura'), capCard = document.querySelector('.captura');
  capTxt.insertAdjacentHTML('afterend', `<div class="cap-anx">
    <label class="btn ghost min" style="cursor:pointer">Anexar documento<input type="file" id="capArq" multiple hidden accept="image/*,.pdf,.docx,.xlsx,.xls,.csv,.txt,.md,.html"></label>
    <span class="mut">PDF, Word, Excel, foto ou print. Também dá para arrastar aqui ou colar com Ctrl+V.</span>
    <div class="cap-lista" id="capLista"></div></div>`);

  let PEND = [];
  function desenharPend(){
    $('capLista').innerHTML = PEND.map((p, i) => `<span class="cap-chip"><b title="${esc(p.nome)}">${esc(p.nome)}</b><span class="mut">${
      p.estado === 'lendo' ? 'Lendo… ' + (p.pct ? p.pct + '%' : '') : p.estado === 'lido' ? 'Lido ✓' : p.estado === 'vazio' ? 'Sem texto, só guardado' : esc(p.erro || 'Só guardado')
    }</span><button type="button" data-cap-rm="${i}" aria-label="Tirar anexo">×</button></span>`).join('');
  }
  function lerParaOrganizador(arquivos){
    arquivos.forEach(f => {
      if(f.size > 25 * 1024 * 1024){ toast(f.name + ': acima de 25 MB.'); return; }
      const print = !f.name || /^image\.(png|jpe?g)$/i.test(f.name);
      const p = { file:f, nome: print ? 'Print ' + new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(',', '') + '.png' : f.name, estado:'lendo', pct:0, texto:'', add:'' };
      PEND.push(p); desenharPend();
      extrairTexto(f, p.nome, pct => { p.pct = pct; desenharPend(); })
        .then(t => {
          if(t === null){ p.estado = 'guardado'; p.erro = 'Não sei ler este tipo, só guardado'; desenharPend(); return; }
          p.texto = String(t).replace(/ /g, ' ').replace(/\r/g, '').split('\n').map(l => l.replace(/\s{2,}/g, ' ').trim()).filter(Boolean).slice(0, 200).join('\n');
          p.estado = p.texto ? 'lido' : 'vazio';
          if(p.texto && PEND.includes(p)){
            p.add = p.texto;
            capTxt.value = (capTxt.value.trim() ? capTxt.value.replace(/\s+$/, '') + '\n' : '') + p.add;
            toast('Li “' + p.nome + '”. O texto está no campo: confira e clique em Organizar na agenda.');
          }
          desenharPend();
        })
        .catch(e => { p.estado = 'erro'; p.erro = (e && e.message) || 'Não consegui ler, só guardado'; desenharPend(); });
    });
  }
  $('capArq').addEventListener('change', e => { lerParaOrganizador([...e.target.files]); e.target.value = ''; });
  capTxt.addEventListener('paste', e => {
    const fs = [...(e.clipboardData && e.clipboardData.files || [])];
    if(!fs.length) return;
    e.preventDefault(); lerParaOrganizador(fs);
  });
  ['dragenter', 'dragover'].forEach(ev => capCard.addEventListener(ev, e => { if([...(e.dataTransfer && e.dataTransfer.types || [])].includes('Files')){ e.preventDefault(); capCard.classList.add('sobre'); } }));
  ['dragleave', 'drop'].forEach(ev => capCard.addEventListener(ev, () => capCard.classList.remove('sobre')));
  capCard.addEventListener('drop', e => { const fs = [...(e.dataTransfer && e.dataTransfer.files || [])]; if(fs.length){ e.preventDefault(); lerParaOrganizador(fs); } });
  $('capLista').addEventListener('click', e => {
    const b = e.target.closest('[data-cap-rm]'); if(!b) return;
    const p = PEND[+b.dataset.capRm];
    if(p && p.add) capTxt.value = capTxt.value.replace('\n' + p.add, '').replace(p.add, '').trim();
    PEND.splice(+b.dataset.capRm, 1); desenharPend();
  });

  // ao salvar na agenda, os arquivos ficam guardados na Caixa de entrada e nas reuniões criadas
  const salvarPrevOriginal = $('pvSalvar').onclick;
  $('pvSalvar').onclick = function(){
    const antes = new Set(DB.itens.map(i => i.id)), antesE = new Set(DB.entradas.map(x => x.id));
    salvarPrevOriginal.call(this);
    const novos = DB.itens.filter(i => !antes.has(i.id));
    const ent = DB.entradas.find(x => !antesE.has(x.id));
    const lista = PEND.slice(); PEND = []; desenharPend();
    if(!novos.length || !lista.length) return;
    (async () => {
      const destinos = [ent].concat(novos.filter(ehReuniao)).filter(Boolean);
      for(const p of lista){
        for(const d of destinos){
          const id = uid();
          try{ await guardarArq(id, p.file); }catch(_){ continue; }
          if(!Array.isArray(d.anexos)) d.anexos = [];
          d.anexos.push({ id, nome:p.nome, tipo:p.file.type || '', tamanho:p.file.size, em:new Date().toISOString(), texto:p.texto, uso:'guardar', estado: p.texto ? 'lido' : (p.estado === 'vazio' ? 'vazio' : 'guardado'), erro: p.texto ? '' : (p.erro || '') });
        }
      }
      salvar(); render();
    })();
  };
  const limparOriginal = $('btnLimparCap').onclick;
  $('btnLimparCap').onclick = function(){ PEND = []; desenharPend(); limparOriginal.call(this); };

  // Caixa de entrada: mostra e abre os arquivos de cada texto
  const renderEntradaOriginal = renderEntrada;
  renderEntrada = function(){
    renderEntradaOriginal();
    DB.entradas.filter(x => (x.anexos || []).length).forEach(x => {
      const bt = document.querySelector(`[data-reorg="${x.id}"]`); if(!bt) return;
      const nota = bt.closest('.nota'); if(!nota || nota.querySelector('.anx-ent')) return;
      nota.insertAdjacentHTML('beforeend', '<div class="anx-ent">' + x.anexos.map(a => `<button type="button" data-ent-anx="${a.id}" title="Abrir">📎 ${esc(a.nome)}</button>`).join('') + '</div>');
    });
  };
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-ent-anx]'); if(!b) return;
    try{ const f = await lerArq(b.dataset.entAnx); if(!f){ toast('Arquivo não encontrado neste navegador.'); return; } window.open(URL.createObjectURL(f), '_blank'); }catch(_){ toast('Não consegui abrir o arquivo.'); }
  });

  /* ---------- Texto de PDF: junta as linhas quebradas no meio da frase ---------- */
  function refluir(t){
    const out = [];
    String(t || '').replace(/\r/g, '').split('\n').map(l => l.trim()).forEach(l => {
      if(!l){ if(out.length && out[out.length - 1] !== '') out.push(''); return; }
      const ant = out.length ? out[out.length - 1] : '';
      const novoItem = /^([☐☑✓✔•\-–—*·▪►]|\d{1,2}[.)]\s)/.test(l);
      if(ant && !/[.:;!?]$/.test(ant) && !novoItem && (/^[a-zà-ÿ0-9(“"'%]/.test(l) || ant.length >= 70)) out[out.length - 1] = ant + ' ' + l;
      else out.push(l);
    });
    return out.join('\n').trim();
  }
  // tópicos de pauta: uma linha curta por assunto
  function topicosDoTexto(t){
    const vistos = new Set();
    return refluir(t).split('\n')
      .map(l => l.replace(/^[\s\-–—•*·▪►✓✔☐☑|]+/, '').replace(/^\d{1,2}[.)]\s+/, '').trim())
      .filter(l => l.length >= 3 && /[A-Za-zÀ-ÿ]{3}/.test(l))
      .filter(l => !/^como usar\b/.test(norm(l)))
      .filter(l => !/^((pautas?|agenda|ata|resumo)( d[aeo] reuniao)?|topicos|assuntos|participantes|data|local|horario|resolutiva|pontos acordados)\s*:?\s*$/.test(norm(l)))
      .map(l => { if(l.length > 110){ const m = /^(.{20,110}?[.:;!?])\s/.exec(l); l = m ? m[1] : l.slice(0, 107).replace(/\s+\S*$/, '') + '…'; } return l.replace(/[.:;]$/, ''); })
      .filter(l => { const k = norm(l); if(vistos.has(k)) return false; vistos.add(k); return true; })
      .slice(0, 80);
  }

  /* ---------- Levar conteúdo para dentro de uma reunião ---------- */
  const reunioesRecentes = () => DB.itens.filter(ehReuniao).sort((a, b) => {
    const h = iso(hojeD()), da = Math.abs(deIso(a.data || h) - deIso(h)), db = Math.abs(deIso(b.data || h) - deIso(h));
    return da - db || (b.hora || '').localeCompare(a.hora || '');
  });
  const rotuloReuniao = r => r.titulo + (r.data ? ' · ' + fmtData(r.data) : '') + (r.hora ? ' ' + r.hora : '');
  async function levarParaReuniao(it, texto, anexos){
    R = it;
    if(!Array.isArray(R.pauta)) R.pauta = [];
    if(!Array.isArray(R.anexos)) R.anexos = [];
    let resto = String(texto || '');
    for(const x of anexos){
      if(x.texto) resto = resto.replace(x.texto, '');
      const id = uid();
      const blob = x.file || (x.blobId ? await lerArq(x.blobId).catch(() => null) : null);
      if(blob){ try{ await guardarArq(id, blob); }catch(_){} }
      const txt = /\.pdf$/i.test(x.nome) ? refluir(x.texto || '') : (x.texto || '');
      const a = { id, nome:x.nome, tipo:x.tipo || '', tamanho:x.tamanho || 0, em:new Date().toISOString(), texto:txt, uso:'guardar', estado: txt ? 'lido' : 'guardado', erro: txt ? '' : 'Guardado.' };
      R.anexos.push(a);
      if(a.texto) aplicarUso(a, /^(checklist|pauta)/i.test(x.nome) ? 'pauta' : sugerirUso(a.texto));
    }
    resto = resto.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
    if(resto) R.anotacoes = (R.anotacoes ? R.anotacoes.replace(/\s+$/, '') + '\n' : '') + resto;
    salvar(); render();
  }

  // na conferência do organizador: "Colocar dentro da reunião"
  const cssL = document.createElement('style');
  cssL.textContent = `
    .vinc{display:grid;gap:6px;background:var(--rosa-bg);border:1px solid #f7cfe6;border-radius:14px;padding:12px 14px}
    .vinc select{border-radius:10px}
    .vinc .mut{font-size:12px}
    .nota .ent-acoes{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .nota .ent-acoes .tg{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);align-self:center}
  `;
  document.head.appendChild(cssL);
  $('prevLista').insertAdjacentHTML('beforebegin', `<div class="vinc"><label class="c"><span class="k">Onde colocar</span>
    <select id="pvVinc"></select></label><span class="mut" id="pvVincInfo"></span></div>`);
  function atualizarVinc(){
    const v = $('pvVinc').value;
    $('prevLista').hidden = !!v;
    $('pvSalvar').textContent = v ? 'Levar para a reunião' : 'Adicionar à agenda';
    $('pvVincInfo').textContent = v ? 'Os anexos e o texto entram na pauta e nas anotações desta reunião. Nenhum item solto é criado. Depois é só gerar o resumo e o plano de ação.' : 'Cada linha vira um item separado na agenda, como na lista abaixo.';
  }
  $('pvVinc').addEventListener('change', atualizarVinc);
  const abrirPreviaOriginal = abrirPrevia;
  abrirPrevia = function(texto){
    abrirPreviaOriginal(texto);
    if(!$('dlgPrev').open) return;
    const rs = reunioesRecentes().slice(0, 15);
    $('pvVinc').innerHTML = '<option value="">Criar itens separados na agenda</option>' + rs.map(r => `<option value="${r.id}">Dentro da reunião: ${esc(rotuloReuniao(r))}</option>`).join('');
    // sugere a reunião quando há anexos ou o texto fala de reunião e existe uma reunião perto de hoje
    const n = norm(texto), h = iso(hojeD());
    let melhor = null, pts = 0;
    rs.forEach(r => {
      let p = 0;
      norm(r.titulo).split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !/^(reuniao|alinhamento|time|com|para)$/.test(w)).forEach(w => { if(n.includes(w)) p += 2; });
      if(r.data === h) p += 1;
      if(/\breuniao\b/.test(n)) p += 1;
      if(PEND.length) p += 1;
      if(p > pts){ pts = p; melhor = r; }
    });
    const temReuniaoNova = PREV.some(x => x.tipo === 'reuniao' && !x.feito);
    $('pvVinc').value = melhor && pts >= 2 && (PEND.length || !temReuniaoNova) ? melhor.id : '';
    atualizarVinc();
  };
  const salvarComAnexosOriginal = $('pvSalvar').onclick;
  $('pvSalvar').onclick = async function(){
    const v = $('pvVinc').value;
    if(!v) return salvarComAnexosOriginal.call(this);
    const it = DB.itens.find(i => i.id === v); if(!it) return;
    const anexos = PEND.map(p => ({ nome:p.nome, tipo:p.file.type || '', tamanho:p.file.size, texto:p.texto, file:p.file }));
    PEND = []; desenharPend();
    await levarParaReuniao(it, PREV_TEXTO, anexos);
    DB.entradas.push({ id:uid(), em:new Date().toISOString(), texto:PREV_TEXTO, gerados:0, reuniao:it.id, anexosNomes:anexos.map(a => a.nome) });
    salvar(); $('dlgPrev').close(); capTxt.value = ''; render();
    abrirReuniao(it);
    toast('Levado para “' + it.titulo + '”. Confira a pauta e as anotações.');
  };

  // Caixa de entrada: "Levar para reunião", remover os itens soltos (com desfazer)
  document.body.insertAdjacentHTML('beforeend', `<dialog id="dlgLevar"><div class="dlg">
    <h3>Levar para uma reunião</h3>
    <p class="mut" style="margin:0;font-size:13px">O texto e os anexos deste registro entram na pauta e nas anotações da reunião escolhida.</p>
    <label class="c"><span class="k">Reunião</span><select id="lvReuniao"></select></label>
    <div class="rodape"><span></span><div class="dir"><button class="btn ghost" id="lvCancelar">Cancelar</button><button class="btn" id="lvOk">Levar</button></div></div>
  </div></dialog>`);
  let ENT = null;
  $('lvCancelar').onclick = () => $('dlgLevar').close();
  $('lvOk').onclick = async () => {
    const it = DB.itens.find(i => i.id === $('lvReuniao').value); if(!it || !ENT) return;
    const e = ENT;
    await levarParaReuniao(it, e.texto, (e.anexos || []).map(a => ({ nome:a.nome, tipo:a.tipo, tamanho:a.tamanho, texto:a.texto, blobId:a.id })));
    e.reuniao = it.id; salvar(); $('dlgLevar').close(); render();
    abrirReuniao(it);
    toast('Levado para “' + it.titulo + '”.');
  };
  const renderEntradaComAnexos = renderEntrada;
  renderEntrada = function(){
    renderEntradaComAnexos();
    DB.entradas.forEach(x => {
      const bt = document.querySelector(`[data-reorg="${x.id}"]`); if(!bt) return;
      const nota = bt.closest('.nota'); if(!nota || nota.querySelector('.ent-acoes')) return;
      const r = x.reuniao && DB.itens.find(i => i.id === x.reuniao);
      const soltos = DB.itens.filter(i => i.entrada === x.id && !ehReuniao(i)).length;
      nota.insertAdjacentHTML('beforeend', `<div class="ent-acoes">
        ${r ? `<span class="tg">Na reunião: ${esc(r.titulo)}</span>` : ''}
        <button class="btn ghost min" data-levar="${x.id}">Levar para reunião</button>
        ${soltos ? `<button class="btn perigo min" data-rm-soltos="${x.id}">Remover os ${soltos} itens soltos deste texto</button>` : ''}
        ${(x.removidos || []).length ? `<button class="btn ghost min" data-restaurar="${x.id}">Restaurar ${x.removidos.length} itens removidos</button>` : ''}
      </div>`);
    });
  };
  document.addEventListener('click', e => {
    const lv = e.target.closest('[data-levar]');
    if(lv){
      ENT = DB.entradas.find(x => x.id === lv.dataset.levar); if(!ENT) return;
      const rs = reunioesRecentes();
      if(!rs.length){ toast('Crie a reunião primeiro (botão + Reunião).'); return; }
      $('lvReuniao').innerHTML = rs.map(r => `<option value="${r.id}">${esc(rotuloReuniao(r))}</option>`).join('');
      if(ENT.reuniao) $('lvReuniao').value = ENT.reuniao;
      $('dlgLevar').showModal(); return;
    }
    const rm = e.target.closest('[data-rm-soltos]');
    if(rm){
      if(rm.dataset.conf !== '1'){ rm.dataset.conf = '1'; rm.textContent = 'Confirmar remoção'; setTimeout(() => { if(rm.isConnected){ rm.dataset.conf = ''; renderEntrada(); } }, 4000); return; }
      const x = DB.entradas.find(y => y.id === rm.dataset.rmSoltos); if(!x) return;
      const sai = DB.itens.filter(i => i.entrada === x.id && !ehReuniao(i));
      x.removidos = (x.removidos || []).concat(sai);
      const ids = new Set(sai.map(i => i.id));
      DB.itens = DB.itens.filter(i => !ids.has(i.id));
      salvar(); render(); toast(sai.length + ' itens removidos. Dá para restaurar na Caixa de entrada.'); return;
    }
    const rs = e.target.closest('[data-restaurar]');
    if(rs){
      const x = DB.entradas.find(y => y.id === rs.dataset.restaurar); if(!x) return;
      const ids = new Set(DB.itens.map(i => i.id));
      DB.itens = DB.itens.concat((x.removidos || []).filter(i => !ids.has(i.id)));
      const n = (x.removidos || []).length; x.removidos = [];
      salvar(); render(); toast(n + ' itens restaurados.');
    }
  });

  /* ---------- Só pisca o que é para fazer: tarefas, ações e projetos ---------- */
  const statusComAlinhamento = status;
  status = function(it){ const s = statusComAlinhamento(it); return (s === 'atrasada' && it && it.tipo === 'objetivo') ? 'futura' : s; };

  /* ---------- Reunião: Tratado / A tratar, acompanhamento do plano e linha do tempo ---------- */
  const cssT = document.createElement('style');
  cssT.textContent = `
    .trat{font-size:9px;letter-spacing:.16em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:6px 10px;color:var(--g2);background:#fff;white-space:nowrap;min-width:86px;flex:none}
    .trat.on{background:var(--pink);border-color:var(--pink);color:#fff}
    .reu-pauta .l button.trat{font-size:9px;padding:6px 10px;color:var(--g2);line-height:1.2}
    .reu-pauta .l button.trat.on{color:#fff}
    .reu-linha{display:grid;gap:10px;border:1px solid #f4dcea;border-radius:16px;padding:12px 14px;background:#fff}
    .lin{display:flex;align-items:stretch;gap:0;overflow-x:auto;padding-bottom:2px}
    .enc{display:grid;gap:2px;text-align:left;border:1px solid #f2d3e6;border-radius:12px;padding:8px 12px;background:#fff;min-width:150px;flex:none}
    .enc b{font-weight:400;font-size:12px;letter-spacing:.06em}
    .enc span{font-size:11px;color:var(--g2)}
    .enc i{font-style:normal;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--g3)}
    .enc.feito i{color:var(--pink)}
    .enc.atual{border-color:var(--pink);box-shadow:0 0 0 3px var(--rosa-claro)}
    .lin .seta{align-self:center;width:28px;height:2px;background:linear-gradient(90deg,#ffb3dc,#c9a6ff);flex:none}
    .lin-novo{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .lin-novo input{width:auto;padding:6px 10px;font-size:13px;border-radius:10px}
    #rqAcomp .acp{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;border:1px solid #f4dcea;border-radius:12px;padding:8px 10px;background:#fff}
    #rqAcomp .acp .t{font-size:13px;line-height:1.35}
    #rqAcomp .acp .mut{font-size:11px}
    #rqAcomp .acp.feito .t{text-decoration:line-through;color:var(--g2)}
    #rqAcompLista{display:grid;gap:6px;max-height:320px;overflow:auto}
  `;
  document.head.appendChild(cssT);
  document.querySelector('#dlgReuniao .reu-cab').insertAdjacentHTML('afterend', `<section class="reu-linha">
    <div class="reu-t"><span class="k">Linha do tempo deste assunto</span><span class="mut" id="rqLinhaN"></span></div>
    <div class="lin" id="rqLinha"></div>
    <div class="lin-novo"><span class="mut" style="font-size:12px">Marcou outro encontro?</span>
      <input type="date" id="rqProxData" aria-label="Data do próximo encontro"><input type="time" id="rqProxHora" aria-label="Hora do próximo encontro">
      <button class="btn ghost min" id="rqProxOk">+ Agendar próximo encontro</button></div>
  </section>`);
  $('rqResultado').insertAdjacentHTML('afterend', `<section class="reu-col" id="rqAcomp" hidden style="margin-top:14px">
    <div class="reu-t"><span class="k">Plano de ação · acompanhamento</span><span class="mut" id="rqAcompN"></span></div>
    <div id="rqAcompLista"></div></section>`);

  const serieDe = r => DB.itens.filter(i => ehReuniao(i) && (i.id === (r.serie || r.id) || (r.serie || r.id) === i.serie))
    .sort((a, b) => ((a.data || '') + (a.hora || '')).localeCompare((b.data || '') + (b.hora || '')));
  function desenharLinha(){
    const s = serieDe(R);
    $('rqLinhaN').textContent = s.length > 1 ? s.length + ' encontros' : '';
    $('rqLinha').innerHTML = s.map((r, i) => {
      const feito = r.feito || status(r) === 'passou';
      return (i ? '<span class="seta"></span>' : '') + `<button type="button" class="enc ${r.id === R.id ? 'atual' : ''} ${feito ? 'feito' : ''}" data-enc="${r.id}">
        <b>${i + 1}º encontro</b><span>${r.data ? esc(fmtData(r.data, true)) : 'Sem data'}${r.hora ? ' · ' + esc(r.hora) : ''}</span><i>${feito ? 'Realizado' : 'Agendado'}</i></button>`;
    }).join('');
    const d = somaDias(R.data ? deIso(R.data) : hojeD(), 1);
    $('rqProxData').value = iso(d.getDay() === 6 ? somaDias(d, 2) : d.getDay() === 0 ? somaDias(d, 1) : d);
    $('rqProxHora').value = R.hora || '';
  }
  $('rqLinha').addEventListener('click', e => {
    const b = e.target.closest('[data-enc]'); if(!b || b.dataset.enc === R.id) return;
    const it = DB.itens.find(i => i.id === b.dataset.enc); if(it){ if(tSalvar){ clearTimeout(tSalvar); salvar(); } abrirReuniao(it); }
  });
  $('rqProxOk').onclick = () => {
    if(!$('rqProxData').value){ $('rqProxData').focus(); return; }
    const serie = R.serie || R.id; R.serie = serie;
    const n = serieDe(R).length + 1;
    const base = R.titulo.replace(/\s*\(\d+º encontro\)\s*$/, '');
    const pend = (R.pauta || []).filter(x => !/^retomar o plano de acao/.test(norm(x.t))).map(x => ({ t:x.t, ok:!!x.ok, enc: x.enc || serie }));
    const novo = { id:uid(), titulo: base + ' (' + n + 'º encontro)', tipo:R.tipo, data:$('rqProxData').value, hora:$('rqProxHora').value, prioridade:R.prioridade, pessoa:R.pessoa || '',
      notas:'', rec:'', sub:[], paiId:'', serie, pauta:[{ t:'Retomar o plano de ação do encontro anterior', ok:false }].concat(pend), anotacoes:'', anexos:[], feito:false, feitoEm:'', criadoEm:new Date().toISOString() };
    DB.itens.push(novo); salvar(); render(); desenharLinha();
    toast(n + 'º encontro agendado para ' + fmtData(novo.data, true) + (novo.hora ? ' às ' + novo.hora : '') + '. A pauta segue com os tópicos anteriores; o que você incluir lá aparece como novo.');
  };

  function desenharAcomp(){
    const ids = new Set(serieDe(R).map(r => r.id));
    const enc = {}; serieDe(R).forEach((r, i) => enc[r.id] = (i + 1) + 'º encontro');
    const acoes = DB.itens.filter(i => ids.has(i.origem) && !ehReuniao(i)).sort((a, b) => (a.feito - b.feito) || ordem(a, b));
    $('rqAcomp').hidden = !acoes.length;
    const feitas = acoes.filter(a => a.feito).length;
    $('rqAcompN').textContent = acoes.length ? feitas + ' de ' + acoes.length + ' feitas' : '';
    $('rqAcompLista').innerHTML = acoes.map(a => `<div class="acp ${clsSt(a)} ${a.feito ? 'feito' : ''}">
      <button type="button" class="trat ${a.feito ? 'on' : ''}" data-acp="${a.id}">${a.feito ? 'Feito' : 'Em aberto'}</button>
      <div><div class="t">${esc(a.titulo)}</div><div class="mut">${[a.pessoa || nome, a.data ? 'prazo ' + fmtData(a.data) : 'sem prazo', ids.size > 1 ? enc[a.origem] : ''].filter(Boolean).map(esc).join(' · ')}</div></div></div>`).join('');
  }
  $('rqAcompLista').addEventListener('click', e => {
    const b = e.target.closest('[data-acp]'); if(!b) return;
    const it = DB.itens.find(i => i.id === b.dataset.acp); if(it){ concluir(it); desenharAcomp(); }
  });
  // pauta: Tratado / A tratar
  $('rqPauta').addEventListener('click', e => {
    const b = e.target.closest('[data-ptog]'); if(!b) return;
    const x = R.pauta[+b.dataset.ptog]; if(!x) return;
    x.ok = !x.ok; desenharPauta(); salvarDepois();
  });
  const salvarPlanoOriginal = $('rqSalvar').onclick;
  $('rqSalvar').onclick = function(){ salvarPlanoOriginal.call(this); desenharAcomp(); desenharLinha(); };

  /* ---------- Remarcar, salvar e excluir direto na reunião; atalhos para adiar ---------- */
  const cssM = document.createElement('style');
  cssM.textContent = `
    .reu-quando{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
    .reu-quando input{width:auto;padding:6px 10px;font-size:13px;border-radius:10px}
    .reu-quando .chip,.adiar .chip{font-size:9px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:6px 10px;color:var(--g1);background:#fff}
    .reu-quando .chip:hover,.adiar .chip:hover{border-color:var(--pink);color:var(--fg)}
    .adiar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:-4px}
  `;
  document.head.appendChild(cssM);
  $('rqQuando').insertAdjacentHTML('afterend', `<div class="reu-quando">
    <input type="date" id="rqData" aria-label="Data da reunião"><input type="time" id="rqHora" aria-label="Horário da reunião">
    <button type="button" class="chip" data-rq-adiar="-1">Antecipar 1 dia</button>
    <button type="button" class="chip" data-rq-adiar="1">Adiar 1 dia</button>
    <button type="button" class="chip" data-rq-adiar="7">Adiar 1 semana</button></div>`);
  $('rqEditar').textContent = 'Mais detalhes';
  $('rqFechar').insertAdjacentHTML('beforebegin', '<button class="btn perigo min" id="rqExcluir">Excluir</button>');
  $('rqFechar').insertAdjacentHTML('afterend', '<button class="btn min" id="rqSalvarFechar">Salvar e fechar</button>');
  function preencherQuando(){
    $('rqData').value = R.data || ''; $('rqHora').value = R.hora || '';
    $('rqExcluir').dataset.conf = ''; $('rqExcluir').textContent = 'Excluir';
  }
  function aplicarQuando(){
    R.data = $('rqData').value; R.hora = $('rqHora').value;
    $('rqQuando').textContent = [R.data ? fmtData(R.data, true) : '', R.hora, R.pessoa].filter(Boolean).join(' · ');
    salvar(); render(); desenharLinha();
  }
  $('rqData').addEventListener('change', () => { aplicarQuando(); toast('Data alterada para ' + (R.data ? fmtData(R.data, true) : 'sem data') + '.'); });
  $('rqHora').addEventListener('change', () => { aplicarQuando(); toast('Horário alterado para ' + (R.hora || 'sem horário') + '.'); });
  document.querySelector('#dlgReuniao .reu-quando').addEventListener('click', e => {
    const b = e.target.closest('[data-rq-adiar]'); if(!b) return;
    $('rqData').value = iso(somaDias(R.data ? deIso(R.data) : hojeD(), +b.dataset.rqAdiar));
    aplicarQuando(); toast('Remarcada para ' + fmtData(R.data, true) + (R.hora ? ' às ' + R.hora : '') + '.');
  });
  $('rqSalvarFechar').onclick = () => { if(tSalvar){ clearTimeout(tSalvar); } salvar(); $('dlgReuniao').close(); render(); toast('Reunião salva.'); };
  $('rqExcluir').onclick = () => {
    const b = $('rqExcluir');
    if(b.dataset.conf !== '1'){ b.dataset.conf = '1'; b.textContent = 'Confirmar exclusão'; setTimeout(() => { if(b.dataset.conf === '1'){ b.dataset.conf = ''; b.textContent = 'Excluir'; } }, 4000); return; }
    const sai = R;
    // se for o 1º encontro de uma série, o próximo passa a ser o início da linha do tempo
    const outros = DB.itens.filter(i => i !== sai && i.serie === sai.id);
    if(outros.length){ const nova = outros[0].id; outros.forEach(i => i.serie = nova === i.id ? undefined : nova); }
    DB.itens = DB.itens.filter(i => i !== sai);
    if(tSalvar) clearTimeout(tSalvar);
    salvar(); $('dlgReuniao').close(); render();
    toast('Reunião excluída. As ações dela continuam na agenda.');
  };

  // formulário de tarefa: atalhos para adiar ou antecipar
  $('iData').closest('.g3').insertAdjacentHTML('afterend', `<div class="adiar"><span class="k">Remarcar</span>
    <button type="button" class="chip" data-adiar="hoje">Hoje</button>
    <button type="button" class="chip" data-adiar="-1">Antecipar 1 dia</button>
    <button type="button" class="chip" data-adiar="1">Adiar 1 dia</button>
    <button type="button" class="chip" data-adiar="7">Adiar 1 semana</button></div>`);
  document.querySelector('#fItem .adiar').addEventListener('click', e => {
    const b = e.target.closest('[data-adiar]'); if(!b) return;
    const v = b.dataset.adiar;
    $('iData').value = v === 'hoje' ? iso(hojeD()) : iso(somaDias($('iData').value ? deIso($('iData').value) : hojeD(), +v));
    atualizarGoogle();
  });

  /* ---------- Pauta: o que é novo neste encontro (café clarinho) e origem de cada tópico ---------- */
  const cssO = document.createElement('style');
  cssO.textContent = `
    .reu-pauta .l.novo input[type=text]{background:#f7f0e8;border-color:#e8d9c6}
    .reu-pauta .l .orig-enc{display:none;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#a38b70;white-space:nowrap}
    .reu-pauta.ver-origem .l .orig-enc{display:inline}
    .mini-orig{font-size:9px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #e8d9c6;border-radius:999px;padding:3px 8px;color:#a38b70;background:#fff;margin-left:8px}
    .mini-orig[aria-pressed="true"]{background:#f7f0e8;color:#7d6650}
    .reu-pauta-leg{font-size:11px;color:#a38b70;margin:0}
    .reu-pauta-leg i{display:inline-block;width:10px;height:10px;border-radius:3px;background:#f7f0e8;border:1px solid #e8d9c6;vertical-align:-1px;margin-right:4px}
  `;
  document.head.appendChild(cssO);
  $('rqPautaN').insertAdjacentHTML('afterend', '<button type="button" class="mini-orig" id="rqVerOrigem" aria-pressed="false" title="Mostrar de qual encontro veio cada tópico">origem</button>');
  $('rqPauta').insertAdjacentHTML('afterend', '<p class="reu-pauta-leg" id="rqPautaLeg" hidden><i></i>Novo neste encontro</p>');
  $('rqVerOrigem').onclick = () => {
    const on = $('rqVerOrigem').getAttribute('aria-pressed') !== 'true';
    $('rqVerOrigem').setAttribute('aria-pressed', String(on));
    $('rqPauta').classList.toggle('ver-origem', on);
  };
  function ordemEncontro(id){ const s = serieDe(R); const i = s.findIndex(r => r.id === id); return (i < 0 ? 1 : i + 1) + 'º encontro'; }
  function ehNovoPauta(x){ const s = serieDe(R); return !!x.enc && x.enc === R.id && s.length > 1 && s[0].id !== R.id; }
  function rotPauta(x){ return x.t + (ehNovoPauta(x) ? ' (novo neste encontro)' : ''); }
  const desenharPautaBase = desenharPauta;
  desenharPauta = function(){
    desenharPautaBase();
    const n = (R.pauta || []).filter(ehNovoPauta).length;
    $('rqPautaLeg').hidden = !n;
    if(n) $('rqPautaN').textContent += ' · ' + n + (n === 1 ? ' novo' : ' novos');
  };

  /* ---------- Secretária: fale ou escreva e ela coloca na agenda ---------- */
  const cssS = document.createElement('style');
  cssS.textContent = `
    .sec-fab{position:fixed;right:22px;bottom:22px;z-index:40;display:flex;align-items:center;gap:8px;border-radius:999px;padding:10px 18px 10px 12px;background:#fff;border:1px solid #f2d3e6;box-shadow:0 14px 30px -12px rgba(255,62,165,.55);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg)}
    .sec-fab:hover{border-color:var(--pink)}
    .sec-fab .laco{width:28px;height:21px}
    .sec{position:fixed;right:22px;bottom:84px;z-index:41;width:min(420px,calc(100vw - 32px));background:#fff;border:1px solid #f4dcea;border-radius:22px;box-shadow:0 30px 70px -24px rgba(255,62,165,.5);padding:18px;display:grid;gap:12px}
    .sec-cab{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .sec-cab h3{font-weight:400;font-size:18px;letter-spacing:.04em;margin:0;display:flex;align-items:center;gap:8px}
    .sec-cab button{font-size:18px;color:var(--g2);padding:0 6px}
    .sec .mut{font-size:12px;line-height:1.5}
    .sec-mic{display:flex;align-items:center;gap:12px}
    .sec-mic button.mic{width:56px;height:56px;border-radius:50%;background:var(--grad);color:#fff;font-size:22px;flex:none;box-shadow:0 10px 22px -8px rgba(255,62,165,.6)}
    .sec-mic button.mic.on{animation:neon 1.1s ease-in-out infinite;background:var(--pink)}
    .sec textarea{min-height:84px;border-radius:14px;background:var(--rosa-bg);border-color:#f7d3e9}
    .sec-acoes{display:flex;justify-content:flex-end;gap:8px}
    .sec-res{display:grid;gap:6px;max-height:220px;overflow:auto}
    .sec-res .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid #f4dcea;border-radius:12px;padding:8px 10px}
    .sec-res .r .t{font-size:13px;line-height:1.35}
    .sec-res .r .mut{font-size:11px}
    .sec-res .r .bts{display:flex;gap:4px}
    .sec-res .r .bts button{font-size:9px;letter-spacing:.12em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:4px 8px;color:var(--g1);background:#fff}
  `;
  document.head.appendChild(cssS);
  document.body.insertAdjacentHTML('beforeend', `<button class="sec-fab" id="secAbrir" title="Fale ou escreva e a secretária coloca na agenda">${LACO}Secretária</button>
  <section class="sec" id="sec" hidden aria-label="Secretária">
    <div class="sec-cab"><h3>${LACO}Secretária</h3><button type="button" id="secFechar" aria-label="Fechar">×</button></div>
    <div class="sec-mic"><button type="button" class="mic" id="secMic" aria-label="Falar">🎙</button>
      <span class="mut" id="secDica">Toque no microfone e fale, ou escreva abaixo. Ex.: “coloca na minha agenda que dia 8/12 às 16h a Márcia da Loggi vem visitar o time do Suporte”.</span></div>
    <textarea id="secTxt" placeholder="O que coloco na sua agenda?"></textarea>
    <div class="sec-acoes"><button class="btn" id="secOk">Colocar na agenda</button></div>
    <div class="sec-res" id="secRes"></div>
  </section>`);
  // tira o pedido ("coloca na minha agenda que…") e deixa só o compromisso
  function limparPedido(l){
    return l.replace(/^\s*(secret[aá]ria[,:]?\s*)?(por favor[,]?\s*)?/i, '')
      .replace(/^(me\s+)?(coloca|coloque|colocar|anota|anote|anotar|agenda|agende|agendar|marca|marque|marcar|lembra|lembre|lembrar|registra|registre|adiciona|adicione|inclui|inclua|p[oõ]e|ponha|salva|salve)(-me)?\s+/i, '')
      .replace(/^(isso\s+|a[ií]\s+)?((na|no|pra|para|em)\s+(a\s+|o\s+)?(minha|minh|meu)\s+(agenda|calend[aá]rio)\s*)?/i, '')
      .replace(/^(que|de|pra|para|me)\s+/i, '')
      .trim();
  }
  let ouvindo = false, rec = null, executarAoParar = false;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function atualizarMic(){ $('secMic').classList.toggle('on', ouvindo); $('secMic').setAttribute('aria-label', ouvindo ? 'Parar' : 'Falar'); $('secDica').textContent = ouvindo ? 'Ouvindo… fale com calma. Toque de novo para terminar.' : 'Toque no microfone e fale, ou escreva abaixo.'; }
  $('secMic').onclick = () => {
    if(ouvindo){ executarAoParar = true; rec && rec.stop(); return; }
    if(!SR){ toast('Este navegador não tem ditado. No Windows, use a tecla Windows + H dentro do campo.'); $('secTxt').focus(); return; }
    rec = new SR(); rec.lang = 'pt-BR'; rec.interimResults = true; rec.continuous = true;
    const antes = $('secTxt').value.trim(); let final = '';
    rec.onresult = e => {
      let parcial = '';
      for(let i = e.resultIndex; i < e.results.length; i++){ const r = e.results[i]; if(r.isFinal) final += r[0].transcript + ' '; else parcial += r[0].transcript; }
      $('secTxt').value = ((antes ? antes + '\n' : '') + final + parcial).trim();
    };
    rec.onerror = e => { toast(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Libere o microfone: clique no cadeado ao lado do endereço e permita o microfone.' : (e.error === 'no-speech' ? 'Não ouvi nada. Tente de novo.' : 'Não consegui ouvir agora. Pode escrever no campo.')); };
    rec.onend = () => { ouvindo = false; atualizarMic(); if($('secTxt').value.trim() && executarAoParar !== null) executarSecretaria(); executarAoParar = false; };
    try{ rec.start(); ouvindo = true; atualizarMic(); }catch(_){ toast('Não consegui abrir o microfone.'); }
  };
  function executarSecretaria(){
    const t = $('secTxt').value.trim(); if(!t) return;
    const linhas = t.split(/\n|(?<=[.!?;])\s+|\s+(?:e também|e depois|e ainda)\s+/i).map(limparPedido).filter(l => l.length > 2);
    const achados = organizar(linhas.join('\n')).filter(p => p.incluir !== false && p.titulo.trim());
    if(!achados.length){ toast('Não entendi. Diga o que é, quando e com quem.'); return; }
    const ent = uid(), feitos = [];
    achados.forEach(p => {
      const n = norm(p.orig || p.titulo);
      let tipo = p.tipo;
      if(tipo === 'tarefa' && /\b(visit\w*|vem aqui|vir aqui|vai vir|vai vim|vem ao|almoco|jantar|evento|treinamento|entrevista|consulta|medico|dentista)\b/.test(n)) tipo = 'compromisso';
      const it = { id:uid(), titulo:p.titulo.trim().replace(/[,;\s]+(urgente|importante|com urg[eê]ncia|por favor)[.!]*$/i, ''), tipo, data:p.data, hora:p.hora, prioridade:p.prioridade, pessoa:p.pessoa || '', notas:'Pela secretária: ' + (p.orig || p.titulo),
        rec:p.rec || '', sub:[], paiId:'', origem:'', entrada:ent, feito:false, feitoEm:'', criadoEm:new Date().toISOString() };
      if(ehReuniao(it)){ it.pauta = []; it.anotacoes = ''; }
      DB.itens.push(it); feitos.push(it);
    });
    DB.entradas.push({ id:ent, em:new Date().toISOString(), texto:t, gerados:feitos.length, via:'secretaria' });
    salvar(); render();
    $('secTxt').value = '';
    $('secRes').insertAdjacentHTML('afterbegin', feitos.map(it => `<div class="r" data-sec="${it.id}"><div><div class="t">${esc(it.titulo)}</div>
      <div class="mut">${esc(TIPO_CURTO[it.tipo] || it.tipo)} · ${it.data ? esc(fmtData(it.data, true)) : 'sem data'}${it.hora ? ' · ' + esc(it.hora) : ''}${it.pessoa ? ' · ' + esc(it.pessoa) : ''}</div></div>
      <div class="bts"><button type="button" data-sec-abrir="${it.id}">Abrir</button><button type="button" data-sec-desfazer="${it.id}">Desfazer</button></div></div>`).join(''));
    toast(feitos.length === 1 ? 'Coloquei na sua agenda: ' + feitos[0].titulo + '.' : 'Coloquei ' + feitos.length + ' itens na sua agenda.');
  }
  $('secOk').onclick = executarSecretaria;
  $('secTxt').addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); executarSecretaria(); } });
  $('secAbrir').onclick = () => { $('sec').hidden = !$('sec').hidden; if(!$('sec').hidden) $('secTxt').focus(); };
  $('secFechar').onclick = () => { if(ouvindo){ executarAoParar = null; rec && rec.stop(); } $('sec').hidden = true; };
  $('secRes').addEventListener('click', e => {
    const d = e.target.closest('[data-sec-desfazer]');
    if(d){ DB.itens = DB.itens.filter(i => i.id !== d.dataset.secDesfazer); salvar(); render(); d.closest('.r').remove(); toast('Desfeito.'); return; }
    const a = e.target.closest('[data-sec-abrir]');
    if(a){ const it = DB.itens.find(i => i.id === a.dataset.secAbrir); if(!it){ toast('Esse item não está mais na agenda.'); return; } if(ehReuniao(it)) abrirReuniao(it); else abrirItem(it); }
  });

  render();
})();
