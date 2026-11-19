/* Agenda Coordenação · Datas
   1) Feriados e datas comemorativas do calendário, com uma reflexão do dia.
   2) Minhas datas comemorativas (você cria).
   3) Comemoração do time: 3 meses, 1 ano, 2 anos… de cada colaborador (separado do calendário).
      As datas de entrada podem ser cadastradas aqui ou vir do módulo Acessos, quando ele tiver a data de entrada.
   4) Frases de mulheres inspiradoras misturadas com os versículos. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;
  const p2 = n => String(n).padStart(2, '0');
  const isoD = d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
  const dmy = s => s ? s.slice(8,10) + '/' + s.slice(5,7) + '/' + s.slice(0,4) : '';
  const dm = s => s ? s.slice(8,10) + '/' + s.slice(5,7) : '';
  const MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

  /* ---------- calendário: feriados nacionais e datas comemorativas ---------- */
  const FIXAS = [
    ['01-01','feriado','Confraternização Universal','Primeiro dia do ano: tempo de recomeço, de fechar ciclos e abrir espaço para o que vem. Um bom dia para definir as metas do time.'],
    ['03-08','comemorativa','Dia Internacional da Mulher','Nasceu das lutas de mulheres trabalhadoras por direitos e condições dignas no começo do século XX e foi reconhecido pela ONU em 1975. É memória e é compromisso com a igualdade.'],
    ['03-15','comemorativa','Dia do Consumidor','Lembra o discurso de John F. Kennedy, em 1962, que reconheceu os direitos de quem compra. No Brasil, o Código de Defesa do Consumidor é de 1990. Para o Suporte, é dia de lembrar que cada atendimento é um direito sendo respeitado.'],
    ['04-19','comemorativa','Dia dos Povos Indígenas','Data que celebra a diversidade, as culturas e a resistência dos povos originários do Brasil. Desde 2022 a lei usa este nome, que reconhece os povos no plural.'],
    ['04-21','feriado','Tiradentes','Homenageia Joaquim José da Silva Xavier, líder da Inconfidência Mineira, executado em 21 de abril de 1792. Tornou-se símbolo da luta por liberdade e justiça no país.'],
    ['05-01','feriado','Dia do Trabalho','Tem origem nas greves por jornada de oito horas em Chicago, em 1886. No Brasil, a CLT foi assinada em 1º de maio de 1943. Um dia para reconhecer quem faz a operação acontecer todos os dias.'],
    ['06-12','comemorativa','Dia dos Namorados','Data de carinho e de muitas vendas: é um dos picos do varejo de presentes, com reflexo direto no atendimento.'],
    ['09-07','feriado','Independência do Brasil','Em 7 de setembro de 1822, às margens do Ipiranga, Dom Pedro declarou a separação de Portugal. Marca o início do Brasil como nação independente.'],
    ['09-15','comemorativa','Dia do Cliente','Criada no Brasil no começo dos anos 2000 para valorizar quem escolhe a marca. Para o Suporte & CS é a nossa data: encantar, ouvir, acolher e resolver.'],
    ['10-12','feriado','Nossa Senhora Aparecida · Dia das Crianças','Feriado da padroeira do Brasil, cuja imagem foi encontrada por pescadores no rio Paraíba do Sul em 1717. No mesmo dia celebramos as crianças.'],
    ['10-15','comemorativa','Dia do Professor','Homenagem a quem ensina. Na liderança, ensinar também é parte do trabalho: cada treinamento forma o time de amanhã.'],
    ['11-02','feriado','Finados','Dia de memória e saudade, de honrar quem veio antes e deixou sua marca em nós.'],
    ['11-15','feriado','Proclamação da República','Em 15 de novembro de 1889, o Marechal Deodoro da Fonseca proclamou a República, encerrando o Império no Brasil.'],
    ['11-19','comemorativa','Dia da Mulher Empreendedora','Criado em 2014 e celebrado na ONU, reconhece mulheres que constroem negócios, lideram equipes e abrem caminho para outras.'],
    ['11-20','feriado','Dia da Consciência Negra','Lembra a morte de Zumbi dos Palmares, em 20 de novembro de 1695, líder do maior quilombo do período colonial e símbolo da resistência negra. Desde 2024 é feriado nacional. É dia de reflexão sobre a história, o racismo e o compromisso com a igualdade, inclusive dentro das empresas.'],
    ['12-24','comemorativa','Véspera de Natal','Dia de alta demanda no varejo e de muita emoção nos presentes: atenção redobrada aos prazos de entrega.'],
    ['12-25','feriado','Natal','Celebração do nascimento de Jesus. Tempo de gratidão, família e generosidade.'],
    ['12-31','comemorativa','Véspera de Ano Novo','Fechamento do ano: bom momento para agradecer o time e registrar as conquistas.']
  ];
  function pascoa(a){ const b = a % 19, c = Math.floor(a / 100), d = a % 100, e = Math.floor(c / 4), f = c % 4, g = Math.floor((c + 8) / 25), h = Math.floor((c - g + 1) / 3), i = (19 * b + c - e - h + 15) % 30, k = Math.floor(d / 4), l = d % 4, m = (32 + 2 * f + 2 * k - i - l) % 7, n = Math.floor((b + 11 * m + 22 * l) / 451), mes = Math.floor((i + m - 7 * n + 114) / 31), dia = ((i + m - 7 * n + 114) % 31) + 1; return new Date(a, mes - 1, dia); }
  const mais = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const enesimo = (a, mes, dow, n) => { const d = new Date(a, mes, 1); while(d.getDay() !== dow) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; };
  const CACHE = {};
  function doAno(a){
    if(CACHE[a]) return CACHE[a];
    const l = FIXAS.map(([md, tipo, nome, texto]) => ({ data: a + '-' + md, tipo, nome, texto }));
    const P = pascoa(a);
    l.push({ data:isoD(mais(P, -47)), tipo:'facultativo', nome:'Carnaval', texto:'Ponto facultativo nacional. A maior festa popular do Brasil: confira a escala do time e os prazos das transportadoras.' });
    l.push({ data:isoD(mais(P, -46)), tipo:'facultativo', nome:'Quarta-feira de Cinzas', texto:'Ponto facultativo até o meio da tarde. Marca o início da Quaresma.' });
    l.push({ data:isoD(mais(P, -2)), tipo:'feriado', nome:'Sexta-feira Santa', texto:'Feriado nacional que lembra a paixão e a morte de Jesus Cristo. Tempo de silêncio e reflexão.' });
    l.push({ data:isoD(P), tipo:'comemorativa', nome:'Páscoa', texto:'Celebração da ressurreição de Jesus, símbolo de renovação e esperança.' });
    l.push({ data:isoD(mais(P, 60)), tipo:'facultativo', nome:'Corpus Christi', texto:'Ponto facultativo nacional, celebração católica da Eucaristia. Em várias cidades é feriado municipal.' });
    l.push({ data:isoD(enesimo(a, 4, 0, 2)), tipo:'comemorativa', nome:'Dia das Mães', texto:'Uma das datas mais fortes do varejo e do coração. Prepare o time para o volume e para o cuidado extra com os presentes.' });
    l.push({ data:isoD(enesimo(a, 7, 0, 2)), tipo:'comemorativa', nome:'Dia dos Pais', texto:'Data de homenagem e de presentes: relógios e óculos estão entre os mais procurados.' });
    l.push({ data:isoD(mais(enesimo(a, 10, 4, 4), 1)), tipo:'comemorativa', nome:'Black Friday', texto:'O dia seguinte ao Dia de Ação de Graças americano virou a maior data de promoções do ano no Brasil desde o começo da década de 2010. Plano de contingência do Suporte ativado.' });
    return CACHE[a] = l;
  }
  const minhas = () => Array.isArray(DB.datas) ? DB.datas : (DB.datas = []);
  const time = () => Array.isArray(DB.time) ? DB.time : (DB.time = []);
  function datasDe(iso){
    const a = +iso.slice(0, 4), md = iso.slice(5);
    const cal = doAno(a).filter(x => x.data === iso);
    const meu = minhas().filter(x => x.data && (x.anual !== false ? x.data.slice(5) === md : x.data === iso)).map(x => ({ data:iso, tipo:'minha', nome:x.nome, texto:x.texto || '', id:x.id }));
    return cal.concat(meu);
  }

  /* ---------- comemoração do time ---------- */
  function marcos(c, ate){
    // datas de 3 meses, 1 ano, 2 anos… a partir da entrada
    const e = c.entrada; if(!/^\d{4}-\d{2}-\d{2}$/.test(e || '')) return [];
    const [a, m, d] = e.split('-').map(Number), out = [];
    const tres = new Date(a, m - 1 + 3, d); out.push({ data:isoD(tres), rot:'3 meses de casa', anos:0 });
    for(let n = 1; n <= 40; n++){ const x = new Date(a + n, m - 1, d); if(x > ate) break; out.push({ data:isoD(x), rot: n === 1 ? '1 ano de casa' : n + ' anos de casa', anos:n }); }
    return out;
  }
  function comemoracoes(de, ate){
    const out = [];
    time().forEach(c => marcos(c, ate).forEach(mk => { if(mk.data >= de && mk.data <= isoD(ate)) out.push(Object.assign({ c }, mk)); }));
    return out.sort((a, b) => a.data.localeCompare(b.data));
  }

  /* ---------- aparência ---------- */
  const css = document.createElement('style');
  css.textContent = `
    .dt-hoje{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;margin-bottom:14px;padding:16px 20px;border-radius:20px;background:#fff;border:1px solid #efe2e2;box-shadow:0 18px 40px -32px rgba(75,41,13,.35)}
    .dt-hoje .ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#f6ecec;color:#b75675;font-size:20px}
    .dt-hoje.feriado .ic{background:#b75675;color:#fff}
    .dt-hoje .r{font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:#b75675}
    .dt-hoje h3{font-weight:400;font-size:18px;margin:4px 0 6px;color:#4b290d;letter-spacing:.02em}
    .dt-hoje p{margin:0;font-size:13px;line-height:1.6;color:#4a3a33;max-width:900px}
    .dt-hoje .prox{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}
    .dt-chip{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:4px 10px;border:1px solid #efe2e2;background:#fff;color:#6b4a3a}
    .dt-chip.feriado{border-color:#b75675;color:#b75675}
    .dt-chip.minha{border-color:#e0bcbc;background:#f6ecec}
    .tm-alerta{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;margin-bottom:14px;padding:14px 20px;border-radius:20px;background:linear-gradient(135deg,#f6ecec,#fff);border:1px solid #e0bcbc}
    .tm-alerta .ic{font-size:26px}
    .tm-alerta .r{font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:#6b4a3a}
    .tm-alerta .l{font-size:14px;color:#4b290d;line-height:1.55;margin-top:3px}
    .tm-alerta .l b{font-weight:400;color:#b75675}
    .dia .dt-mark{font-size:9px;line-height:1.25;padding:2px 5px;border-radius:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#f6ecec;color:#6b4a3a}
    .dia .dt-mark.feriado{background:#b75675;color:#fff}
    .dia .dt-mark.time{background:#efe2d9;color:#4b290d}
    .dt-grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px;align-items:start}
    .dt-l{display:grid;gap:8px}
    .dt-r{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:start;border:1px solid #efe2e2;border-radius:14px;padding:10px 12px;background:#fff}
    .dt-r .d{font-size:18px;color:#4b290d;line-height:1.1;text-align:center}
    .dt-r .d small{display:block;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#7a6a63}
    .dt-r .t{font-size:14px;color:#1d1410}
    .dt-r .s{font-size:12px;color:#7a6a63;line-height:1.5;margin-top:2px}
    .dt-r.passou{opacity:.5}
    .dt-r.hoje{border-color:#b75675;box-shadow:0 0 0 2px #f6ecec}
    .dt-mes{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#7a6a63;margin:12px 0 2px}
  `;
  document.head.appendChild(css);

  /* ---------- painel: hoje no calendário + comemoração do time ---------- */
  const cxHoje = document.createElement('div'); cxHoje.id = 'dtHoje';
  const cxTime = document.createElement('div'); cxTime.id = 'tmAlerta';
  const ancora = document.getElementById('hdMon') || document.querySelector('#aba-painel .kpis');
  if(ancora){ ancora.before(cxHoje); ancora.before(cxTime); }

  function painel(){
    const h = hojeD(), hi = isoD(h);
    const hoje = datasDe(hi);
    const prox = []; for(let i = 1; i <= 21; i++){ const d = isoD(mais(h, i)); datasDe(d).forEach(x => prox.push(x)); }
    if(hoje.length){
      const f = hoje.find(x => x.tipo === 'feriado') || hoje[0];
      cxHoje.innerHTML = `<div class="dt-hoje ${f.tipo}"><div class="ic">${f.tipo === 'feriado' ? '✦' : f.tipo === 'minha' ? '♡' : '❀'}</div><div>
        <div class="r">Hoje · ${f.tipo === 'feriado' ? 'Feriado nacional' : f.tipo === 'facultativo' ? 'Ponto facultativo' : f.tipo === 'minha' ? 'Minha data' : 'Data comemorativa'}</div>
        <h3>${esc(hoje.map(x => x.nome).join(' · '))}</h3><p>${esc(f.texto)}</p>
        ${prox.length ? `<div class="prox">${prox.slice(0, 4).map(x => `<span class="dt-chip ${x.tipo}">${esc(dm(x.data))} · ${esc(x.nome)}</span>`).join('')}</div>` : ''}</div></div>`;
    } else if(prox.length){
      const x = prox[0];
      cxHoje.innerHTML = `<div class="dt-hoje"><div class="ic">❀</div><div><div class="r">Próximas datas</div>
        <h3>${esc(x.nome)} <span style="font-size:13px;color:#7a6a63">· ${esc(fmtData(x.data, true))}</span></h3><p>${esc(x.texto)}</p>
        <div class="prox">${prox.slice(1, 5).map(y => `<span class="dt-chip ${y.tipo}">${esc(dm(y.data))} · ${esc(y.nome)}</span>`).join('')}</div></div></div>`;
    } else cxHoje.innerHTML = '';
    const cm = comemoracoes(isoD(mais(h, -1)), mais(h, 7));
    cxTime.innerHTML = cm.length ? `<div class="tm-alerta"><div class="ic">🎀</div><div><div class="r">Comemoração do time</div>
      <div class="l">${cm.map(x => `<b>${esc(x.c.nome)}</b> completa ${esc(x.rot)} ${x.data === hi ? '<b>hoje</b>' : esc(fmtData(x.data, true).toLowerCase().replace(/^amanhã$/, 'amanhã'))}${x.c.setor ? ' · ' + esc(x.c.setor) : ''}`).join('<br>')}</div></div></div>` : '';
  }

  /* ---------- calendário: marca feriados, datas e comemorações ---------- */
  function marcarCal(){
    document.querySelectorAll('#cal .dia[data-dia]').forEach(d => {
      if(d.querySelector('.dt-mark')) return;
      const iso = d.dataset.dia, l = datasDe(iso);
      const tm = comemoracoes(iso, new Date(+iso.slice(0,4), +iso.slice(5,7) - 1, +iso.slice(8,10)));
      const html = l.slice(0, 2).map(x => `<div class="dt-mark ${x.tipo}" title="${esc(x.nome)}">${esc(x.nome)}</div>`).join('') +
        tm.slice(0, 2).map(x => `<div class="dt-mark time" title="${esc(x.c.nome + ' · ' + x.rot)}">🎀 ${esc(x.c.nome.split(' ')[0])} · ${esc(x.rot.replace(' de casa', ''))}</div>`).join('');
      if(html){ const n = d.querySelector('.num'); if(n) n.insertAdjacentHTML('afterend', html); }
    });
  }

  /* ---------- aba Datas ---------- */
  const nav = document.querySelector('nav.abas');
  const bAba = document.createElement('button'); bAba.setAttribute('role', 'tab'); bAba.dataset.aba = 'datas'; bAba.setAttribute('aria-selected', 'false'); bAba.textContent = 'Datas & time';
  const refP = nav && nav.querySelector('[data-aba="projetos"]');
  if(refP) refP.after(bAba); else if(nav) nav.appendChild(bAba);
  const sec = document.createElement('section'); sec.id = 'aba-datas'; sec.hidden = true;
  (document.getElementById('aba-projetos') || document.getElementById('aba-objetivos')).after(sec);
  const irAbaAnt = irAba;
  irAba = function(a){ irAbaAnt(a); sec.hidden = a !== 'datas'; };
  bAba.onclick = () => irAba('datas');
  let ANO = new Date().getFullYear();

  function desenharAba(){
    const h = isoD(hojeD()), ateAno = new Date(ANO, 11, 31);
    const cal = doAno(ANO).slice().concat(minhas().map(x => ({ data: x.anual !== false && x.data ? ANO + x.data.slice(4) : x.data, tipo:'minha', nome:x.nome, texto:x.texto || '', id:x.id })).filter(x => x.data && x.data.startsWith(String(ANO))))
      .sort((a, b) => a.data.localeCompare(b.data));
    let mesAnt = '';
    const linhasCal = cal.map(x => { const m = +x.data.slice(5, 7) - 1; const cab = m !== mesAnt ? `<div class="dt-mes">${['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][m]}</div>` : ''; mesAnt = m;
      return cab + `<div class="dt-r ${x.data < h ? 'passou' : x.data === h ? 'hoje' : ''}"><div class="d">${x.data.slice(8,10)}<small>${MES[m]}</small></div><div><div class="t">${esc(x.nome)}</div><div class="s">${esc(x.texto)}</div></div>
        <div>${x.tipo === 'minha' ? `<button class="btn ghost min" data-dt-ed="${esc(x.id)}">Editar</button>` : `<span class="dt-chip ${x.tipo}">${x.tipo === 'feriado' ? 'Feriado' : x.tipo === 'facultativo' ? 'Facultativo' : 'Comemorativa'}</span>`}</div></div>`; }).join('');
    const tl = time().slice().sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'));
    const hoje = hojeD();
    const linhasTime = tl.map(c => {
      const prox = marcos(c, mais(hoje, 3 * 366)).find(mk => mk.data >= h);
      const casa = c.entrada ? (() => { const [a, m, d] = c.entrada.split('-').map(Number); let meses = (hoje.getFullYear() - a) * 12 + (hoje.getMonth() - (m - 1)); if(hoje.getDate() < d) meses--; return meses < 12 ? meses + (meses === 1 ? ' mês' : ' meses') : Math.floor(meses / 12) + (Math.floor(meses / 12) === 1 ? ' ano' : ' anos') + (meses % 12 ? ' e ' + (meses % 12) + (meses % 12 === 1 ? ' mês' : ' meses') : ''); })() : '';
      return `<div class="dt-r"><div class="d">🎀</div><div><div class="t">${esc(c.nome)}${c.setor ? ` <span style="color:#7a6a63;font-size:12px">· ${esc(c.setor)}</span>` : ''}</div>
        <div class="s">Entrou em ${esc(dmy(c.entrada))}${casa ? ' · ' + esc(casa) + ' de casa' : ''}${prox ? ' · próxima: ' + esc(prox.rot) + ' em ' + esc(dmy(prox.data)) : ''}${c.origem === 'acessos' ? ' · do Acessos' : ''}</div></div>
        <div><button class="btn ghost min" data-tm-ed="${esc(c.id)}">Editar</button></div></div>`;
    }).join('');
    sec.innerHTML = `<div class="dt-grade">
      <div class="card"><div class="cab"><h2>Comemoração do time</h2><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn min" data-dt="novoTime">+ Colaborador</button></div></div>
        <p class="mut" style="margin:0 0 12px;font-size:12px;line-height:1.5">Aviso automático aos 3 meses, 1 ano, 2 anos e assim por diante. Aparece no painel uma semana antes e no calendário.</p>
        <div class="dt-l">${linhasTime || '<div class="vazio">Cadastre a data de entrada de cada colaborador. Quando o Acessos tiver a data de entrada, ela aparece aqui sozinha.</div>'}</div></div>
      <div class="card"><div class="cab"><h2>Calendário ${ANO}</h2><div style="display:flex;gap:6px"><button class="btn ghost min" data-dt="ant">‹</button><button class="btn ghost min" data-dt="prox">›</button><button class="btn min" data-dt="novaData">+ Minha data</button></div></div>
        <p class="mut" style="margin:0 0 4px;font-size:12px">Feriados nacionais, datas comemorativas e as suas datas.</p>
        <div class="dt-l">${linhasCal}</div></div></div>`;
  }
  sec.addEventListener('click', e => {
    const b = e.target.closest('[data-dt]');
    if(b){ const q = b.dataset.dt; if(q === 'ant'){ ANO--; desenharAba(); } if(q === 'prox'){ ANO++; desenharAba(); } if(q === 'novaData') abrirData(null); if(q === 'novoTime') abrirTime(null); if(q === 'acessos') puxarAcessos(true); return; }
    const ed = e.target.closest('[data-dt-ed]'); if(ed){ abrirData(minhas().find(x => x.id === ed.dataset.dtEd)); return; }
    const tm = e.target.closest('[data-tm-ed]'); if(tm){ abrirTime(time().find(x => x.id === tm.dataset.tmEd)); }
  });

  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="dlgData"><form class="dlg" id="fData" method="dialog"><h3 id="dtTit">Minha data comemorativa</h3>
      <label class="c"><span class="k">Nome</span><input id="dtNome" required placeholder="Ex.: Aniversário da Saint Germain"></label>
      <div class="g2"><label class="c"><span class="k">Data</span><input id="dtData" type="date" required></label>
        <label class="c" style="align-self:end"><span style="display:flex;gap:8px;align-items:center;font-size:13px;padding:10px 0"><input type="checkbox" id="dtAnual" style="width:auto" checked> Repete todo ano</span></label></div>
      <label class="c"><span class="k">Texto do dia</span><textarea id="dtTexto" rows="3" placeholder="O que essa data significa"></textarea></label>
      <div class="rodape"><button type="button" class="btn perigo min" id="dtExcluir">Excluir</button><div class="dir"><button type="button" class="btn ghost" id="dtCancelar">Cancelar</button><button class="btn">Salvar</button></div></div></form></dialog>
    <dialog id="dlgTime"><form class="dlg" id="fTime" method="dialog"><h3 id="tmTit">Colaborador</h3>
      <label class="c"><span class="k">Nome</span><input id="tmNome" required></label>
      <div class="g2"><label class="c"><span class="k">Data de entrada</span><input id="tmEntrada" type="date" required></label><label class="c"><span class="k">Setor</span><input id="tmSetor" placeholder="Opcional"></label></div>
      <div class="rodape"><button type="button" class="btn perigo min" id="tmExcluir">Excluir</button><div class="dir"><button type="button" class="btn ghost" id="tmCancelar">Cancelar</button><button class="btn">Salvar</button></div></div></form></dialog>`);
  let ED = null, TM = null;
  function abrirData(x){ ED = x || null; $('dtTit').textContent = x ? 'Editar data' : 'Minha data comemorativa'; $('dtNome').value = x ? x.nome : ''; $('dtData').value = x ? x.data : ''; $('dtAnual').checked = !x || x.anual !== false; $('dtTexto').value = x ? (x.texto || '') : ''; $('dtExcluir').hidden = !x; $('dtExcluir').dataset.c = ''; $('dtExcluir').textContent = 'Excluir'; $('dlgData').showModal(); }
  $('fData').addEventListener('submit', e => { e.preventDefault(); const d = { nome:$('dtNome').value.trim(), data:$('dtData').value, anual:$('dtAnual').checked, texto:$('dtTexto').value.trim() }; if(!d.nome || !d.data) return;
    if(ED) Object.assign(ED, d); else minhas().push(Object.assign({ id:uid() }, d)); salvar(); $('dlgData').close(); render(); toast('Data salva.'); });
  $('dtCancelar').onclick = () => $('dlgData').close();
  $('dtExcluir').onclick = () => { if(!ED) return; if($('dtExcluir').dataset.c !== '1'){ $('dtExcluir').dataset.c = '1'; $('dtExcluir').textContent = 'Confirmar exclusão'; return; } DB.datas = minhas().filter(x => x.id !== ED.id); salvar(); $('dlgData').close(); render(); };
  function abrirTime(x){ TM = x || null; $('tmTit').textContent = x ? 'Editar colaborador' : 'Colaborador'; $('tmNome').value = x ? x.nome : ''; $('tmEntrada').value = x ? x.entrada : ''; $('tmSetor').value = x ? (x.setor || '') : ''; $('tmExcluir').hidden = !x; $('tmExcluir').dataset.c = ''; $('tmExcluir').textContent = 'Excluir'; $('dlgTime').showModal(); }
  $('fTime').addEventListener('submit', e => { e.preventDefault(); const d = { nome:$('tmNome').value.trim(), entrada:$('tmEntrada').value, setor:$('tmSetor').value.trim() }; if(!d.nome || !d.entrada) return;
    if(TM) Object.assign(TM, d, { manual:true }); else time().push(Object.assign({ id:uid(), origem:'manual' }, d)); salvar(); $('dlgTime').close(); render(); toast('Colaborador salvo.'); });
  $('tmCancelar').onclick = () => $('dlgTime').close();
  $('tmExcluir').onclick = () => { if(!TM) return; if($('tmExcluir').dataset.c !== '1'){ $('tmExcluir').dataset.c = '1'; $('tmExcluir').textContent = 'Confirmar exclusão'; return; } DB.time = time().filter(x => x.id !== TM.id); salvar(); $('dlgTime').close(); render(); };

  /* ---------- integração com o Acessos (data de entrada) ---------- */
  const API_ACESSOS = 'https://script.google.com/macros/s/AKfycbwQPyL6HaJGebsEyQjYYmc6zqh4hLRFYrwD4fWBntIb6zAwH9YzUIVMlMosWojUa-U/exec';
  const CAMPOS = ['entrada','dataEntrada','admissao','dataAdmissao','inicio','dataInicio'];
  const paraIso = v => { v = String(v || '').trim(); let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v); if(m) return m[1] + '-' + m[2] + '-' + m[3]; m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(v); if(m) return m[3] + '-' + p2(m[2]) + '-' + p2(m[1]); return ''; };
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
        const campo = CAMPOS.find(k => p[k]); const ent = campo && paraIso(p[campo]); if(!ent) return;
        const ja = time().find(c => norm(c.nome) === norm(nome));
        if(ja){ if(!ja.manual && (ja.entrada !== ent || ja.setor !== p.setor)){ ja.entrada = ent; ja.setor = p.setor || ja.setor; ja.origem = 'acessos'; atual++; } }
        else { time().push({ id:uid(), nome, entrada:ent, setor:p.setor || '', origem:'acessos' }); novos++; }
      });
      DB.ajustes = Object.assign({}, DB.ajustes || {}, { acessosEm:isoD(new Date()) });
      salvar(); render();
      if(manual) toast(novos || atual ? `Do Acessos: ${novos} novo(s), ${atual} atualizado(s).` : 'O Acessos ainda não tem data de entrada nas posições. Assim que tiver, é só puxar de novo.');
    }catch(e){ if(manual) toast('Não consegui falar com o Acessos agora.'); }
  }
  // uma vez por dia, sozinho
  setTimeout(() => { if(((DB.ajustes || {}).acessosEm || '') !== isoD(new Date())) puxarAcessos(false); }, 4000);

  /* ---------- frases de mulheres inspiradoras, misturadas com os versículos ---------- */
  const FRASES = [
    ['Nunca um fracasso, sempre uma lição.', 'Rihanna'],
    ['Eu comecei me dando uma oportunidade.', 'Madam C. J. Walker'],
    ['Eu nunca sonhei com o sucesso. Eu trabalhei por ele.', 'Estée Lauder'],
    ['Para ser insubstituível, é preciso ser sempre diferente.', 'Coco Chanel'],
    ['Feito é melhor que perfeito.', 'Sheryl Sandberg'],
    ['Sucesso não é sobre quanto dinheiro você ganha, é sobre a diferença que você faz na vida das pessoas.', 'Michelle Obama'],
    ['Você se torna aquilo em que acredita.', 'Oprah Winfrey'],
    ['Pés, para que os quero, se tenho asas para voar?', 'Frida Kahlo'],
    ['Uma criança, um professor, um livro e uma caneta podem mudar o mundo.', 'Malala Yousafzai'],
    ['Ainda assim, eu me levanto.', 'Maya Angelou'],
    ['Liberdade é pouco. O que eu desejo ainda não tem nome.', 'Clarice Lispector'],
    ['Mire na lua. Se errar, ainda pode acertar uma estrela.', 'Mary Kay Ash']
  ];
  const ola = document.getElementById('ola');
  let FRASE = null;
  try{ const vez = +(localStorage.getItem('sg-agenda-mistura') || 0) + 1; localStorage.setItem('sg-agenda-mistura', vez); if(vez % 2 === 0){ let i = Math.floor(Math.random() * FRASES.length); const u = +localStorage.getItem('sg-agenda-frase'); if(i === u) i = (i + 1) % FRASES.length; localStorage.setItem('sg-agenda-frase', i); FRASE = FRASES[i]; } }catch(_){}
  function aplicarFrase(){ if(!FRASE || !ola) return; const v = ola.querySelector('.vers'); if(!v || v.dataset.frase) return; v.dataset.frase = '1'; v.innerHTML = `“${esc(FRASE[0])}”<b>${esc(FRASE[1])}</b>`; }
  if(ola){ new MutationObserver(aplicarFrase).observe(ola, { childList:true, subtree:true }); aplicarFrase(); }

  /* ---------- liga tudo ---------- */
  const renderAnt = render;
  render = function(){ renderAnt.apply(this, arguments); try{ painel(); if(ABA === 'calendario') marcarCal(); if(ABA === 'datas') desenharAba(); }catch(err){ console.error(err); } };
  const renderCalAnt = renderCal;
  renderCal = function(){ renderCalAnt.apply(this, arguments); try{ marcarCal(); }catch(_){} };
  // para a secretária saber das datas
  window.SG_datas = {
    resumo(){
      const h = hojeD(), l = [];
      for(let i = 0; i <= 14; i++){ const d = isoD(mais(h, i)); datasDe(d).forEach(x => l.push(d + ' ' + x.nome + ' (' + x.tipo + ')')); }
      comemoracoes(isoD(h), mais(h, 30)).forEach(x => l.push(x.data + ' Comemoração do time: ' + x.c.nome + ' completa ' + x.rot));
      return l;
    }
  };
  painel();
})();
