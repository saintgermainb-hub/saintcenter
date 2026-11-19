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
      <span><i class="al"></i>Atrasada</span>
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
        <textarea id="rqNotas" placeholder="Vá anotando o que for falado, uma ideia por linha.&#10;&#10;Exemplos:&#10;Diretoria pediu prioridade para a feira de verão&#10;Decidimos manter o orçamento aprovado&#10;Paula: revisar a lista de convidados até sexta&#10;Enviar o relatório final para o Bruno amanhã (urgente)&#10;Nova reunião com o fornecedor dia 25 às 15h"></textarea>
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
    R = it; window.SG_reuAtual = it;
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
          <select data-ac="prioridade" data-i="${i}"><option value="diretoria" ${a.prioridade==='diretoria'?'selected':''}>Diretoria</option><option value="alta" ${a.prioridade==='alta'?'selected':''}>Alta</option><option value="media" ${a.prioridade==='media'?'selected':''}>Média</option><option value="baixa" ${a.prioridade==='baixa'?'selected':''}>Baixa</option></select>
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
    if(!it) return;
    e.stopPropagation(); e.preventDefault();
    if($('dlgDia').open) $('dlgDia').close();
    if(ehReuniao(it)) abrirReuniao(it); else verItem(it);   // tarefa abre para ler; editar só se quiser
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
  const guardarLocal = async (id, blob) => { const db = await abrirDBA(); return new Promise((ok, erro) => { const tx = db.transaction('arquivos', 'readwrite'); tx.objectStore('arquivos').put(blob, id); tx.oncomplete = ok; tx.onerror = () => erro(tx.error); }); };
  const lerLocal = async id => { const db = await abrirDBA(); return new Promise((ok, erro) => { const r = db.transaction('arquivos').objectStore('arquivos').get(id); r.onsuccess = () => ok(r.result); r.onerror = () => erro(r.error); }); };
  // anexos também vão para o servidor (Google Drive da coordenação): o computador e o celular veem os mesmos arquivos
  const KENV = CHAVE + ':anexos-no-servidor';
  const enviados = () => { try{ return new Set(JSON.parse(localStorage.getItem(KENV) || '[]')); }catch(_){ return new Set(); } };
  const marcarEnviado = id => { const e = enviados(); e.add(id); try{ localStorage.setItem(KENV, JSON.stringify([...e])); }catch(_){} };
  const paraB64 = blob => new Promise((ok, erro) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1] || ''); r.onerror = () => erro(r.error); r.readAsDataURL(blob); });
  async function subirArq(id, blob){
    if(!window.SG_nuvem || !SG_nuvem.ativo()) return false;
    try{ await SG_nuvem.call('agendaAnexoSalvar', id, blob.name || '', blob.type || '', await paraB64(blob)); marcarEnviado(id); return true; }
    catch(_){ return false; }
  }
  const guardarArq = async (id, blob) => { await guardarLocal(id, blob); subirArq(id, blob); };
  const lerArq = async id => {
    const b = await lerLocal(id).catch(() => null);
    if(b || !window.SG_nuvem || !SG_nuvem.ativo()) return b;
    try{
      const r = await SG_nuvem.call('agendaAnexoLer', id); if(!r || !r.b64) return null;
      const bin = atob(r.b64), u8 = new Uint8Array(bin.length); for(let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const blob = new Blob([u8], { type: r.tipo || 'application/octet-stream' });
      guardarLocal(id, blob).catch(() => {});
      return blob;
    }catch(_){ return null; }
  };
  const apagarArq = async id => { const db = await abrirDBA(); db.transaction('arquivos', 'readwrite').objectStore('arquivos').delete(id); if(window.SG_nuvem && SG_nuvem.ativo()) SG_nuvem.call('agendaAnexoApagar', id).catch(() => {}); };
  // leva para o servidor os anexos que ainda só estão neste aparelho (inclusive os antigos)
  window.addEventListener('sg-agenda-sync', ev => {
    if(!ev.detail || ev.detail.cls !== 'ok' || window.__sgReenviando) return;
    const env = enviados();
    const ids = DB.itens.flatMap(i => (i.anexos || []).map(a => a.id)).concat(DB.entradas.flatMap(e => (e.anexos || []).map(a => a.id))).filter(id => id && !env.has(id));
    if(!ids.length) return;
    window.__sgReenviando = true;
    (async () => { for(const id of ids){ const b = await lerLocal(id).catch(() => null); if(b) await subirArq(id, b); } window.__sgReenviando = false; })();
  });

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
      const feito = realizada(r), semNota = !feito && (r.feito || status(r) === 'passou');
      return (i ? '<span class="seta"></span>' : '') + `<button type="button" class="enc ${r.id === R.id ? 'atual' : ''} ${feito ? 'feito' : ''} ${semNota ? 'sem-nota' : ''}" data-enc="${r.id}">
        <b>${i + 1}º encontro</b><span>${r.data ? esc(fmtData(r.data, true)) : 'Sem data'}${r.hora ? ' · ' + esc(r.hora) : ''}</span><i>${feito ? 'Realizado' : semNota ? 'Sem anotações' : 'Agendado'}</i></button>`;
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
    .sec{position:fixed;right:22px;bottom:84px;z-index:41;width:min(420px,calc(100vw - 32px));height:min(600px,calc(100vh - 120px));background:#fff;border:1px solid #f4dcea;border-radius:22px;box-shadow:0 30px 70px -24px rgba(255,62,165,.5);padding:16px;display:flex;flex-direction:column;gap:10px}
    .sec[hidden]{display:none}
    .sec-cab{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:none}
    .sec-cab h3{font-weight:400;font-size:18px;letter-spacing:.04em;margin:0;display:flex;align-items:center;gap:8px}
    .sec-cab button{font-size:18px;color:var(--g2);padding:0 6px}
    .sec .mut{font-size:12px;line-height:1.5}
    .sec-res{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:10px;padding:4px 2px}
    .sec-msg{max-width:86%;border-radius:16px;padding:9px 12px;font-size:13px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
    .sec-msg.eu{align-self:flex-end;background:var(--rosa-bg);border:1px solid #f7d3e9;border-bottom-right-radius:4px}
    .sec-msg.ela{align-self:flex-start;background:#fff;border:1px solid #efe7ee;border-bottom-left-radius:4px;display:grid;gap:8px}
    .sec-msg .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid #f4dcea;border-radius:12px;padding:7px 9px;white-space:normal}
    .sec-msg .r .t{font-size:13px;line-height:1.35}
    .sec-msg .r .mut{font-size:11px}
    .sec-msg .bts{display:flex;gap:4px;flex-wrap:wrap;white-space:normal}
    .sec-msg .r .bts button{font-size:9px;letter-spacing:.12em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:4px 8px;color:var(--g1);background:#fff}
    .sec-msg>.bts button{font-size:12px;border:1px solid #f2d3e6;border-radius:999px;padding:6px 12px;color:var(--fg);background:#fff}
    .sec-msg>.bts button:hover:not(:disabled){border-color:var(--pink)}
    .sec-msg>.bts button:disabled{opacity:.45}
    .sec-msg .hr{font-size:9px;color:#aea9b4;letter-spacing:.08em}
    .sec-digitando{align-self:flex-start;font-size:11px;color:#aea9b4;letter-spacing:.1em}
    .sec-base{flex:none;display:flex;align-items:flex-end;gap:8px;border-top:1px solid #f6e2ee;padding-top:10px}
    .sec-base button.mic{width:42px;height:42px;border-radius:50%;background:var(--grad);color:#fff;font-size:18px;flex:none;box-shadow:0 8px 18px -8px rgba(255,62,165,.6)}
    .sec-base button.mic.on{animation:neon 1.1s ease-in-out infinite;background:var(--pink)}
    .sec-base textarea{flex:1;min-height:42px;max-height:120px;resize:none;border-radius:14px;background:var(--rosa-bg);border-color:#f7d3e9;padding:10px 12px;font-size:13px}
    .sec-base .btn{flex:none;height:42px}
    .sec-dica{flex:none;font-size:10px;color:#aea9b4;letter-spacing:.06em;min-height:0}
  `;
  document.head.appendChild(cssS);
  document.body.insertAdjacentHTML('beforeend', `<button class="sec-fab" id="secAbrir" title="Fale ou escreva e a secretária coloca na agenda">${LACO}Secretária</button>
  <section class="sec" id="sec" hidden aria-label="Secretária">
    <div class="sec-cab"><h3>${LACO}Secretária</h3><button type="button" id="secFechar" aria-label="Fechar">×</button></div>
    <div class="sec-res" id="secRes"></div>
    <div class="sec-dica" id="secDica"></div>
    <div class="sec-base"><button type="button" class="mic" id="secMic" aria-label="Falar">🎙</button>
      <textarea id="secTxt" rows="1" placeholder="Converse comigo…"></textarea>
      <button class="btn" id="secOk">Enviar</button></div>
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
  function atualizarMic(){ $('secMic').classList.toggle('on', ouvindo); $('secMic').setAttribute('aria-label', ouvindo ? 'Parar' : 'Falar'); $('secDica').textContent = ouvindo ? 'Ouvindo… fale com calma. Toque de novo para terminar.' : ''; }
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
  function secretariaCore(t){
    const linhas = t.split(/\n|(?<=[.!?;])\s+|\s+(?:e também|e depois|e ainda)\s+/i).map(limparPedido).filter(l => l.length > 2);
    const achados = organizar(linhas.join('\n')).filter(p => p.incluir !== false && p.titulo.trim());
    if(!achados.length) return [];
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
    return feitos;
  }
  // usado pelo aplicativo do celular (Secretária no estilo WhatsApp)
  window.SG_secretaria = {
    anotar: t => secretariaCore(String(t || '').trim()).map(it => Object.assign({}, it)),
    desfazer: id => { const n = DB.itens.length; DB.itens = DB.itens.filter(i => i.id !== id); if(DB.itens.length !== n){ salvar(); render(); return true; } return false; },
    itens: () => DB.itens.slice(), status: it => status(it), ehReuniao: it => ehReuniao(it), tipoCurto: k => TIPO_CURTO[k] || k, fmtData: (d, c) => fmtData(d, c),
    abrir: id => { const it = DB.itens.find(i => i.id === id); if(!it) return false; if(ehReuniao(it)) abrirReuniao(it); else verItem(it); return true; }
  };
  // resposta da secretária que conversa (secretaria-conversa.js): texto, itens e botões
  const SEC_OPS = {};
  const horaAgora = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  function rolarFim(){ const el = $('secRes'); el.scrollTop = el.scrollHeight; }
  function balaoEu(t){ $('secRes').insertAdjacentHTML('beforeend', `<div class="sec-msg eu">${esc(t)}<div class="hr" style="text-align:right">${horaAgora()}</div></div>`); rolarFim(); }
  function mostrarConversa(pedido, r){
    if(pedido) balaoEu(pedido);
    const ops = (r.opcoes || []).map(o => { const k = uid(); SEC_OPS[k] = o.acao; return `<button type="button" data-sec-op="${k}">${esc(o.rotulo)}${o.sub ? ' · ' + esc(o.sub) : ''}</button>`; }).join('');
    const cards = (r.cards || []).map(c => { const k = uid(); SEC_OPS[k] = c; const it = DB.itens.find(i => i.id === c.id) || c;
      return `<div class="r" data-sec="${esc(c.id)}"><div><div class="t">${esc(it.titulo)}</div><div class="mut">${c.apagado ? 'Desmarcado' : esc(TIPO_CURTO[it.tipo] || it.tipo || '') + ' · ' + (it.data ? esc(fmtData(it.data, true)) : 'sem data') + (it.hora ? ' · ' + esc(it.hora) : '')}</div></div>
        <div class="bts">${c.apagado ? '' : `<button type="button" data-sec-abrir="${esc(c.id)}">Abrir</button>`}${c.podeDesfazer ? `<button type="button" data-sec-desf="${k}">Desfazer</button>` : ''}</div></div>`; }).join('');
    $('secRes').insertAdjacentHTML('beforeend', `<div class="sec-msg ela"><div>${esc(r.texto)}</div>${cards}${ops ? `<div class="bts">${ops}</div>` : ''}<div class="hr">${horaAgora()}</div></div>`);
    rolarFim();
  }
  // ao abrir pela primeira vez, ela cumprimenta
  function saudar(){
    if($('secRes').children.length || !(window.SG_secretaria && SG_secretaria.conversar)) return;
    const h = new Date().getHours();
    try{ const fn = SG_secretaria.saudarLocal || SG_secretaria.conversar; Promise.resolve(fn(h < 12 ? 'bom dia' : h < 18 ? 'boa tarde' : 'boa noite')).then(r => { if(!$('secRes').children.length) mostrarConversa('', r); }).catch(() => {}); }catch(_){}
  }
  function executarSecretaria(){
    const t = $('secTxt').value.trim(); if(!t) return;
    if(window.SG_secretaria && window.SG_secretaria.conversar){
      $('secTxt').value = ''; ajustarSec(); balaoEu(t);
      const falha = { texto:'Tive um problema para entender agora. Pode repetir de outro jeito?' };
      $('secRes').insertAdjacentHTML('beforeend', '<div class="sec-digitando" id="secDig">digitando…</div>'); rolarFim();
      const t0 = Date.now();
      Promise.resolve().then(() => window.SG_secretaria.conversar(t)).catch(() => falha).then(r => {
        setTimeout(() => { const d = $('secDig'); d && d.remove(); mostrarConversa('', r || falha); }, Math.max(0, 350 - (Date.now() - t0)));
      });
      return;
    }
    const feitos = secretariaCore(t);
    if(!feitos.length){ toast('Não entendi. Diga o que é, quando e com quem.'); return; }
    $('secTxt').value = '';
    $('secRes').insertAdjacentHTML('beforeend', feitos.map(it => `<div class="r" data-sec="${it.id}"><div><div class="t">${esc(it.titulo)}</div>
      <div class="mut">${esc(TIPO_CURTO[it.tipo] || it.tipo)} · ${it.data ? esc(fmtData(it.data, true)) : 'sem data'}${it.hora ? ' · ' + esc(it.hora) : ''}${it.pessoa ? ' · ' + esc(it.pessoa) : ''}</div></div>
      <div class="bts"><button type="button" data-sec-abrir="${it.id}">Abrir</button><button type="button" data-sec-desfazer="${it.id}">Desfazer</button></div></div>`).join(''));
    toast(feitos.length === 1 ? 'Coloquei na sua agenda: ' + feitos[0].titulo + '.' : 'Coloquei ' + feitos.length + ' itens na sua agenda.');
  }
  $('secOk').onclick = executarSecretaria;
  $('secTxt').addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); executarSecretaria(); } });
  function ajustarSec(){ const t = $('secTxt'); t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px'; }
  $('secTxt').addEventListener('input', ajustarSec);
  $('secAbrir').onclick = () => { $('sec').hidden = !$('sec').hidden; if(!$('sec').hidden){ saudar(); rolarFim(); $('secTxt').focus(); } };
  $('secFechar').onclick = () => { if(ouvindo){ executarAoParar = null; rec && rec.stop(); } $('sec').hidden = true; };
  $('secRes').addEventListener('click', e => {
    const op = e.target.closest('[data-sec-op]');
    if(op && window.SG_secretaria && SG_secretaria.executar){ const a = SEC_OPS[op.dataset.secOp]; op.parentElement.querySelectorAll('button').forEach(b => b.disabled = true); op.style.borderColor = 'var(--pink)';
      balaoEu(op.textContent); $('secRes').insertAdjacentHTML('beforeend', '<div class="sec-digitando" id="secDig">digitando…</div>'); rolarFim();
      Promise.resolve().then(() => SG_secretaria.executar(a)).catch(() => ({ texto:'Não consegui fazer isso agora.' })).then(r => { const d = $('secDig'); d && d.remove(); mostrarConversa('', r); }); return; }
    const df = e.target.closest('[data-sec-desf]');
    if(df && window.SG_secretaria && SG_secretaria.desfazerCard){ SG_secretaria.desfazerCard(SEC_OPS[df.dataset.secDesf]); df.remove(); toast('Desfeito.'); return; }
    const d = e.target.closest('[data-sec-desfazer]');
    if(d){ DB.itens = DB.itens.filter(i => i.id !== d.dataset.secDesfazer); salvar(); render(); d.closest('.r').remove(); toast('Desfeito.'); return; }
    const a = e.target.closest('[data-sec-abrir]');
    if(a){ const it = DB.itens.find(i => i.id === a.dataset.secAbrir); if(!it){ toast('Esse item não está mais na agenda.'); return; } if(ehReuniao(it)) abrirReuniao(it); else verItem(it); }
  });

  /* ---------- Realizada = tem anotações; depois disso data e horário ficam travados ---------- */
  function realizada(r){ return !!r && (!!String(r.anotacoes || '').trim() || !!r.resumo); }
  const cssV = document.createElement('style');
  cssV.textContent = `
    .reu-quando input:disabled,#fItem input:disabled{opacity:.55;cursor:not-allowed}
    .reu-quando .chip:disabled,.adiar .chip:disabled{opacity:.35;cursor:not-allowed}
    .trava-info{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--pink)}
    .enc.sem-nota i{color:#c2187a}
  `;
  document.head.appendChild(cssV);
  document.querySelector('#dlgReuniao .reu-quando').insertAdjacentHTML('beforeend', '<span class="trava-info" id="rqTrava" hidden>Realizada · data e horário travados</span>');
  function travarQuando(){
    const t = realizada(R);
    $('rqData').disabled = t; $('rqHora').disabled = t;
    document.querySelectorAll('#dlgReuniao [data-rq-adiar]').forEach(b => b.disabled = t);
    $('rqTrava').hidden = !t;
  }
  const preencherQuandoBase = preencherQuando;
  preencherQuando = function(){ preencherQuandoBase(); travarQuando(); };
  const aplicarQuandoBase = aplicarQuando;
  aplicarQuando = function(){ if(realizada(R)){ preencherQuandoBase(); travarQuando(); return; } aplicarQuandoBase(); };
  let tLinha = null;
  $('rqNotas').addEventListener('input', () => { travarQuando(); clearTimeout(tLinha); tLinha = setTimeout(desenharLinha, 400); });
  // "Mais detalhes": reunião realizada também não muda data e horário
  const abrirItemBase = abrirItem;
  abrirItem = function(it, padrao){
    abrirItemBase(it, padrao);
    const t = !!it && ehReuniao(it) && realizada(it);
    $('iData').disabled = t; $('iHora').disabled = t;
    document.querySelectorAll('#fItem [data-adiar]').forEach(b => b.disabled = t);
  };

  render();

  /* ---------- anexos pelo aplicativo do celular ---------- */
  window.SG_anexos = {
    async guardar(file){ const id = uid(); await guardarArq(id, file); return id; },
    ler: (file, progresso) => extrairTexto(file, file.name || '', progresso).then(t => /\.pdf$/i.test(file.name || '') ? refluir(t || '') : (t || '')),
    reunioes: () => reunioesRecentes().filter(r => !r.feito).slice(0, 4).map(r => ({ id:r.id, rotulo:rotuloReuniao(r) })),
    previa: t => { const linhas = String(t || '').split(/\n|(?<=[.!?;])\s+/).map(limparPedido).filter(l => l.length > 2); return organizar(linhas.join('\n')).filter(p => p.incluir !== false && p.titulo.trim()).map(p => ({ titulo:p.titulo.trim(), tipo:p.tipo, data:p.data, hora:p.hora })); },
    async levar(reuniaoId, texto, anexos){
      const it = DB.itens.find(i => i.id === reuniaoId); if(!it) return null;
      await levarParaReuniao(it, '', anexos.map(a => ({ nome:a.nome, tipo:a.tipo, tamanho:a.tamanho, texto:a.texto, blobId:a.id })));
      DB.entradas.push({ id:uid(), em:new Date().toISOString(), texto:texto || anexos.map(a => a.nome).join(', '), gerados:0, reuniao:it.id, anexosNomes:anexos.map(a => a.nome), via:'secretaria' });
      salvar(); render(); return it.titulo;
    },
    criar(texto, anexos){
      const feitos = secretariaCore(texto);
      const ent = feitos.length && DB.entradas.find(e => e.id === feitos[0].entrada);
      if(ent && anexos.length){ ent.anexos = anexos.map(a => ({ id:a.id, nome:a.nome })); ent.anexosNomes = anexos.map(a => a.nome); salvar(); render(); }
      return feitos.map(it => Object.assign({}, it));
    },
    guardarSo(texto, anexos){
      DB.entradas.push({ id:uid(), em:new Date().toISOString(), texto:texto || '', gerados:0, anexos:anexos.map(a => ({ id:a.id, nome:a.nome })), anexosNomes:anexos.map(a => a.nome), via:'secretaria' });
      salvar(); render(); return true;
    },
    abrirReuniao: id => { const it = DB.itens.find(i => i.id === id); if(!it) return false; abrirReuniao(it); return true; },
    abrirArquivo: async id => { const b = await lerArq(id); if(!b) return null; return URL.createObjectURL(b); }
  };

  /* ---------- X para só fechar (consulta), em todas as janelas ---------- */
  const cssX = document.createElement('style');
  cssX.textContent = `
    dialog{position:relative}
    .dlg-x{position:sticky;top:12px;float:right;margin:12px 14px -50px 0;z-index:6;width:38px;height:38px;border-radius:50%;background:#fff;border:1px solid #f2d3e6;color:var(--g2);font-size:22px;line-height:1;display:grid;place-items:center;box-shadow:0 6px 16px -10px rgba(255,62,165,.6)}
    .dlg-x:hover{border-color:var(--pink);color:var(--fg)}
    .dlg-x:focus{outline:none}
  `;
  document.head.appendChild(cssX);
  function poeX(dlg){
    if(!dlg || dlg.querySelector(':scope > .dlg-x')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dlg-x'; b.title = 'Fechar'; b.autofocus = true; b.setAttribute('aria-label', 'Fechar'); b.textContent = '×';
    b.onclick = () => { if(dlg.id === 'dlgReuniao' && $('rqFechar')) $('rqFechar').click(); else { dlg.close(); try{ render(); }catch(_){} } };
    dlg.prepend(b);
  }
  document.querySelectorAll('dialog').forEach(poeX);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeName === 'DIALOG') poeX(n); else if(n.querySelectorAll) n.querySelectorAll('dialog').forEach(poeX); }))).observe(document.body, { childList:true, subtree:true });

  /* ---------- Busca: digite um assunto e encontre a reunião, tarefa, anotação ou texto ---------- */
  const cssB = document.createElement('style');
  cssB.textContent = `
    .busca{position:relative;margin:0 0 16px}
    .busca .cx{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #f2d3e6;border-radius:999px;padding:4px 8px 4px 16px;box-shadow:0 10px 26px -18px rgba(255,62,165,.55)}
    .busca .cx:focus-within{border-color:var(--rosa);box-shadow:0 0 0 3px var(--rosa-claro)}
    .busca .cx svg{width:18px;height:18px;color:var(--pink);flex:none}
    .busca input{border:0;box-shadow:none!important;padding:10px 0;background:transparent;font-size:14px}
    .busca .limpar{font-size:20px;color:var(--g3);padding:0 8px}
    .busca-res{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:35;background:#fff;border:1px solid #f4dcea;border-radius:18px;box-shadow:0 30px 70px -24px rgba(255,62,165,.45);max-height:min(70vh,560px);overflow:auto;padding:8px}
    .busca-res .r{display:block;width:100%;text-align:left;border-radius:12px;padding:10px 12px;border:1px solid transparent}
    .busca-res .r:hover,.busca-res .r:focus{background:var(--rosa-bg);border-color:#f7d3e9;outline:none}
    .busca-res .t{font-size:14px;line-height:1.35}
    .busca-res .m{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g2);margin-top:3px}
    .busca-res .m b{font-weight:400;color:var(--pink)}
    .busca-res .s{font-size:12px;color:var(--g1);line-height:1.5;margin-top:4px}
    .busca-res mark{background:#ffe3f3;color:inherit;border-radius:3px;padding:0 1px}
    .busca-res .vz{padding:14px;font-size:13px;color:var(--g2)}
    .nota.achada{animation:achada 2.2s ease-out 1;border-color:var(--pink)!important}
    @keyframes achada{0%,40%{box-shadow:0 0 0 4px var(--rosa-claro)}100%{box-shadow:none}}
  `;
  document.head.appendChild(cssB);
  document.querySelector('nav.abas').insertAdjacentHTML('beforebegin', `<div class="busca" id="busca">
    <div class="cx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
    <input id="buscaTxt" type="text" placeholder="Buscar um assunto, uma pessoa ou uma palavra…" autocomplete="off" enterkeyhint="search" aria-label="Buscar na agenda">
    <button type="button" class="limpar" id="buscaLimpar" aria-label="Limpar busca" hidden>×</button></div>
    <div class="busca-res" id="buscaRes" hidden></div></div>`);
  const PARADAS = new Set('a o e de da do das dos em no na nos nas um uma uns umas que quando como onde qual quais para pra pro com sem por pelo pela ao aos as os se foi era ser ter tem the mais menos sobre isso essa esse esta este aquele aquela nos eu voce ja muito pouco'.split(' '));
  const SINONIMOS = [
    ['processo','sistema','fluxo','forma','regra','politica','procedimento','pop','metodo'],
    ['novo','nova','novos','novas','mudanca','mudamos','mudou','mudar','alteracao','alteramos','atualizacao','implantacao','implantar','automatica','automatico'],
    ['troca','trocas','devolucao','devolucoes','reembolso','estorno','saintrocas'],
    ['reclamacao','reclamacoes','reclame','ra'],
    ['rastreio','rastreamento','entrega','transportadora','frete'],
    ['reuniao','alinhamento','encontro','call']
  ];
  const raiz = w => w.length <= 4 ? w : w.slice(0, Math.max(4, w.length - 3));
  const palavras = t => norm(t).replace(/[^a-z0-9]+/g, ' ').split(' ').filter(w => w.length >= 2 && !PARADAS.has(w));
  function trechos(it){
    const out = [];
    const add = (rot, txt, extra) => { String(txt || '').split(/\n+/).map(x => x.trim()).filter(Boolean).forEach(l => out.push(Object.assign({ rot, txt:l }, extra || {}))); };
    add('Título', it.titulo); add('Pessoa', it.pessoa); add('Notas', it.notas);
    (it.sub || []).forEach(x => add('Subtarefa', x.t));
    (it.pauta || []).forEach(x => add('Pauta', x.t));
    add('Anotações', it.anotacoes, { campo:'anotacoes' }); add('Resumo', typeof it.resumo === 'string' ? it.resumo : '');
    (it.anexos || []).forEach(a => { add('Anexo', a.nome); add('Anexo · ' + a.nome, a.texto); });
    return out;
  }
  function buscar(q){
    const qs = [...new Set(palavras(q))]; if(!qs.length) return [];
    // cada palavra procurada vale também pelos seus parecidos (processo ≈ sistema/fluxo, novo ≈ mudança…)
    const alts = qs.map(w => { const g = SINONIMOS.find(g => g.some(x => raiz(x) === raiz(w) || w.startsWith(raiz(x)))); return [...new Set((g || []).concat(w).map(raiz))]; });
    const ws = [...new Set(alts.flat())];
    const precisa = qs.length <= 2 ? qs.length : Math.ceil(qs.length / 3);
    const bate = (r, p) => p.startsWith(r) || (r.length >= 5 && p.length >= 4 && r.startsWith(p));
    const casa = t => { const ps = palavras(t); return alts.map((a, i) => a.some(r => ps.some(p => bate(r, p))) ? i : -1).filter(i => i >= 0); };
    const res = [];
    const avaliar = (fonte, partes, base) => {
      const todos = new Set(); let melhor = null, mq = 0;
      partes.forEach(pt => { const c = casa(pt.txt); c.forEach(x => todos.add(x)); const sc = c.length + (pt.rot === 'Título' ? .5 : 0); if(sc > mq){ mq = sc; melhor = pt; } });
      if(todos.size < precisa || !melhor) return;
      res.push(Object.assign({ score: todos.size * 3 + mq, trecho: melhor }, base, { fonte }));
    };
    DB.itens.forEach(it => avaliar('item', trechos(it), { it, data: it.data || (it.criadoEm || '').slice(0, 10) }));
    DB.entradas.forEach(e => avaliar('entrada', String(e.texto || '').split(/\n+/).map(x => ({ rot:'Caixa de entrada', txt:x.trim() })).filter(x => x.txt).concat((e.anexosNomes || []).map(n => ({ rot:'Anexo', txt:n }))), { e, data: (e.em || '').slice(0, 10) }));
    return res.sort((a, b) => b.score - a.score || String(b.data).localeCompare(String(a.data))).slice(0, 30).map(r => Object.assign(r, { ws }));
  }
  function marcar(txt, ws){
    let t = String(txt); if(t.length > 220){ const n = norm(t), i = Math.max(0, Math.min(...ws.map(w => { const k = n.indexOf(w); return k < 0 ? 1e9 : k; })) - 60); t = (i > 0 ? '…' : '') + t.slice(i, i + 220) + '…'; }
    return esc(t).replace(/[A-Za-zÀ-ÿ0-9]+/g, w => ws.some(r => norm(w).startsWith(r)) ? '<mark>' + w + '</mark>' : w);
  }
  let ACHADOS = [];
  function desenharBusca(){
    const q = $('buscaTxt').value.trim(); $('buscaLimpar').hidden = !q;
    if(q.length < 2){ $('buscaRes').hidden = true; return; }
    ACHADOS = buscar(q);
    $('buscaRes').hidden = false;
    $('buscaRes').innerHTML = ACHADOS.length ? ACHADOS.map((r, i) => {
      const tit = r.fonte === 'item' ? r.it.titulo : 'Texto da Caixa de entrada';
      const tipo = r.fonte === 'item' ? (TIPO_CURTO[r.it.tipo] || r.it.tipo) : 'Caixa de entrada';
      const quando = r.data ? fmtData(r.data, true) : 'sem data';
      return `<button type="button" class="r" data-achado="${i}"><div class="t">${marcar(tit, r.ws)}</div><div class="m"><b>${esc(tipo)}</b> · ${esc(quando)}${r.fonte === 'item' && r.it.hora ? ' · ' + esc(r.it.hora) : ''} · encontrado em ${esc(r.trecho.rot)}</div>${r.trecho.rot !== 'Título' ? `<div class="s">${marcar(r.trecho.txt, r.ws)}</div>` : ''}</button>`;
    }).join('') : `<div class="vz">Nada encontrado para “${esc(q)}”. Tente outra palavra parecida.</div>`;
  }
  function abrirAchado(r){
    $('buscaRes').hidden = true;
    if(r.fonte === 'entrada'){
      const ab = document.querySelector('nav.abas [data-aba="entrada"]'); if(ab) ab.click();
      setTimeout(() => { const bt = document.querySelector(`[data-reorg="${r.e.id}"]`); const nota = bt && bt.closest('.nota'); if(nota){ nota.scrollIntoView({ behavior:'smooth', block:'center' }); nota.classList.remove('achada'); void nota.offsetWidth; nota.classList.add('achada'); } }, 80);
      return;
    }
    const it = DB.itens.find(i => i.id === r.it.id); if(!it) return;
    if(ehReuniao(it)){
      abrirReuniao(it);
      setTimeout(() => {
        if(r.trecho.campo === 'anotacoes'){ const ta = $('rqNotas'), k = ta.value.indexOf(r.trecho.txt); if(k >= 0){ ta.focus(); ta.setSelectionRange(k, k + r.trecho.txt.length); const linhas = ta.value.slice(0, k).split('\n').length; ta.scrollTop = Math.max(0, (linhas - 3) * 22); ta.scrollIntoView({ block:'nearest' }); } }
        else if(r.trecho.rot === 'Pauta'){ const alvo = [...document.querySelectorAll('#dlgReuniao input, #dlgReuniao textarea')].find(x => x.value === r.trecho.txt); if(alvo){ alvo.scrollIntoView({ block:'center' }); alvo.style.boxShadow = '0 0 0 3px #ffe3f3'; setTimeout(() => alvo.style.boxShadow = '', 2500); } }
      }, 120);
    } else verItem(it);
  }
  let tBusca = null;
  $('buscaTxt').addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(desenharBusca, 160); });
  $('buscaTxt').addEventListener('focus', () => { if($('buscaTxt').value.trim().length >= 2) desenharBusca(); });
  $('buscaTxt').addEventListener('keydown', e => {
    if(e.key === 'Escape'){ $('buscaTxt').value = ''; desenharBusca(); }
    if(e.key === 'Enter' && ACHADOS[0]){ e.preventDefault(); abrirAchado(ACHADOS[0]); }
    if(e.key === 'ArrowDown'){ const b = $('buscaRes').querySelector('.r'); if(b){ e.preventDefault(); b.focus(); } }
  });
  $('buscaRes').addEventListener('click', e => { const b = e.target.closest('[data-achado]'); if(b) abrirAchado(ACHADOS[+b.dataset.achado]); });
  $('buscaLimpar').onclick = () => { $('buscaTxt').value = ''; desenharBusca(); $('buscaTxt').focus(); };
  document.addEventListener('click', e => { if(!e.target.closest('#busca')) $('buscaRes').hidden = true; });
  // a Secretária do celular também busca
  if(window.SG_secretaria) window.SG_secretaria.buscar = q => buscar(q).map(r => ({ fonte:r.fonte, id: r.fonte === 'item' ? r.it.id : r.e.id, titulo: r.fonte === 'item' ? r.it.titulo : 'Caixa de entrada', onde: r.trecho.rot, trecho: r.trecho.txt }));

  /* ---------- Avisos da Secretária: atrasados, vencendo em 3h, reunião em 1h ---------- */
  const AV_TAREFA = { tarefa:1, plano:1, projeto:1 }, AV_EVENTO = { reuniao:1, alinhamento:1, compromisso:1 };
  const minDe = h => { const [a, b] = String(h || '').split(':').map(Number); return a * 60 + (b || 0); };
  function avisosAgora(){
    const d = new Date(), dia = iso(d), m = d.getHours() * 60 + d.getMinutes();
    const atrasadas = [], vencem = [], eventos = [];
    DB.itens.forEach(i => {
      if(!i || i.feito || !i.data) return;
      if(AV_TAREFA[i.tipo]){
        if(i.data < dia || (i.data === dia && i.hora && m > minDe(i.hora))) atrasadas.push(i);
        else if(i.data === dia && i.hora){ const f = minDe(i.hora) - m; if(f > 0 && f <= 180) vencem.push(i); }
      } else if(AV_EVENTO[i.tipo] && i.data === dia && i.hora){ const f = minDe(i.hora) - m; if(f > 0 && f <= 60) eventos.push(Object.assign({ falta:f }, i)); }
    });
    const dir = (a, b) => (b.prioridade === 'diretoria') - (a.prioridade === 'diretoria');
    return { atrasadas: atrasadas.sort(dir), vencem: vencem.sort(dir), eventos, dia, m };
  }
  const apelido = () => { const n = String(EU && EU.nome || '').trim().split(/\s+/)[0] || ''; return /^karine$/i.test(n) ? 'Kah' : (n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ''); };
  function avisoTexto(L){
    const curto = t => { t = String(t || '').trim(); return t.length > 48 ? t.slice(0, 46) + '…' : t; };
    const lista = (arr, fn) => { const n = arr.slice(0, 3).map(fn); if(arr.length > 3) n.push('mais ' + (arr.length - 3)); return n.length > 1 ? n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1] : n[0]; };
    const p = [];
    if(L.atrasadas.length) p.push('você tem ' + (L.atrasadas.length === 1 ? '1 item atrasado: ' : L.atrasadas.length + ' itens atrasados: ') + lista(L.atrasadas, i => curto(i.titulo)) + '.');
    if(L.vencem.length) p.push((L.vencem.length === 1 ? 'Vence em até 3h: ' : 'Vencem em até 3h: ') + lista(L.vencem, i => curto(i.titulo) + ' (' + i.hora + ')') + '.');
    L.eventos.forEach(i => p.push(curto(i.titulo) + ' começa às ' + i.hora + ', daqui a ' + (i.falta >= 55 ? '1h' : i.falta + ' min') + '.'));
    if(!p.length) return '';
    const t = p.join(' '), n = apelido();
    return n ? n + ', ' + t.replace(/^Vence/, 'vence') : t.charAt(0).toUpperCase() + t.slice(1);
  }
  // o que ainda não foi avisado hoje (para não repetir)
  function avisosNovos(L){
    const k = CHAVE + ':avisados'; let f = {}; try{ f = JSON.parse(localStorage.getItem(k) || '{}'); }catch(_){}
    Object.keys(f).forEach(x => { if(f[x] !== L.dia) delete f[x]; });
    let novo = false;
    L.atrasadas.forEach(i => { if(!f['a:' + i.id]){ f['a:' + i.id] = L.dia; novo = true; } });
    L.vencem.forEach(i => { if(!f['v:' + i.id]){ f['v:' + i.id] = L.dia; novo = true; } });
    L.eventos.forEach(i => { if(!f['e:' + i.id]){ f['e:' + i.id] = L.dia; novo = true; } });
    try{ localStorage.setItem(k, JSON.stringify(f)); }catch(_){}
    return novo;
  }
  window.SG_secretaria && (window.SG_secretaria.avisos = () => { const L = avisosAgora(); return { texto: avisoTexto(L), atrasadas: L.atrasadas.map(i => i.id), vencem: L.vencem.map(i => i.id), eventos: L.eventos.map(i => i.id) }; });

  const APP = /[?&]app=1/.test(location.search);
  if(!APP){
    const cssAv = document.createElement('style');
    cssAv.textContent = `
      .aviso-sec{position:fixed;top:18px;right:18px;z-index:60;width:min(380px,calc(100vw - 28px));background:#fff;border:1px solid #f2d3e6;border-radius:20px;box-shadow:0 30px 70px -24px rgba(255,62,165,.55);padding:16px 16px 14px;display:grid;gap:10px;animation:avIn .35s ease-out}
      @keyframes avIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
      .aviso-sec .cab{display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--g2)}
      .aviso-sec .cab .laco{width:26px;height:20px}
      .aviso-sec .cab button{margin-left:auto;font-size:20px;color:var(--g2);padding:0 4px}
      .aviso-sec p{margin:0;font-size:14px;line-height:1.5}
      .aviso-sec .bts{display:flex;gap:8px;justify-content:flex-end}
      .sino{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;border:1px solid #f2d3e6;border-radius:999px;padding:9px 14px;background:#fff;color:var(--g1)}
      .sino svg{width:15px;height:15px;color:var(--pink)}
    `;
    document.head.appendChild(cssAv);
    const btnNovo = $('btnNovo');
    if(btnNovo && 'Notification' in window && Notification.permission !== 'granted'){
      btnNovo.insertAdjacentHTML('beforebegin', '<button type="button" class="sino" id="avSino" title="Receber avisos neste computador"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>Ativar avisos</button>');
      $('avSino').onclick = async () => { try{ const r = await Notification.requestPermission(); if(r === 'granted'){ $('avSino').remove(); toast('Avisos ligados neste computador.'); verificarAvisos(true); } else toast('O navegador não liberou os avisos.'); }catch(_){} };
    }
    function mostrarAviso(texto){
      document.querySelectorAll('.aviso-sec').forEach(x => x.remove());
      document.body.insertAdjacentHTML('beforeend', `<div class="aviso-sec" role="alert"><div class="cab">${LACO}Secretária<button type="button" aria-label="Fechar">×</button></div><p>${esc(texto)}</p><div class="bts"><button class="btn ghost min" data-av="ver">Ver tarefas</button><button class="btn min" data-av="ok">Ok</button></div></div>`);
      const el = document.querySelector('.aviso-sec');
      el.addEventListener('click', e => {
        if(e.target.closest('[data-av="ver"]')){ const ab = document.querySelector('nav.abas [data-aba="lista"]'); if(ab) ab.click(); el.remove(); }
        else if(e.target.closest('button')) el.remove();
      });
      try{ if('Notification' in window && Notification.permission === 'granted' && document.visibilityState !== 'visible'){ const n = new Notification('Secretária', { body: texto, icon: '../secretaria/icone-192.png', tag: 'secretaria' }); n.onclick = () => { window.focus(); n.close(); }; } }catch(_){}
    }
    function verificarAvisos(forcar){
      const h = new Date().getHours(); if(h >= 22 || h < 7) return;
      const L = avisosAgora();
      if(!avisosNovos(L) && !forcar) return;
      const t = avisoTexto(L); if(t) mostrarAviso(t);
    }
    setTimeout(() => verificarAvisos(false), 2500);
    setInterval(() => verificarAvisos(false), 60000);
  }

  /* ---------- Ver item: abre para ler; "Editar" só quando precisar ---------- */
  const cssVer = document.createElement('style');
  cssVer.textContent = `
    #dlgVer .dlg{gap:16px}
    #dlgVer .ver-top{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding-right:44px}
    #dlgVer h3{font-weight:400;font-size:22px;line-height:1.3;margin:0;padding-right:44px;letter-spacing:.01em}
    #dlgVer .ver-meta{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:14px;line-height:1.45}
    #dlgVer .ver-meta dt{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--g2);padding-top:3px}
    #dlgVer .ver-meta dd{margin:0}
    #dlgVer .ver-meta dd.at{color:var(--neon)} #dlgVer .ver-meta dd.hj{color:var(--pink)}
    #dlgVer .ver-notas{white-space:pre-wrap;font-size:14px;line-height:1.6;background:var(--rosa-bg);border:1px solid #f7d3e9;border-radius:14px;padding:12px 14px}
    #dlgVer .ver-sub{display:grid;gap:6px}
    #dlgVer .ver-sub label{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.4;cursor:pointer}
    #dlgVer .ver-sub input{width:18px;height:18px;margin-top:1px;accent-color:var(--pink);flex:none}
    #dlgVer .ver-sub .ok{color:var(--g3);text-decoration:line-through}
    #dlgVer .k2{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--g2)}
    #dlgVer .ver-acoes{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
  `;
  document.head.appendChild(cssVer);
  document.body.insertAdjacentHTML('beforeend', '<dialog id="dlgVer"><div class="dlg" id="verCorpo"></div></dialog>');
  let VER = null;
  function verItem(it){
    VER = it; window.SG_verAtual = it; const st = status(it);
    const quando = it.data ? fmtData(it.data, true) + (it.hora ? ' · ' + it.hora : '') : 'Sem data';
    const stTxt = it.feito ? 'Concluído' : st === 'atrasada' ? 'Atrasado' : st === 'hoje' ? 'Hoje' : st === 'passou' ? 'Já passou' : '';
    const prio = { diretoria:'Solicitação da diretoria', alta:'Alta', media:'Média', baixa:'Baixa' }[it.prioridade] || '';
    const pai = it.paiId && DB.itens.find(i => i.id === it.paiId);
    const reu = it.origem && DB.itens.find(i => i.id === it.origem);
    const sub = it.sub || [];
    $('verCorpo').innerHTML = `
      <div class="ver-top"><span class="tipo ${esc(it.tipo)}">${esc(TIPO_CURTO[it.tipo] || it.tipo)}</span>${it.prioridade === 'diretoria' ? '<span class="tag-dir">Diretoria</span>' : ''}</div>
      <h3>${esc(it.titulo)}</h3>
      <dl class="ver-meta">
        <dt>Quando</dt><dd>${esc(quando)}</dd>
        ${stTxt ? `<dt>Situação</dt><dd class="${st === 'atrasada' && !it.feito ? 'at' : st === 'hoje' && !it.feito ? 'hj' : ''}">${esc(stTxt)}</dd>` : ''}
        ${it.pessoa ? `<dt>Pessoa</dt><dd>${esc(it.pessoa)}</dd>` : ''}
        ${prio && it.prioridade !== 'diretoria' ? `<dt>Prioridade</dt><dd>${esc(prio)}</dd>` : ''}
        ${pai ? `<dt>Objetivo</dt><dd>${esc(pai.titulo)}</dd>` : ''}
        ${reu ? `<dt>Reunião</dt><dd><button type="button" class="btn ghost min" data-ver-reu="${esc(reu.id)}">${esc(reu.titulo)}</button></dd>` : ''}
      </dl>
      ${it.notas ? `<div><div class="k2" style="margin-bottom:6px">Notas</div><div class="ver-notas">${esc(it.notas)}</div></div>` : ''}
      ${sub.length ? `<div><div class="k2" style="margin-bottom:8px">Etapas · ${sub.filter(x => x.ok).length} de ${sub.length}</div><div class="ver-sub">${sub.map((x, i) => `<label><input type="checkbox" data-ver-sub="${i}" ${x.ok ? 'checked' : ''}><span class="${x.ok ? 'ok' : ''}">${esc(x.t)}</span></label>`).join('')}</div></div>` : ''}
      <div class="ver-acoes"><button type="button" class="btn ghost" data-ver="editar">Editar</button><button type="button" class="btn" data-ver="feito">${it.feito ? 'Reabrir' : 'Concluir'}</button></div>`;
    poeX($('dlgVer'));
    if(!$('dlgVer').open) $('dlgVer').showModal();
    try{ $('dlgVer').querySelector('.dlg-x').focus({ preventScroll:true }); }catch(_){}
    $('dlgVer').scrollTop = 0;
  }
  $('dlgVer').addEventListener('click', e => {
    if(!VER) return;
    const b = e.target.closest('[data-ver]');
    if(b && b.dataset.ver === 'editar'){ const it = VER; $('dlgVer').close(); abrirItem(it); return; }
    if(b && b.dataset.ver === 'feito'){ concluir(VER); $('dlgVer').close(); render(); return; }
    const r = e.target.closest('[data-ver-reu]');
    if(r){ const it = DB.itens.find(i => i.id === r.dataset.verReu); $('dlgVer').close(); if(it) abrirReuniao(it); }
  });
  $('dlgVer').addEventListener('change', e => {
    const c = e.target.closest('[data-ver-sub]'); if(!c || !VER) return;
    const x = (VER.sub || [])[+c.dataset.verSub]; if(!x) return;
    x.ok = c.checked; salvar(); render(); verItem(VER);
  });
  window.SG_verItem = id => { const it = DB.itens.find(i => i.id === id); if(it){ if(ehReuniao(it)) abrirReuniao(it); else verItem(it); } };

  /* ---------- dentro do aplicativo do celular ---------- */
  if(/[?&]app=1/.test(location.search)){
    document.documentElement.classList.add('modo-app');
    const cssApp = document.createElement('style');
    cssApp.textContent = `.modo-app .sec-fab,.modo-app .sec{display:none!important}.modo-app .sync-selo{display:none!important}`;
    document.head.appendChild(cssApp);
  }
})();
