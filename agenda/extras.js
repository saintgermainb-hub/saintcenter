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

  render();
})();
