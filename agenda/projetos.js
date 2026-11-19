/* Agenda Coordenação · Projetos e linha do tempo
   Projeto (começa com "Suporte"), botão "Vincular a projeto" em tarefas, reuniões e tópicos da pauta,
   e a linha do tempo de tudo que foi mudado, melhorado, testado, decidido e combinado. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;

  const ehReu = it => !!it && (it.tipo === 'reuniao' || it.tipo === 'alinhamento');
  const MARCOS = {
    mudanca:'Mudança', melhoria:'Melhoria', teste:'Teste', decisao:'Decisão', retorno:'Retorno',
    troca:'Troca', reuniao:'Reunião', encontro:'Encontro', plano:'Plano de ação', resultado:'Resultado', nota:'Observação'
  };
  const ROT_ITEM = { tarefa:'Tarefa', reuniao:'Reunião', alinhamento:'Alinhamento', projeto:'Projeto', compromisso:'Encontro', objetivo:'Objetivo', plano:'Plano de ação' };
  const ID_SUPORTE = 'proj-suporte';

  /* ---------- dados ---------- */
  function lista(){
    if(!Array.isArray(DB.projetos)) DB.projetos = [];
    if(!Array.isArray(DB.marcos)) DB.marcos = [];
    if(!DB.projetosIniciado){
      DB.projetosIniciado = true;
      if(!DB.projetos.some(p => p.id === ID_SUPORTE)) DB.projetos.unshift({ id:ID_SUPORTE, nome:'Suporte', descricao:'A virada do Suporte: tudo que for pedido para mudar, melhorar, testar, as reuniões, decisões e planos de ação.', criadoEm:new Date().toISOString(), ativo:true });
      salvar();
    }
    return DB.projetos;
  }
  const projeto = id => lista().find(p => p.id === id);
  // item herda o projeto da reunião em que nasceu (plano de ação da reunião)
  function projDe(it){
    if(!it) return '';
    if(it.projetoId) return it.projetoId;
    const o = it.origem && DB.itens.find(i => i.id === it.origem);
    return o && o.projetoId ? o.projetoId : '';
  }
  const ddmmaa = s => s ? s.slice(8,10) + '/' + s.slice(5,7) + '/' + s.slice(0,4) : '';
  const diaDe = it => it.data || (it.criadoEm || '').slice(0,10) || iso(hojeD());

  function entradas(pid){
    const out = [];
    DB.itens.forEach(it => {
      const p = projDe(it);
      if(p === pid){
        let texto = '';
        if(ehReu(it)){
          const pauta = (it.pauta || []).map(x => (x.ok ? '✓ ' : '· ') + x.t).join('\n');
          texto = [pauta ? 'Pauta:\n' + pauta : '', it.resumo ? String(it.resumo) : (it.anotacoes ? 'Anotações:\n' + it.anotacoes : '')].filter(Boolean).join('\n\n');
        } else texto = String(it.notas || '').replace(/^Pela secretária:.*$/m, '').trim();
        const herdado = !it.projetoId;
        out.push({ k:'i' + it.id, tipo: it.tipo, rot: ROT_ITEM[it.tipo] || it.tipo, dia: diaDe(it), hora: it.hora || '', titulo: it.titulo, texto, item: it, feito: it.feito,
          sub: [it.pessoa, herdado ? 'Da reunião “' + ((DB.itens.find(i => i.id === it.origem) || {}).titulo || '') + '”' : ''].filter(Boolean).join(' · ') });
      } else if(ehReu(it)){
        const tops = (it.pauta || []).filter(x => x.projetoId === pid);
        if(tops.length) out.push({ k:'t' + it.id, tipo:'topico', rot:'Tópico de reunião', dia: diaDe(it), hora: it.hora || '', titulo: tops.map(x => x.t).join(' · '),
          texto: tops.map(x => (x.ok ? '✓ Tratado: ' : '· A tratar: ') + x.t).join('\n'), item: it, sub: 'Na reunião “' + it.titulo + '”' });
      }
    });
    DB.marcos.filter(m => m.projetoId === pid).forEach(m => out.push({ k:'m' + m.id, tipo:'m-' + m.tipo, rot: MARCOS[m.tipo] || 'Registro', dia: m.data || (m.em || '').slice(0,10), hora:'', titulo: m.titulo, texto: m.texto || '', marco: m }));
    return out;
  }

  /* ---------- aparência ---------- */
  const css = document.createElement('style');
  css.textContent = `
    .projs{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
    .proj-card{cursor:pointer;text-align:left;display:grid;gap:8px;transition:transform .12s}
    .proj-card:hover{transform:translateY(-2px)}
    .proj-card h2{font-size:20px!important}
    .proj-card .nums{display:flex;gap:18px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--g2)}
    .proj-card .nums b{display:block;font-weight:400;font-size:22px;letter-spacing:0;color:var(--fg)}
    .proj-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:16px}
    .proj-cab h2{font-size:26px!important;margin:6px 0 4px!important}
    .proj-cab .acoes{display:flex;gap:8px;flex-wrap:wrap}
    .proj-filtros{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 18px;align-items:center}
    .linha{position:relative;display:grid;gap:14px;padding-left:28px}
    .linha::before{content:"";position:absolute;left:8px;top:6px;bottom:6px;width:1px;background:#e3d6cc}
    .lt-mes{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--g2);margin:10px 0 -4px -28px;padding-left:28px}
    .lt{position:relative;border:1px solid #ece3dc;border-radius:14px;padding:12px 14px;background:#fff}
    .lt::before{content:"";position:absolute;left:-25px;top:16px;width:11px;height:11px;border-radius:50%;background:#fff;border:2px solid #573529}
    .lt.feito::before{background:#573529}
    .lt .top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:11px;color:var(--g2);letter-spacing:.06em}
    .lt .tg{font-size:9px;letter-spacing:.18em;text-transform:uppercase;padding:3px 8px;border-radius:999px;border:1px solid #e3d6cc;background:#faf7f4;color:#573529}
    .lt .tg.marco{background:#e4c6c6;border-color:#d4aeae}
    .lt .t{font-size:15px;line-height:1.4;margin-top:6px}
    .lt pre{white-space:pre-wrap;font-family:var(--font);font-size:13px;line-height:1.55;color:var(--g1);margin:8px 0 0;max-height:220px;overflow:auto}
    .lt .bts{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
    .vinc-bt{display:inline-flex;align-items:center;gap:6px}
    .vinc-bt .dot{width:8px;height:8px;border-radius:50%;background:#573529;display:inline-block}
    #dlgVinc{width:min(460px,calc(100vw - 24px))}
    .vinc-l{display:grid;gap:8px}
    .vinc-l button{text-align:left;border:1px solid #ece3dc;border-radius:12px;padding:11px 13px;background:#fff;display:flex;justify-content:space-between;gap:10px;align-items:center}
    .vinc-l button[aria-pressed="true"]{border-color:#573529;box-shadow:0 0 0 2px #e4c6c6}
    .vinc-l small{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g2)}
    .pt-vinc{font-size:11px;padding:0 6px;color:var(--g3)!important;white-space:nowrap}
    .pt-vinc.on{color:#573529!important}
    .proj-tag{display:inline-block;font-size:9px;letter-spacing:.16em;text-transform:uppercase;border:1px solid #d4aeae;background:#f3e3e3;color:#573529;border-radius:999px;padding:2px 8px;line-height:1.5}
    @media print{ body *{visibility:hidden} #projImp,#projImp *{visibility:visible} #projImp{position:absolute;inset:0;padding:24px} }
  `;
  document.head.appendChild(css);

  /* ---------- aba ---------- */
  const nav = document.querySelector('nav.abas');
  const ref = nav && nav.querySelector('[data-aba="objetivos"]');
  const bAba = document.createElement('button');
  bAba.setAttribute('role', 'tab'); bAba.dataset.aba = 'projetos'; bAba.setAttribute('aria-selected', 'false'); bAba.textContent = 'Projetos';
  if(ref) ref.after(bAba); else if(nav) nav.appendChild(bAba);
  const sec = document.createElement('section'); sec.id = 'aba-projetos'; sec.hidden = true;
  document.getElementById('aba-objetivos').after(sec);

  const irAbaAnt = irAba;
  irAba = function(a){ sec.hidden = a !== 'projetos'; irAbaAnt(a); sec.hidden = a !== 'projetos'; };
  bAba.onclick = () => { ABERTO = ''; irAba('projetos'); };

  let ABERTO = '', FILTRO = '', RECENTES = true;
  const renderAnt = render;
  render = function(){ renderAnt.apply(this, arguments); if(ABA === 'projetos') desenhar(); };

  function desenhar(){
    lista();
    if(ABERTO && projeto(ABERTO)) return desenharProjeto(projeto(ABERTO));
    ABERTO = '';
    const ps = lista().slice().sort((a, b) => (b.ativo !== false) - (a.ativo !== false));
    sec.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:10px;flex-wrap:wrap">
        <p class="mut" style="margin:0">Cada projeto guarda a linha do tempo do que mudou, evoluiu, foi testado e decidido.</p>
        <button class="btn" data-pj="novo">+ Novo projeto</button></div>
      <div class="projs">${ps.map(p => {
        const e = entradas(p.id), ult = e.map(x => x.dia).sort().pop();
        const reus = e.filter(x => ehReu(x.item) || x.tipo === 'topico').length, marcos = e.filter(x => x.marco).length;
        return `<button class="card proj-card" data-pj-abrir="${esc(p.id)}"><span class="k">Projeto${p.ativo === false ? ' · encerrado' : ''}</span><h2>${esc(p.nome)}</h2>
          ${p.descricao ? `<div class="mut" style="font-size:12px;line-height:1.5">${esc(p.descricao)}</div>` : ''}
          <div class="nums"><span><b>${e.length}</b>registros</span><span><b>${reus}</b>reuniões</span><span><b>${marcos}</b>marcos</span></div>
          <div class="mut" style="font-size:11px">${ult ? 'Última movimentação: ' + esc(ddmmaa(ult)) : 'Nada vinculado ainda'}</div></button>`;
      }).join('') || '<div class="vazio">Nenhum projeto ainda.</div>'}</div>`;
  }

  function desenharProjeto(p){
    let e = entradas(p.id);
    const tipos = [...new Set(e.map(x => x.rot))];
    if(FILTRO) e = e.filter(x => x.rot === FILTRO);
    e.sort((a, b) => (a.dia + (a.hora || '99')).localeCompare(b.dia + (b.hora || '99')) * (RECENTES ? -1 : 1));
    let mesAnt = '';
    const itens = e.map(x => {
      const mes = new Date(x.dia + 'T12:00').toLocaleDateString('pt-BR', { month:'long', year:'numeric' });
      const cab = mes !== mesAnt ? `<div class="lt-mes">${esc(mes)}</div>` : ''; mesAnt = mes;
      return cab + `<div class="lt ${x.feito ? 'feito' : ''}">
        <div class="top"><span>${esc(ddmmaa(x.dia))}${x.hora ? ' · ' + esc(x.hora) : ''}</span><span class="tg ${x.marco ? 'marco' : ''}">${esc(x.rot)}</span>${x.feito ? '<span>Concluído</span>' : ''}${x.sub ? `<span>${esc(x.sub)}</span>` : ''}</div>
        <div class="t">${esc(x.titulo)}</div>${x.texto ? `<pre>${esc(x.texto)}</pre>` : ''}
        <div class="bts">${x.item ? `<button class="btn ghost min" data-pj-item="${esc(x.item.id)}">Abrir</button>` : ''}${x.marco ? `<button class="btn ghost min" data-pj-marco="${esc(x.marco.id)}">Editar</button>` : ''}</div></div>`;
    }).join('');
    sec.innerHTML = `<div class="card">
      <div class="proj-cab"><div><button class="btn ghost min" data-pj="voltar">‹ Projetos</button><h2>${esc(p.nome)}</h2>${p.descricao ? `<div class="mut" style="max-width:720px;line-height:1.5">${esc(p.descricao)}</div>` : ''}</div>
        <div class="acoes"><button class="btn ghost min" data-pj="editar">Editar projeto</button><button class="btn ghost min" data-pj="imprimir">Imprimir / PDF</button><button class="btn" data-pj="registrar">+ Registrar na linha do tempo</button></div></div>
      <div class="proj-filtros"><button class="pill" data-pj-f="" aria-pressed="${!FILTRO}">Tudo · ${entradas(p.id).length}</button>${tipos.map(t => `<button class="pill" data-pj-f="${esc(t)}" aria-pressed="${FILTRO === t}">${esc(t)}</button>`).join('')}
        <span style="flex:1"></span><button class="pill" data-pj="ordem" aria-pressed="false">${RECENTES ? 'Mais recentes primeiro' : 'Desde o início'}</button></div>
      ${itens ? `<div class="linha">${itens}</div>` : `<div class="vazio">Nada na linha do tempo ainda. Use “Vincular a projeto” em reuniões, tópicos da pauta e tarefas, ou registre aqui uma mudança, teste ou decisão.</div>`}
    </div>`;
  }

  sec.addEventListener('click', e => {
    const a = e.target.closest('[data-pj-abrir]'); if(a){ ABERTO = a.dataset.pjAbrir; FILTRO = ''; desenhar(); window.scrollTo({ top:0, behavior:'smooth' }); return; }
    const it = e.target.closest('[data-pj-item]'); if(it){ window.SG_verItem && SG_verItem(it.dataset.pjItem); return; }
    const mk = e.target.closest('[data-pj-marco]'); if(mk){ abrirMarco(DB.marcos.find(m => m.id === mk.dataset.pjMarco)); return; }
    const f = e.target.closest('[data-pj-f]'); if(f){ FILTRO = f.dataset.pjF; desenhar(); return; }
    const b = e.target.closest('[data-pj]'); if(!b) return;
    const q = b.dataset.pj;
    if(q === 'novo') abrirProjeto(null);
    if(q === 'voltar'){ ABERTO = ''; desenhar(); }
    if(q === 'editar') abrirProjeto(projeto(ABERTO));
    if(q === 'registrar') abrirMarco(null);
    if(q === 'ordem'){ RECENTES = !RECENTES; desenhar(); }
    if(q === 'imprimir') imprimir(projeto(ABERTO));
  });

  function imprimir(p){
    const e = entradas(p.id).sort((a, b) => (a.dia + (a.hora || '99')).localeCompare(b.dia + (b.hora || '99')));
    const div = document.createElement('div'); div.id = 'projImp';
    div.innerHTML = `<div style="font-family:Questrial,sans-serif;color:#000"><div style="letter-spacing:.5em;font-size:10px;color:#5b5b60">SAINT GERMAIN</div>
      <h1 style="font-weight:400;font-size:26px;margin:8px 0 4px">${esc(p.nome)}</h1><div style="color:#5b5b60;font-size:12px;margin-bottom:18px">Linha do tempo · ${esc(new Date().toLocaleDateString('pt-BR'))}</div>
      ${e.map(x => `<div style="border-left:2px solid #573529;padding:4px 0 10px 14px;margin-bottom:6px;page-break-inside:avoid"><div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#5b5b60">${esc(ddmmaa(x.dia))} · ${esc(x.rot)}${x.feito ? ' · Concluído' : ''}</div>
        <div style="font-size:14px;margin-top:3px">${esc(x.titulo)}</div>${x.texto ? `<div style="white-space:pre-wrap;font-size:12px;color:#414142;margin-top:4px">${esc(x.texto)}</div>` : ''}</div>`).join('')}</div>`;
    document.body.appendChild(div);
    setTimeout(() => { window.print(); div.remove(); }, 60);
  }

  /* ---------- diálogos: projeto e registro ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="dlgProj"><form class="dlg" id="fProj" method="dialog">
      <h3 id="pjTit">Novo projeto</h3>
      <label class="c"><span class="k">Nome</span><input id="pjNome" required></label>
      <label class="c"><span class="k">Sobre o projeto</span><textarea id="pjDesc" rows="3"></textarea></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:13px"><input type="checkbox" id="pjEnc" style="width:auto"> Projeto encerrado</label>
      <div class="rodape"><button type="button" class="btn perigo min" id="pjExcluir">Excluir</button><div class="dir"><button type="button" class="btn ghost" id="pjCancelar">Cancelar</button><button type="submit" class="btn">Salvar</button></div></div>
    </form></dialog>
    <dialog id="dlgMarco"><form class="dlg" id="fMarco" method="dialog">
      <h3 id="mkTit">Registrar na linha do tempo</h3>
      <div class="g2"><label class="c"><span class="k">O que foi</span><select id="mkTipo">${Object.entries(MARCOS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
        <label class="c"><span class="k">Data</span><input id="mkData" type="date" required></label></div>
      <label class="c"><span class="k">Título</span><input id="mkTitulo" required placeholder="Ex.: Nova regra de estorno proporcional"></label>
      <label class="c"><span class="k">O que foi discutido, mudado ou decidido</span><textarea id="mkTexto" rows="5"></textarea></label>
      <label class="c"><span class="k">Projeto</span><select id="mkProj"></select></label>
      <div class="rodape"><button type="button" class="btn perigo min" id="mkExcluir">Excluir</button><div class="dir"><button type="button" class="btn ghost" id="mkCancelar">Cancelar</button><button type="submit" class="btn">Salvar</button></div></div>
    </form></dialog>
    <dialog id="dlgVinc"><div class="dlg">
      <div><h3>Vincular a projeto</h3><p class="mut" style="margin:6px 0 0;font-size:12px" id="vcSobre"></p></div>
      <div class="vinc-l" id="vcLista"></div>
      <div class="rodape"><button type="button" class="btn ghost min" id="vcNovo">+ Novo projeto</button><div class="dir"><button type="button" class="btn ghost" id="vcFechar">Fechar</button></div></div>
    </div></dialog>`);

  let PJ = null;
  function abrirProjeto(p){
    PJ = p; $('pjTit').textContent = p ? 'Editar projeto' : 'Novo projeto';
    $('pjNome').value = p ? p.nome : ''; $('pjDesc').value = p ? (p.descricao || '') : ''; $('pjEnc').checked = !!p && p.ativo === false;
    $('pjExcluir').hidden = !p; $('pjExcluir').dataset.conf = ''; $('pjExcluir').textContent = 'Excluir';
    $('dlgProj').showModal(); if(!p) setTimeout(() => $('pjNome').focus(), 30);
  }
  let aoCriarProjeto = null;
  $('fProj').addEventListener('submit', e => {
    e.preventDefault();
    const nome = $('pjNome').value.trim(); if(!nome) return;
    if(PJ) Object.assign(PJ, { nome, descricao:$('pjDesc').value.trim(), ativo:!$('pjEnc').checked });
    else { PJ = { id:uid(), nome, descricao:$('pjDesc').value.trim(), criadoEm:new Date().toISOString(), ativo:true }; lista().push(PJ); }
    salvar(); $('dlgProj').close(); render(); toast('Projeto salvo.');
    if(aoCriarProjeto){ const f = aoCriarProjeto; aoCriarProjeto = null; f(PJ); }
  });
  $('pjCancelar').onclick = () => { aoCriarProjeto = null; $('dlgProj').close(); };
  $('pjExcluir').onclick = () => {
    if(!PJ) return;
    if($('pjExcluir').dataset.conf !== '1'){ $('pjExcluir').dataset.conf = '1'; $('pjExcluir').textContent = 'Confirmar: excluir projeto'; return; }
    // tira o vínculo, mas não apaga reuniões nem tarefas
    DB.projetos = lista().filter(p => p.id !== PJ.id);
    DB.itens.forEach(i => { if(i.projetoId === PJ.id) i.projetoId = ''; (i.pauta || []).forEach(x => { if(x.projetoId === PJ.id) x.projetoId = ''; }); });
    DB.marcos = DB.marcos.filter(m => m.projetoId !== PJ.id);
    salvar(); $('dlgProj').close(); ABERTO = ''; render(); toast('Projeto excluído. Reuniões e tarefas continuam na agenda.');
  };

  let MK = null;
  function abrirMarco(m, padrao){
    MK = m || null; const v = m || Object.assign({ tipo:'mudanca', data:iso(hojeD()), titulo:'', texto:'', projetoId:ABERTO || ID_SUPORTE }, padrao || {});
    $('mkTit').textContent = m ? 'Editar registro' : 'Registrar na linha do tempo';
    $('mkTipo').value = v.tipo; $('mkData').value = v.data || iso(hojeD()); $('mkTitulo').value = v.titulo; $('mkTexto').value = v.texto || '';
    $('mkProj').innerHTML = lista().map(p => `<option value="${esc(p.id)}">${esc(p.nome)}</option>`).join(''); $('mkProj').value = v.projetoId;
    $('mkExcluir').hidden = !m; $('mkExcluir').dataset.conf = ''; $('mkExcluir').textContent = 'Excluir';
    $('dlgMarco').showModal();
  }
  $('fMarco').addEventListener('submit', e => {
    e.preventDefault();
    const d = { tipo:$('mkTipo').value, data:$('mkData').value, titulo:$('mkTitulo').value.trim(), texto:$('mkTexto').value.trim(), projetoId:$('mkProj').value };
    if(!d.titulo) return;
    if(MK) Object.assign(MK, d); else { lista(); DB.marcos.push(Object.assign({ id:uid(), em:new Date().toISOString() }, d)); }
    salvar(); $('dlgMarco').close(); render(); toast('Registrado na linha do tempo.');
  });
  $('mkCancelar').onclick = () => $('dlgMarco').close();
  $('mkExcluir').onclick = () => {
    if(!MK) return;
    if($('mkExcluir').dataset.conf !== '1'){ $('mkExcluir').dataset.conf = '1'; $('mkExcluir').textContent = 'Confirmar exclusão'; return; }
    DB.marcos = DB.marcos.filter(m => m.id !== MK.id); salvar(); $('dlgMarco').close(); render(); toast('Registro excluído.');
  };

  /* ---------- Vincular a projeto ---------- */
  let ALVO = null;   // { item } ou { item, topico:i }
  function vinculoAtual(){ if(!ALVO) return ''; return ALVO.topico !== undefined ? ((ALVO.item.pauta || [])[ALVO.topico] || {}).projetoId || '' : ALVO.item.projetoId || ''; }
  function abrirVinc(alvo){
    ALVO = alvo;
    const it = alvo.item, top = alvo.topico !== undefined ? (it.pauta || [])[alvo.topico] : null;
    $('vcSobre').textContent = top ? 'Tópico “' + top.t + '” da reunião “' + it.titulo + '”' : (ROT_ITEM[it.tipo] || 'Item') + ': “' + it.titulo + '”';
    desenharVinc(); $('dlgVinc').showModal();
  }
  function desenharVinc(){
    const at = vinculoAtual();
    const herdado = !at && ALVO.topico === undefined && projDe(ALVO.item);
    $('vcLista').innerHTML = `<button type="button" data-vc="" aria-pressed="${!at}"><span>Nenhum projeto</span><small>${herdado ? 'segue a reunião de origem' : ''}</small></button>` +
      lista().filter(p => p.ativo !== false || p.id === at).map(p => `<button type="button" data-vc="${esc(p.id)}" aria-pressed="${at === p.id}"><span>${esc(p.nome)}</span><small>${at === p.id ? 'Vinculado' : ''}</small></button>`).join('');
  }
  function vincular(pid){
    if(!ALVO) return;
    ALVO.item = DB.itens.find(i => i.id === ALVO.item.id) || ALVO.item;
    if(ALVO.topico !== undefined){ const t = (ALVO.item.pauta || [])[ALVO.topico]; if(t) t.projetoId = pid; }
    else ALVO.item.projetoId = pid;
    salvar(); render(); marcarPauta(); marcarVer(); marcarReu();
    const p = projeto(pid);
    toast(p ? 'Vinculado ao projeto ' + p.nome + '.' : 'Sem projeto.');
    $('dlgVinc').close();
  }
  $('vcLista').addEventListener('click', e => { const b = e.target.closest('[data-vc]'); if(b) vincular(b.dataset.vc); });
  $('vcFechar').onclick = () => $('dlgVinc').close();
  $('vcNovo').onclick = () => { const alvo = ALVO; $('dlgVinc').close(); aoCriarProjeto = p => { ALVO = alvo; vincular(p.id); }; abrirProjeto(null); };

  const rotVinc = pid => { const p = projeto(pid); return p ? `<span class="dot"></span>${esc(p.nome)}` : 'Vincular a projeto'; };

  // janela "ver item"
  const verCorpo = $('verCorpo');
  function itemDoVer(){ return window.SG_verAtual && DB.itens.find(i => i.id === SG_verAtual.id) || null; }
  function marcarVer(){
    if(!verCorpo) return;
    const ac = verCorpo.querySelector('.ver-acoes'); if(!ac) return;
    const it = itemDoVer(); if(!it) return;
    let b = ac.querySelector('.vinc-bt');
    if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost vinc-bt'; ac.insertBefore(b, ac.firstChild); b.onclick = () => abrirVinc({ item:itemDoVer() }); }
    b.innerHTML = rotVinc(projDe(it));
  }
  if(verCorpo) new MutationObserver(() => marcarVer()).observe(verCorpo, { childList:true });

  // reunião inteira
  const reuDir = document.querySelector('#dlgReuniao .reu-cab .dir');
  function marcarReu(){
    if(!reuDir) return;
    let b = reuDir.querySelector('.vinc-bt');
    if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost min vinc-bt'; reuDir.insertBefore(b, reuDir.firstChild); b.onclick = () => window.SG_reuAtual && abrirVinc({ item:SG_reuAtual }); }
    b.innerHTML = rotVinc(window.SG_reuAtual && SG_reuAtual.projetoId);
  }
  // tópico da pauta
  const pauta = $('rqPauta');
  function marcarPauta(){
    if(!pauta || !window.SG_reuAtual) return;
    const p = SG_reuAtual.pauta || [];
    pauta.querySelectorAll('.l').forEach(l => {
      const del = l.querySelector('[data-pdel]'); if(!del) return;
      const i = +del.dataset.pdel, x = p[i]; if(!x) return;
      let b = l.querySelector('.pt-vinc');
      if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'pt-vinc'; b.dataset.ptv = i; l.insertBefore(b, del); }
      const pr = x.projetoId && projeto(x.projetoId);
      b.classList.toggle('on', !!pr); b.textContent = pr ? '● ' + pr.nome : 'Vincular'; b.title = pr ? 'Vinculado ao projeto ' + pr.nome : 'Vincular este tópico a um projeto';
    });
  }
  if(pauta){
    new MutationObserver(() => marcarPauta()).observe(pauta, { childList:true });
    pauta.addEventListener('click', e => { const b = e.target.closest('[data-ptv]'); if(b && window.SG_reuAtual){ abrirVinc({ item:SG_reuAtual, topico:+b.dataset.ptv }); } }, true);
  }
  const dlgReu = $('dlgReuniao');
  if(dlgReu) new MutationObserver(() => { if(dlgReu.open){ marcarReu(); marcarPauta(); } }).observe(dlgReu, { attributes:true, attributeFilter:['open'] });

  // janela de editar/novo: campo Projeto
  const wrapPai = $('wrapPai');
  if(wrapPai){
    wrapPai.insertAdjacentHTML('afterend', `<label class="c" id="wrapProj"><span class="k">Projeto</span><select id="iProj"></select></label>`);
    const abrirItemAnt = abrirItem;
    abrirItem = function(it, padrao){
      abrirItemAnt.apply(this, arguments);
      $('iProj').innerHTML = '<option value="">Nenhum</option>' + lista().filter(p => p.ativo !== false || (it && it.projetoId === p.id)).map(p => `<option value="${esc(p.id)}">${esc(p.nome)}</option>`).join('');
      $('iProj').value = (it && it.projetoId) || (padrao && padrao.projetoId) || '';
    };
    $('fItem').addEventListener('submit', () => {
      const v = $('iProj').value;
      const it = EDIT || DB.itens[DB.itens.length - 1];
      if(it && it.titulo === $('iTitulo').value.trim() && (it.projetoId || '') !== v){ it.projetoId = v; salvar(); render(); }
    });
  }

  // etiqueta do projeto na lista
  const linhaAnt = linhaItem;
  linhaItem = function(it, opt){
    const h = linhaAnt.apply(this, arguments);
    const p = projDe(it) && projeto(projDe(it));
    return p ? h.replace('<div class="meta">', `<div class="meta"><span class="proj-tag">${esc(p.nome)}</span>`) : h;
  };

  window.SG_projetos = {
    lista: () => lista().map(p => ({ id:p.id, nome:p.nome, ativo:p.ativo !== false })),
    projDe,
    registrar(m){ lista(); const x = Object.assign({ id:uid(), em:new Date().toISOString(), tipo:'nota', data:iso(hojeD()), titulo:'', texto:'', projetoId:ID_SUPORTE }, m); DB.marcos.push(x); salvar(); render(); return x; },
    criar(nome){ const p = { id:uid(), nome, descricao:'', criadoEm:new Date().toISOString(), ativo:true }; lista().push(p); salvar(); render(); return p; },
    abrir(id){ ABERTO = id; irAba('projetos'); }
  };
  lista();
})();
