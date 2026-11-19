/* Agenda Coordenação · Secretária com inteligência
   Conversa de verdade (entende o que você quis dizer, mesmo em áudio transcrito torto),
   muda o item que já existe quando é para adiar/remarcar, conclui, anota na reunião, vincula a projeto
   e registra na linha do tempo. Desmarcar sempre pergunta antes.
   A chave da inteligência fica guardada na sua agenda (vale no computador e no aplicativo).
   Sem chave ou sem internet, a secretária antiga continua funcionando. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO || !window.SG_secretaria) return;
  const S = window.SG_secretaria;
  const antigoConversar = S.conversar, antigoExecutar = S.executar;
  const NOME = (() => { const n = String((EU && EU.nome) || '').trim().split(/\s+/)[0] || ''; return /^karine$/i.test(n) ? 'Kah' : n; })();
  const KHIST = CHAVE + ':ia-conversa';
  const DIAS = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];

  /* ---------- chave ---------- */
  const chave = () => String((DB.ajustes && DB.ajustes.ia && DB.ajustes.ia.chave) || '').trim();
  const provedor = k => /^sk-ant-/.test(k) ? 'claude' : /^AIza/.test(k) ? 'gemini' : '';
  const ligada = () => !!provedor(chave());
  function guardarChave(k){ DB.ajustes = Object.assign({}, DB.ajustes || {}, { ia: { chave:k, em:new Date().toISOString() } }); salvar(); try{ render(); }catch(_){} }
  const RX_CHAVE = /\b(AIza[0-9A-Za-z_\-]{30,}|sk-ant-[0-9A-Za-z_\-]{20,})\b/;

  /* ---------- memória da conversa ---------- */
  let HIST = []; try{ HIST = JSON.parse(localStorage.getItem(KHIST) || '[]'); }catch(_){}
  function lembrar(papel, texto){ HIST.push({ p:papel, t:String(texto || '').slice(0, 1500), em:Date.now() }); HIST = HIST.filter(h => Date.now() - h.em < 36e5 * 12).slice(-24); try{ localStorage.setItem(KHIST, JSON.stringify(HIST)); }catch(_){} }

  /* ---------- o que a secretária sabe da agenda ---------- */
  const curto = s => String(s || '').replace(/\s+/g, ' ').trim();
  function contexto(){
    const h = iso(hojeD()), lim = iso(somaDias(hojeD(), -21));
    const its = DB.itens.filter(i => (!i.feito && (!i.data || i.data >= lim)) || (i.feito && (i.feitoEm || '').slice(0,10) >= iso(somaDias(hojeD(), -3))))
      .sort((a, b) => ((a.data || '9999') + (a.hora || '99')).localeCompare((b.data || '9999') + (b.hora || '99'))).slice(0, 160);
    const P = window.SG_projetos;
    const linhas = its.map(i => {
      const st = i.feito ? 'concluído' : S.status(i);
      const pr = P && P.projDe(i);
      const extra = S.ehReuniao(i) && (i.pauta || []).length ? ' | pauta: ' + i.pauta.slice(0, 8).map(x => curto(x.t).slice(0, 50)).join('; ') : '';
      return [i.id, i.tipo, curto(i.titulo).slice(0, 110), i.data || 'sem data', i.hora || '-', i.pessoa || '-', i.prioridade || '-', st, pr ? 'projeto=' + pr : ''].join(' | ') + extra;
    });
    const projs = P ? P.lista().map(p => p.id + ' | ' + p.nome + (p.ativo ? '' : ' (encerrado)')) : [];
    return { hoje:h, linhas, projs };
  }

  function prompt(){
    const c = contexto(), d = new Date();
    return `Você é a secretária executiva pessoal da ${NOME || 'coordenadora'} (Karine Santos de Jesus, chamada de Kah), Coordenadora de Suporte & Customer Success da Saint Germain, marca premium de relógios e óculos. Ela está se preparando para ser a Head do Suporte. Você cuida da Agenda Coordenação dela.

JEITO DE FALAR
- Português do Brasil, como uma secretária de verdade: elegante, calorosa, objetiva, segura. Frases curtas (1 a 3). Pode usar o nome dela às vezes, sem exagero. Sem emojis em excesso (no máximo um, raramente).
- Converse normalmente. "bom dia", "tudo bem?", "obrigada", desabafos e comentários são CONVERSA: responda como gente e não mexa na agenda.
- Quando ela perguntar algo da agenda (o que tem hoje, quando é tal reunião, o que está atrasado, quando mudou tal processo), responda com base na lista abaixo e mostre os itens em "mostrar".
- Você entende fala transcrita com erros (áudio do iPhone): interprete a intenção. Ex.: "remarca a das duas pras quatro" = mover o item das 14:00 para 16:00.

O QUE VOCÊ FAZ NA AGENDA (campo "acoes")
- criar: só quando ela pede para anotar/marcar/lembrar, ou manda um compromisso claro com dia ou hora, ou cola uma pauta/plano/mensagem para organizar. Um texto grande vira VÁRIOS itens separados (um por ação, com responsável e prazo quando houver). Nunca crie item com conversa.
- alterar: adiar, remarcar, antecipar, trocar horário, renomear, mudar pessoa/tipo/prioridade, colocar notas. SEMPRE altere o item existente (use o id). NUNCA crie um item novo para remarcar.
- concluir / reabrir: quando ela disser que fez, terminou, resolveu.
- desmarcar: quando ela pedir para cancelar/excluir/desmarcar. Isso NÃO apaga na hora: vira um botão para ela confirmar. Diga "Quer que eu desmarque…?".
- anotar_reuniao: acrescentar anotações numa reunião/alinhamento existente (o que foi falado).
- pauta: acrescentar tópicos na pauta de uma reunião/alinhamento existente.
- vincular: ligar um item (ou um tópico da pauta, pelo número começando em 0) a um projeto.
- registrar: registrar na linha do tempo de um projeto uma mudança, melhoria, teste, decisão, retorno, troca, encontro, resultado ou observação.
- Se não tiver certeza de QUAL item ela quer (dois parecidos) ou faltar algo essencial, pergunte e ofereça "opcoes" com os candidatos. Não chute.
- Horário de trabalho dela é 8h às 20h: "às 2", "às 4 e meia" = 14:00, 16:30. "Meio-dia" = 12:00.
- Datas relativas a partir de hoje. "Semana que vem" sem dia = mesma dia da semana na próxima semana.
- Pedido do CEO (Junior) ou da diretoria = prioridade "diretoria".
- Tipos: tarefa, reuniao, alinhamento (reunião rápida/1:1/daily), projeto, compromisso (visita, consulta, evento, almoço), objetivo, plano (plano de ação).
- Projeto Suporte = a virada do Suporte (mudanças, melhorias, testes, reuniões sobre o Suporte). Quando ela falar desse assunto, você pode sugerir vincular; vincule direto se ela pedir.

HOJE: ${DIAS[d.getDay()]}, ${c.hoje}, agora são ${pad(d.getHours())}:${pad(d.getMinutes())} (horário de Brasília).

DATAS DOS PRÓXIMOS DIAS (feriados, comemorativas, datas dela e comemorações do time):
${(window.SG_datas ? SG_datas.resumo() : []).join('\n') || '(nenhuma)'}

PROJETOS (id | nome):
${c.projs.join('\n') || '(nenhum)'}

AGENDA (id | tipo | título | data | hora | pessoa | prioridade | situação | projeto):
${c.linhas.join('\n') || '(vazia)'}

RESPONDA SÓ COM JSON, neste formato:
{"resposta":"o que você fala para ela",
 "acoes":[
  {"op":"criar","tipo":"tarefa","titulo":"...","data":"AAAA-MM-DD ou vazio","hora":"HH:MM ou vazio","pessoa":"","prioridade":"diretoria|alta|media|baixa","notas":"","projeto":"id ou vazio","pauta":["tópico"]},
  {"op":"alterar","id":"...","campos":{"data":"AAAA-MM-DD","hora":"HH:MM","titulo":"...","pessoa":"...","tipo":"...","prioridade":"...","notas":"..."}},
  {"op":"concluir","id":"..."}, {"op":"reabrir","id":"..."}, {"op":"desmarcar","id":"..."},
  {"op":"anotar_reuniao","id":"...","texto":"..."}, {"op":"pauta","id":"...","topicos":["..."]},
  {"op":"vincular","id":"...","topico":0,"projeto":"id ou vazio"},
  {"op":"registrar","projeto":"id","tipo":"mudanca|melhoria|teste|decisao|retorno|troca|reuniao|encontro|plano|resultado|nota","titulo":"...","texto":"...","data":"AAAA-MM-DD"}
 ],
 "mostrar":["ids de itens para mostrar como cartão"],
 "opcoes":[{"rotulo":"texto do botão","texto":"o que ela estaria dizendo ao tocar"}]}
Use "acoes":[] quando for só conversa. Em "campos" mande só o que muda. Nunca invente ids.`;
  }

  /* ---------- chamada à inteligência ---------- */
  function historico(texto){
    return HIST.slice(-16).map(h => ({ papel: h.p === 'eu' ? 'user' : 'model', texto: h.t })).concat([{ papel:'user', texto }]);
  }
  async function comTempo(p, ms){ let t; const r = await Promise.race([p, new Promise((_, rej) => t = setTimeout(() => rej(new Error('tempo')), ms))]); clearTimeout(t); return r; }

  async function gemini(k, sys, msgs){
    const corpo = { systemInstruction:{ parts:[{ text:sys }] },
      contents: msgs.map(m => ({ role: m.papel === 'user' ? 'user' : 'model', parts:[{ text:m.texto }] })),
      generationConfig:{ temperature:.4, responseMimeType:'application/json', maxOutputTokens:4096 } };
    let ult;
    for(const modelo of ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash']){
      const r = await comTempo(fetch('https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent', { method:'POST', headers:{ 'Content-Type':'application/json', 'x-goog-api-key':k }, body:JSON.stringify(corpo) }), 40000);
      const j = await r.json().catch(() => ({}));
      if(r.ok){ const t = ((((j.candidates || [])[0] || {}).content || {}).parts || []).map(p => p.text || '').join(''); if(t) return t; ult = new Error('vazio'); continue; }
      ult = Object.assign(new Error((j.error && j.error.message) || 'Erro ' + r.status), { status:r.status });
      if(r.status === 400 && /api key|API_KEY/i.test(ult.message)) { ult.chave = true; throw ult; }
      if(r.status === 401 || r.status === 403){ ult.chave = true; throw ult; }
      if(r.status !== 404 && r.status !== 429 && r.status < 500) throw ult;
    }
    throw ult;
  }
  async function claude(k, sys, msgs){
    const m = []; msgs.forEach(x => { const role = x.papel === 'user' ? 'user' : 'assistant'; if(m.length && m[m.length - 1].role === role) m[m.length - 1].content += '\n' + x.texto; else m.push({ role, content:x.texto }); });
    while(m.length && m[0].role !== 'user') m.shift();
    let ult;
    for(const modelo of ['claude-haiku-5-5', 'claude-haiku-4-5', 'claude-sonnet-4-5']){
      const r = await comTempo(fetch('https://api.anthropic.com/v1/messages', { method:'POST',
        headers:{ 'Content-Type':'application/json', 'x-api-key':k, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
        body:JSON.stringify({ model:modelo, max_tokens:4096, temperature:.4, system:sys, messages:m }) }), 40000);
      const j = await r.json().catch(() => ({}));
      if(r.ok) return (j.content || []).map(c => c.text || '').join('');
      ult = Object.assign(new Error((j.error && j.error.message) || 'Erro ' + r.status), { status:r.status, chave: r.status === 401 || r.status === 403 });
      if(ult.chave) throw ult;
      if(r.status !== 404 && r.status !== 429 && r.status < 500) throw ult;
    }
    throw ult;
  }
  function lerJson(t){
    t = String(t || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try{ return JSON.parse(t); }catch(_){}
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if(a >= 0 && b > a){ try{ return JSON.parse(t.slice(a, b + 1)); }catch(_){} }
    return { resposta:t, acoes:[] };
  }

  /* ---------- executar o que ela decidiu ---------- */
  const R = (texto, extra) => Object.assign({ texto, cards:[], opcoes:[] }, extra || {});
  const TIPOS_OK = ['tarefa','reuniao','alinhamento','projeto','compromisso','objetivo','plano'];
  const dataOk = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) ? s : '';
  const horaOk = s => { const m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); return m && +m[1] < 24 ? pad(+m[1]) + ':' + m[2] : ''; };
  const prioOk = s => ['diretoria','alta','media','baixa'].includes(s) ? s : 'media';
  const projOk = id => id && window.SG_projetos && SG_projetos.lista().some(p => p.id === id) ? id : '';

  function aplicar(acoes, texto){
    const lista = [], opcoes = [], avisos = [];
    const cards = { push(c){ const ja = lista.find(x => x.id === c.id); if(!ja) return lista.push(c);
      if(c.antes){ ja.antes = ja.antes || {}; Object.keys(c.antes).forEach(k => { if(!(k in ja.antes)) ja.antes[k] = c.antes[k]; }); ja.podeDesfazer = ja.podeDesfazer || c.podeDesfazer; } } };
    let ent = null, mexeu = false;
    (Array.isArray(acoes) ? acoes : []).forEach(a => {
      if(!a || !a.op) return;
      const it = a.id ? DB.itens.find(i => i.id === a.id) : null;
      if(a.op === 'criar'){
        const titulo = curto(a.titulo); if(!titulo) return;
        if(!ent){ ent = uid(); DB.entradas.push({ id:ent, em:new Date().toISOString(), texto, gerados:0, via:'secretaria' }); }
        const tipo = TIPOS_OK.includes(a.tipo) ? a.tipo : 'tarefa';
        const novo = { id:uid(), titulo: titulo.charAt(0).toUpperCase() + titulo.slice(1), tipo, data:dataOk(a.data), hora:horaOk(a.hora), prioridade:prioOk(a.prioridade), pessoa:curto(a.pessoa),
          notas:String(a.notas || '').trim(), rec:'', sub:[], paiId:'', origem:'', entrada:ent, feito:false, feitoEm:'', criadoEm:new Date().toISOString() };
        if(projOk(a.projeto)) novo.projetoId = a.projeto;
        if(tipo === 'reuniao' || tipo === 'alinhamento'){ novo.pauta = (Array.isArray(a.pauta) ? a.pauta : []).map(t => ({ t:curto(t), ok:false })).filter(x => x.t); novo.anotacoes = ''; }
        DB.itens.push(novo); mexeu = true;
        const e = DB.entradas.find(x => x.id === ent); if(e) e.gerados++;
        cards.push({ id:novo.id, titulo:novo.titulo, podeDesfazer:true });
        return;
      }
      if(a.op === 'registrar'){
        if(!window.SG_projetos) return;
        const m = SG_projetos.registrar({ projetoId:projOk(a.projeto) || 'proj-suporte', tipo:a.tipo || 'nota', titulo:curto(a.titulo) || 'Registro', texto:String(a.texto || '').trim(), data:dataOk(a.data) || iso(hojeD()) });
        avisos.push('Registrado na linha do tempo: “' + m.titulo + '”.');
        return;
      }
      if(!it) return;
      if(a.op === 'alterar'){
        const c = a.campos || {}, antes = {}, mud = {};
        if('data' in c) mud.data = dataOk(c.data);
        if('hora' in c) mud.hora = horaOk(c.hora);
        if(c.titulo) mud.titulo = curto(c.titulo);
        if('pessoa' in c) mud.pessoa = curto(c.pessoa);
        if(TIPOS_OK.includes(c.tipo)) mud.tipo = c.tipo;
        if(c.prioridade) mud.prioridade = prioOk(c.prioridade);
        if('notas' in c) mud.notas = String(c.notas || '');
        Object.keys(mud).forEach(k => antes[k] = it[k] === undefined ? '' : it[k]);
        if(!Object.keys(mud).length) return;
        Object.assign(it, mud); mexeu = true;
        cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true });
      } else if(a.op === 'concluir' || a.op === 'reabrir'){
        const antes = { data:it.data, hora:it.hora, feito:it.feito, feitoEm:it.feitoEm || '', rec:it.rec || '' };
        concluir(it, a.op === 'concluir'); mexeu = true;
        cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true });
      } else if(a.op === 'desmarcar'){
        opcoes.push({ rotulo:'Sim, desmarcar “' + it.titulo.slice(0, 40) + '”', acao:{ tipo:'apagar', id:it.id } });
        if(!opcoes.some(o => o.acao.tipo === 'nada')) opcoes.push({ rotulo:'Não, deixa como está', acao:{ tipo:'nada' } });
        cards.push({ id:it.id, titulo:it.titulo });
      } else if(a.op === 'anotar_reuniao'){
        const t = String(a.texto || '').trim(); if(!t) return;
        const antes = { anotacoes:it.anotacoes || '' };
        it.anotacoes = (it.anotacoes ? it.anotacoes.replace(/\s+$/, '') + '\n' : '') + t; mexeu = true;
        cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true });
      } else if(a.op === 'pauta'){
        const novos = (Array.isArray(a.topicos) ? a.topicos : []).map(curto).filter(Boolean); if(!novos.length) return;
        const antes = { pauta:(it.pauta || []).map(x => Object.assign({}, x)) };
        it.pauta = (it.pauta || []).concat(novos.map(t => ({ t, ok:false }))); mexeu = true;
        cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true });
      } else if(a.op === 'vincular'){
        const pid = projOk(a.projeto);
        if(a.topico !== undefined && a.topico !== null && a.topico !== '' && (it.pauta || [])[+a.topico]){
          const antes = { pauta:(it.pauta || []).map(x => Object.assign({}, x)) };
          it.pauta[+a.topico].projetoId = pid; cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true });
        } else { const antes = { projetoId:it.projetoId || '' }; it.projetoId = pid; cards.push({ id:it.id, titulo:it.titulo, antes, podeDesfazer:true }); }
        mexeu = true;
      }
    });
    if(mexeu){ salvar(); render(); }
    return { cards:lista, opcoes, avisos };
  }

  async function conversarIA(entrada){
    const texto = String(entrada || '').trim();
    const k = chave();
    const msgs = historico(S.falaParaTexto ? S.falaParaTexto(texto) : texto);
    const bruto = provedor(k) === 'claude' ? await claude(k, prompt(), msgs) : await gemini(k, prompt(), msgs);
    const j = lerJson(bruto);
    const feito = aplicar(j.acoes, texto);
    const vistos = new Set(feito.cards.map(c => c.id));
    (Array.isArray(j.mostrar) ? j.mostrar : []).forEach(id => { const it = DB.itens.find(i => i.id === id); if(it && !vistos.has(id)){ vistos.add(id); feito.cards.push({ id, titulo:it.titulo }); } });
    let fala = curto(j.resposta) ? String(j.resposta).trim() : (feito.cards.length ? 'Pronto.' : 'Pode falar, estou aqui.');
    if(feito.avisos.length) fala += '\n' + feito.avisos.join('\n');
    const opc = feito.opcoes.length ? feito.opcoes : (Array.isArray(j.opcoes) ? j.opcoes : []).filter(o => o && o.rotulo).slice(0, 5).map(o => ({ rotulo:curto(o.rotulo).slice(0, 60), acao:{ tipo:'falar', texto:curto(o.texto || o.rotulo) } }));
    lembrar('eu', texto);
    const resumoAcoes = (j.acoes || []).map(a => a.op + (a.id ? ' ' + a.id : '') + (a.titulo ? ' "' + a.titulo + '"' : '') + (a.campos ? ' ' + JSON.stringify(a.campos) : '')).join('; ');
    lembrar('ela', fala + (resumoAcoes ? '\n[feito na agenda: ' + resumoAcoes + ']' : ''));
    return R(fala, { cards:feito.cards.slice(0, 25), opcoes:opc });
  }

  /* ---------- ligar: a chave pode ser colada na própria conversa ---------- */
  const PASSO = 'Para eu conversar de verdade e entender tudo que você fala, preciso ligar minha inteligência (uma vez só, vale no computador e no celular):\n\n1. Abra aistudio.google.com/apikey com sua conta Google\n2. Toque em “Create API key” e copie a chave (começa com AIza…)\n3. Cole a chave aqui na conversa e envie\n\nAté lá, sigo anotando do jeito simples.';
  let avisouHoje = false;

  function conversar(entrada){
    const t = String(entrada || '').trim();
    const m = RX_CHAVE.exec(t);
    if(m){
      guardarChave(m[1]);
      return testar().then(ok => ok
        ? R(`Inteligência ligada${NOME ? ', ' + NOME : ''}! Agora eu converso de verdade: pode falar normalmente, por texto ou áudio. Remarco, concluo, desmarco (sempre confirmo antes), anoto nas reuniões e cuido dos seus projetos.`)
        : R('Guardei a chave, mas ela não funcionou. Confira se copiou inteira (começa com AIza…) e cole de novo.'));
    }
    if(/^(desligar|tirar|remover|apagar) (a )?(intelig[eê]ncia|chave)/i.test(norm(t))){ guardarChave(''); return R('Desliguei a inteligência. Volto a anotar do jeito simples.'); }
    if(!ligada()){
      const r = antigoConversar(entrada);
      if(!avisouHoje && /^(oi|ola|bom dia|boa tarde|boa noite|tudo bem|ajuda|como funciona)/i.test(norm(t))){ avisouHoje = true; r.texto += '\n\n' + PASSO; }
      return r;
    }
    return conversarIA(t).catch(e => {
      if(e && e.chave) return R('Minha inteligência não conectou: a chave foi recusada. Cole uma chave nova aqui na conversa (começa com AIza…).');
      const r = antigoConversar(entrada);
      r.texto = r.texto + (e && e.status === 429 ? '\n\n(Minha inteligência atingiu o limite do momento; respondi do jeito simples.)' : '');
      return r;
    });
  }
  async function testar(){
    try{ const k = chave(); const t = provedor(k) === 'claude' ? await claude(k, 'Responda só {"ok":true}', [{ papel:'user', texto:'teste' }]) : await gemini(k, 'Responda só {"ok":true}', [{ papel:'user', texto:'teste' }]); return !!t; }
    catch(e){ return false; }
  }
  function executar(a){
    if(a && a.tipo === 'falar' && ligada()) return conversar(a.texto);
    return antigoExecutar(a);
  }

  Object.assign(S, { conversar, executar, saudarLocal:antigoConversar, ia:{ ligada, guardarChave, testar, passo:PASSO } });
})();
