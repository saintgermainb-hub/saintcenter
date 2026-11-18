/* Agenda Coordenação · Secretária que conversa
   Entende cumprimentos, perguntas, adiar/remarcar, desmarcar, concluir e só anota quando é um pedido.
   Usado pelo aplicativo do celular e pelo painel da Secretária no computador. */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO || !window.SG_secretaria) return;
  const S = window.SG_secretaria;
  const NOME = (() => { const n = String((EU && EU.nome) || '').trim().split(/\s+/)[0] || ''; return /^karine$/i.test(n) ? 'Kah' : (n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ''); })();
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const limpo = s => norm(s).replace(/[^\w\s:/.-]/g, ' ').replace(/\s+/g, ' ').trim();
  const abertos = () => DB.itens.filter(i => !i.feito);
  const quandoTxt = (data, hora) => data ? (fmtData(data, true).replace(/^Hoje$/, 'hoje').replace(/^Amanhã$/, 'amanhã') + (hora ? ' às ' + hora : '')) : (hora ? 'às ' + hora : 'sem data');
  const minutos = h => { const [a, b] = String(h || '').split(':').map(Number); return a * 60 + (b || 0); };
  const deMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const ord = (a, b) => ((a.data || '9999') + (a.hora || '99')).localeCompare((b.data || '9999') + (b.hora || '99'));
  const realizada = it => S.ehReuniao(it) && (!!String(it.anotacoes || '').trim() || !!it.resumo);

  /* ---------- fala → texto que a agenda entende ("duas da tarde" → 14h) ---------- */
  const UNID = { um:1, uma:1, primeiro:1, dois:2, duas:2, tres:3, quatro:4, cinco:5, seis:6, sete:7, oito:8, nove:9 };
  const NUM = Object.assign({ dez:10, onze:11, doze:12, treze:13, catorze:14, quatorze:14, quinze:15, dezesseis:16, dezasseis:16, dezessete:17, dezoito:18, dezenove:19, vinte:20, trinta:30, quarenta:40, cinquenta:50 }, UNID);
  const PAL = '(?:(?:vinte|trinta|quarenta|cinquenta)(?:\\s+e\\s+(?:um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove))?|primeiro|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|dezesseis|dezasseis|dezessete|dezoito|dezenove)';
  const valor = p => norm(p).split(/\s+e\s+/).reduce((s, x) => s + (NUM[x.trim()] || 0), 0);
  function falaParaTexto(t){
    t = String(t || '').replace(/\s+/g, ' ').trim();
    // o iPhone às vezes repete o mesmo trecho no ditado
    t = t.replace(/\b(.{8,}?)\s+\1\b/gi, '$1');
    const ctx = '(às|as|das|pras|pra as|para as|até as|ate as|até às|ate às|por volta das|a partir das|dia)';
    t = t.replace(new RegExp('(^|[^\\wÀ-ÿ])' + ctx + '\\s+' + PAL + '(?![\\wÀ-ÿ])', 'gi'), (m, a, c) => a + c + ' ' + valor(m.slice(a.length + c.length).trim()));
    // "duas horas", "quatro da tarde" (mas não "reunião de uma hora", que é duração)
    t = t.replace(new RegExp('(^|[^\\wÀ-ÿ])' + PAL + '(?=\\s+(?:horas?|hrs?|e meia|da manh[ãa]|da tarde|da noite)(?![\\wÀ-ÿ]))', 'gi'), (m, a, i, s) => {
      const antes = norm(s.slice(Math.max(0, i - 12), i + a.length));
      return /\b(de|por|durante|em|daqui a|daqui|mais|menos|umas?|uns)\s*$/.test(antes) ? m : a + valor(m.slice(a.length));
    });
    t = t.replace(new RegExp('\\b(\\d{1,2})\\s*(horas?|h)\\s+e\\s+(' + PAL + '|\\d{1,2})(?:\\s+minutos?)?(?![\\wÀ-ÿ])', 'gi'), (m, h, u, mm) => { const v = /^\d+$/.test(mm) ? +mm : valor(mm); return +h <= 23 && v < 60 ? h + ':' + pad(v) : m; });
    t = t.replace(new RegExp('(^|[^\\wÀ-ÿ])(às|as|das|pras|para as|até as)\\s+(\\d{1,2})\\s+e\\s+(' + PAL + '|\\d{1,2})(?:\\s+minutos?)?(?![\\wÀ-ÿ])', 'gi'), (m, a, c, h, mm) => { const v = /^\d+$/.test(mm) ? +mm : valor(mm); return +h <= 23 && v < 60 ? a + c + ' ' + h + ':' + pad(v) : m; });
    t = t.replace(/\bmeio[- ]dia(\s+e\s+meia)?\b/gi, (m, e) => e ? '12:30' : '12h');
    t = t.replace(/\b(\d{1,2})(?::(\d{2}))?\s*(?:horas?|hrs?|h)?\s+e\s+meia\b/gi, (m, h, mm) => +h <= 23 ? h + ':30' : m);
    t = t.replace(/\b(\d{1,2})(?::(\d{2}))?\s*(?:horas?|hrs?|h)?\s+da\s+(tarde|noite)\b/gi, (m, h, mm) => { let x = +h; if(x < 12) x += 12; return x <= 23 ? x + (mm ? ':' + mm : 'h') : m; });
    t = t.replace(/\b(\d{1,2})(?::(\d{2}))?\s*(?:horas?|hrs?|h)?\s+da\s+manh[ãa]\b/gi, (m, h, mm) => +h <= 12 ? h + (mm ? ':' + mm : 'h') : m);
    t = t.replace(/\b(\d{1,2}):(\d{2})\s*(?:horas?|hrs?|h)\b/gi, '$1:$2');
    t = t.replace(/\b(\d{1,2})\s*(?:horas?|hrs?)\b/gi, (m, h) => +h <= 23 ? h + 'h' : m);
    // expediente da coordenação: "às 2", "às 4:30" é da tarde
    t = t.replace(/(^|[^\wÀ-ÿ])(às|as|das|pras|pra as|para as|até as|ate as|até às)\s+([1-7])(?::([0-5]\d))?(?![\d/h:]|\s*(?:de\s|dias|semanas|meses|tarefas|pessoas|coisas|reuni))/gi, (m, a, c, h, mm) => a + c + ' ' + (+h + 12) + (mm ? ':' + mm : 'h'));
    // "das 14", "para as 16", "pra 16" → 14h, 16h (para a agenda reconhecer como horário)
    t = t.replace(/(^|[^\wÀ-ÿ])(às|as|das|pras|pra as|para as|até as|ate as|até às|para|pra|pro)\s+(\d{1,2})(?![\d/h:]|[.,]\d|\s*(?:de\s|dias|semanas|meses|pessoas|itens|anos|reais|mil|%))/gi, (m, a, c, h) => +h >= 8 && +h <= 23 ? a + c + ' ' + h + 'h' : m);
    return t;
  }

  /* ---------- quando: data e hora, dizendo se vieram escritas ---------- */
  const RX_TEM_DATA = /\b(\d{1,2}[/.-]\d{1,2}|\d{1,2} de (janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)|depois de amanha|amanha|hoje|hj|segunda|terca|quarta|quinta|sexta|sabado|domingo|dia \d{1,2}|semana que vem|proxima semana|fim (do|deste|desse) mes|proximo mes|mes que vem|em \d+ (dias?|semanas?))\b/;
  function quando(textoNorm){
    const q = acharQuando(textoNorm, hojeD());
    const temData = RX_TEM_DATA.test(textoNorm), temHora = !!q.hora;
    return { data: temData ? q.data : '', hora: q.hora, temData, temHora };
  }

  /* ---------- achar o item de que ela está falando ---------- */
  const VAZIAS = new Set('a o as os um uma de da do das dos e em no na nos nas para pra pro pras com que minha meu minhas meus hoje amanha agora as dia hora horas h la ali isso essa esse esta este aquela aquele por favor reuniao reunioes compromisso tarefa item evento agenda marcada marcado tinha tenho tem era estava vai ser fica ficou agora secretaria ate depois antes mais menos tarde manha noite cedo semana proxima proximo vez sim nao pode poderia consegue quero queria gostaria preciso voce eu favor coisa aquilo horario horarios data marcacao agendamento sua seu aquela essa vou vamos'.split(' '));
  const RX_VERBOS_ACAO = /\b(adiar|adia|adie|remarcar|remarca|remarque|reagendar|reagenda|reagende|mudar|muda|mude|trocar|troca|troque|passar|passa|passe|transferir|transfere|transfira|antecipar|antecipa|antecipe|empurrar|empurra|empurre|jogar|joga|jogue|alterar|altera|altere|mover|move|mova|atrasar|atrasa|atrase|desmarcar|desmarca|desmarque|cancelar|cancela|cancele|apagar|apaga|apague|excluir|exclui|exclua|deletar|deleta|remover|remove|remova|tirar|tira|tire|conclui|concluir|concluido|concluida|terminei|finalizei|fiz|feito|feita|resolvi|marca|marcar|marque|como|baixa|dar|da|risca|riscar)\b/g;
  function tipoPedido(n){
    if(/\b(reuniao|reunioes|call|meet|1:1|1x1|daily|weekly)\b/.test(n)) return ['reuniao', 'alinhamento'];
    if(/\balinhamento\b/.test(n)) return ['alinhamento', 'reuniao'];
    if(/\bcompromisso|visita|consulta|almoco|jantar|evento|entrevista|treinamento\b/.test(n)) return ['compromisso'];
    if(/\btarefa|obrigacao\b/.test(n)) return ['tarefa'];
    if(/\bprojeto\b/.test(n)) return ['projeto'];
    if(/\bobjetivo|meta\b/.test(n)) return ['objetivo'];
    return null;
  }
  function palavras(n){
    return n.replace(RX_VERBOS_ACAO, ' ').replace(/\b\d{1,2}(:\d{2}|h\d{0,2})?\b/g, ' ').replace(/\b(segunda|terca|quarta|quinta|sexta|sabado|domingo)(-feira| feira)?\b/g, ' ')
      .split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !VAZIAS.has(w));
  }
  function encontrar(refNorm, opt){
    opt = opt || {};
    const q = quando(refNorm), tipos = tipoPedido(refNorm), kws = palavras(refNorm), hoje = iso(hojeD());
    let cands = abertos();
    if(q.temHora) cands = cands.filter(i => i.hora === q.hora);
    if(q.temData) cands = cands.filter(i => i.data === q.data);
    if(!q.temHora && !q.temData && !kws.length && !tipos) return { lista:[], q, kws };
    const pont = cands.map(it => {
      const alvo = norm(it.titulo + ' ' + (it.pessoa || '') + ' ' + (it.tipo || '') + ' ' + (it.notas || '').slice(0, 200));
      let p = 0, acertos = 0;
      kws.forEach(w => { if(new RegExp('\\b' + w.slice(0, Math.max(4, w.length - 2))).test(alvo)){ p += 3; acertos++; } });
      if(tipos && tipos.includes(it.tipo)) p += tipos[0] === it.tipo ? 3 : 1;
      if(q.temHora) p += 4;
      if(q.temData) p += 3;
      if(!q.temData){ if(it.data === hoje) p += 2; else if(it.data && it.data > hoje) p += 1; else if(it.data && it.data < hoje && !S.ehReuniao(it)) p += .5; }
      return { it, p, acertos };
    }).filter(x => {
      if(kws.length && !x.acertos && !q.temHora) return false;                  // falou de um assunto: tem que bater
      if(!q.temHora && !q.temData && !x.acertos && !(tipos && tipos.includes(x.it.tipo))) return false;
      if(opt.soFuturos && x.it.data && x.it.data < hoje && S.ehReuniao(x.it)) return false;
      return true;
    }).sort((a, b) => b.p - a.p || ord(a.it, b.it));
    if(!pont.length) return { lista:[], q, kws };
    const top = pont[0].p, empatados = pont.filter(x => x.p >= top - .01);
    return { lista: empatados.map(x => x.it), todos: pont.map(x => x.it), q, kws };
  }

  /* ---------- mudar, desfazer, concluir, desmarcar ---------- */
  function alterar(id, mud){
    const it = DB.itens.find(i => i.id === id); if(!it) return null;
    const antes = { data:it.data, hora:it.hora, feito:it.feito, feitoEm:it.feitoEm || '' };
    if('data' in mud) it.data = mud.data;
    if('hora' in mud) it.hora = mud.hora;
    salvar(); render();
    return antes;
  }
  function restaurar(id, antes){
    const it = DB.itens.find(i => i.id === id); if(!it || !antes) return false;
    Object.assign(it, antes); salvar(); render(); return true;
  }
  let LIXO = {};   // desmarcados nesta conversa, para poder desfazer
  function apagar(id){
    const i = DB.itens.findIndex(x => x.id === id); if(i < 0) return null;
    const it = DB.itens[i]; LIXO[id] = { it, pos:i };
    DB.itens.splice(i, 1); salvar(); render(); return it;
  }
  function voltarApagado(id){
    const l = LIXO[id]; if(!l || DB.itens.some(x => x.id === id)) return false;
    DB.itens.splice(Math.min(l.pos, DB.itens.length), 0, l.it); delete LIXO[id]; salvar(); render(); return true;
  }
  function conflito(it, data, hora){
    if(!data || !hora) return null;
    return abertos().find(x => x.id !== it.id && x.data === data && x.hora && Math.abs(minutos(x.hora) - minutos(hora)) < 30) || null;
  }

  /* ---------- respostas ---------- */
  const R = (texto, extra) => Object.assign({ texto, cards:[], opcoes:[] }, extra || {});
  const card = (it, extra) => Object.assign({ id:it.id, titulo:it.titulo }, extra || {});
  function resumoHoje(){
    const hoje = iso(hojeD());
    const l = abertos().filter(i => i.data === hoje).sort(ord);
    const atr = abertos().filter(i => S.status(i) === 'atrasada' && !S.ehReuniao(i) && !['compromisso', 'objetivo'].includes(i.tipo));
    let t = '';
    if(!l.length) t = 'Sua agenda de hoje está livre por enquanto.';
    else {
      const prox = l.find(i => i.hora && minutos(i.hora) >= new Date().getHours() * 60 + new Date().getMinutes() - 30) || l[0];
      t = `Hoje você tem ${l.length === 1 ? '1 item' : l.length + ' itens'} na agenda` + (prox ? ` — o próximo é “${prox.titulo}”${prox.hora ? ' às ' + prox.hora : ''}.` : '.');
    }
    if(atr.length) t += ` E tem ${atr.length === 1 ? '1 pendência atrasada' : atr.length + ' pendências atrasadas'}.`;
    return { t, l, atr };
  }
  function cumprimento(n){
    const m = /^(bom dia|boa tarde|boa noite)/.exec(n);
    if(m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
    const h = new Date().getHours();
    return /^(oi|ola|oie|opa|hey|e ai|eai|salve|alo)/.test(n) ? 'Oi' : (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite');
  }
  const AJUDA = 'Posso anotar compromissos, reuniões e tarefas; adiar, antecipar ou desmarcar; marcar como concluído; e te contar o que tem na agenda. Ex.:\n· “amanhã às 10h reunião com o fornecedor”\n· “adia a reunião das 14h para as 16h”\n· “desmarca o alinhamento de sexta”\n· “o que tenho hoje?”';

  // tira "bom dia", "tudo bem?", o nome dela e o "secretária" do começo
  function tirarCumprimento(n){
    let r = n, achou = false, perguntouBem = false;
    for(let k = 0; k < 4; k++){
      const antes = r;
      r = r.replace(/^(bom dia|boa tarde|boa noite|oi+e?|ola+|opa|hey|e ai|eai|salve|alo|ei)\b[\s,!.]*/, () => { achou = true; return ''; });
      // "como está" só é cumprimento quando fala de você ("como está minha agenda" é pergunta)
      r = r.replace(/^(tudo (bem|bom|certo|joia|tranquilo|ok)|td bem|tudo bem\s?(ai|por ai)|como vai( voce| vc)?|como (voce|vc) (esta|ta|vai)|como esta (voce|vc)|como estas|como esta$|como ta$|como vc ta$)\b[\s,!.?]*(com voce|contigo|por ai|ai)?[\s,!.?]*/, () => { perguntouBem = true; achou = true; return ''; });
      r = r.replace(/^(secretaria|minha secretaria|querida|amiga|flor|linda)\b[\s,!.]*/, '');
      r = r.replace(/^(kah|karine)\b[\s,!.]*/, '');
      if(r === antes) break;
    }
    return { resto: r.trim(), achou, perguntouBem };
  }

  /* ---------- perguntas sobre a agenda ---------- */
  function ehPergunta(texto, n){
    return /\?\s*$/.test(texto.trim()) || /^(o que|oque|que|qual|quais|quando|que horas|a que horas|me (diz|fala|mostra|passa)|me lembra (o que|que horas|quando|qual)|mostra|mostre|lista|liste|tem algo|tenho algo|tenho alguma|tem alguma|tenho reuniao|tenho compromisso|como esta|como ta|e (hoje|amanha|a semana)|quantas?|quantos?)\b/.test(n) || /^(agenda|compromissos|pendencias|tarefas|reunioes)( de| da| do|$)/.test(n);
  }
  function responderPergunta(texto, n){
    const hoje = hojeD(), its = abertos();
    const lista = (l, ok, vazio) => R(l.length ? ok : vazio, { cards: l.slice(0, 25).map(i => card(i)) });
    if(/atrasad|venceu|vencid|pendente|pendencia|em aberto|esqueci/.test(n)){
      const l = its.filter(i => S.status(i) === 'atrasada' && !S.ehReuniao(i) && !['compromisso', 'objetivo'].includes(i.tipo)).sort(ord);
      return lista(l, `Você tem ${l.length} ${l.length === 1 ? 'item atrasado' : 'itens atrasados'}:`, 'Nada atrasado. Tudo em dia!');
    }
    if(/\bproxim[ao]\b|\bdepois\b|\bagora\b/.test(n) && /reuniao|compromisso|alinhamento|agenda|tenho|o que/.test(n) && !RX_TEM_DATA.test(n.replace(/\bagora\b/, ''))){
      const tipos = tipoPedido(n), agoraMin = new Date().getHours() * 60 + new Date().getMinutes(), h = iso(hoje);
      const l = its.filter(i => i.data && (i.data > h || (i.data === h && (!i.hora || minutos(i.hora) >= agoraMin - 5))) && (!tipos || tipos.includes(i.tipo))).sort(ord);
      return l.length ? R(`O próximo é “${l[0].titulo}”, ${quandoTxt(l[0].data, l[0].hora)}.`, { cards:[card(l[0])] }) : R('Não tem nada marcado daqui para frente.');
    }
    if(/semana|proximos dias/.test(n)){
      const fim = somaDias(hoje, 7), l = its.filter(i => i.data && i.data >= iso(hoje) && i.data <= iso(fim)).sort(ord);
      return lista(l, 'Nos próximos 7 dias:', 'Nada marcado nos próximos 7 dias.');
    }
    const q = quando(n);
    const kws = palavras(n.replace(/\b(o que|oque|que horas|a que horas|quando|qual|quais|tenho|tem|algo|alguma|algum|mostra|me|diz|fala|lista|como|esta|ta|e)\b/g, ' '));
    if(kws.length && !q.temData){
      const e = encontrar(n, { soFuturos:true });
      const l = (e.todos || []).slice(0, 8);
      if(l.length === 1) return R(`“${l[0].titulo}” está marcado para ${quandoTxt(l[0].data, l[0].hora)}.`, { cards:[card(l[0])] });
      if(l.length) return R('Encontrei estes:', { cards:l.map(i => card(i)) });
    }
    const dia = q.temData ? q.data : iso(hoje);
    const tipos = tipoPedido(n);
    const l = its.filter(i => i.data === dia && (!tipos || tipos.includes(i.tipo))).sort(ord);
    const rot = dia === iso(hoje) ? 'Hoje' : dia === iso(somaDias(hoje, 1)) ? 'Amanhã' : fmtData(dia, true);
    return lista(l, `${rot} você tem:`, `${rot} está livre${tipos ? ' de ' + (tipos[0] === 'reuniao' ? 'reuniões' : 'itens desse tipo') : ''} por enquanto.`);
  }

  /* ---------- adiar / remarcar / antecipar ---------- */
  const RX_MOVER = /\b(adiar|adia|adie|remarcar|remarca|remarque|reagendar|reagenda|reagende|mudar|muda|mude|trocar|troca|troque|passar|passa|passe|transferir|transfere|transfira|antecipar|antecipa|antecipe|empurrar|empurra|empurre|jogar|joga|jogue|alterar|altera|altere|mover|move|mova|atrasar|atrasa|atrase)\b/;
  const RX_DEST = /\b(para|pra|pro|pras|p\/)\s+(?=(?:as\s+|a\s+|o\s+|o dia\s+|dia\s+|daqui a\s+)?(?:\d|amanha|depois de amanha|hoje|segunda|terca|quarta|quinta|sexta|sabado|domingo|dia|proxim|semana que vem|mes que vem|fim d|outro dia|mais tarde))/;
  const RX_REL = /\b(\d+|uma|um|meia|duas|dois|tres)\s*(horas?|h|minutos?|min|dias?|semanas?)\b/;
  // sem verbo de mudar: "a reunião com a Thaíla vai ser às 17", "reunião das 14 agora é às 16"
  const RX_VIROU = /\b(vai ser|vai ficar|agora e|agora vai ser|agora fica|ficou para|ficou pra|ficou as|passou para|passou pra|mudou para|mudou pra|fica para|fica pra|sera)\s+(?:para\s+|pra\s+)?/;
  const RX_REF_ITEM = /\b(reuniao|alinhamento|call|compromisso|visita|consulta|entrevista|dentista|medico|almoco|jantar|treinamento|evento|1:1|1x1|daily|weekly)\b/;
  const RX_HORA = /\b\d{1,2}(?::\d{2}|h\d{0,2})\b/g;
  function moverImplicito(n){
    const v = RX_VIROU.exec(n);
    if(v && (RX_REF_ITEM.test(n.slice(0, v.index)) || encontrar(n.slice(0, v.index)).lista.length)){
      const destino = n.slice(v.index + v[0].length), q = quando(destino);
      if(q.temData || q.temHora) return { origem: n.slice(0, v.index).trim(), destino, rel:null, antecipar:false };
    }
    // "coloca/passa a reunião das 14 para as 16": só quando já existe algo nesse primeiro horário
    const m = /\b(?:das|da|de|do)\s+(\d{1,2}(?::\d{2}|h\d{0,2})?)\s+(?:para|pra|pro|p\/)\s+(?:as\s+|a\s+)?(\d{1,2}(?::\d{2}|h\d{0,2}))(?!\s*(?:pessoas|dias|minutos|itens))/.exec(n);
    if(m){
      const hOrig = quando('as ' + m[1]).hora;
      if(hOrig && abertos().some(i => i.hora === hOrig)) return { origem: n.slice(0, m.index) + ' as ' + m[1], destino: 'as ' + m[2], rel:null, antecipar:false };
    }
    return null;
  }
  function moverTexto(texto, n){
    const mv = RX_MOVER.exec(n); if(!mv) return moverImplicito(n);
    const depois = n.slice(mv.index + mv[0].length);
    let origem = n.slice(0, mv.index) + ' ' + depois, destino = '';
    const md = RX_DEST.exec(depois);
    if(md){
      destino = depois.slice(md.index + md[0].length);
      origem = n.slice(0, mv.index) + ' ' + depois.slice(0, md.index);
      // "adia para as 16 a reunião das 14": o resto depois do destino também descreve o item
      const corte = /\s(a|o|aquela|aquele|essa|esse)\s+(reuniao|alinhamento|call|compromisso|tarefa|visita|consulta|entrevista|projeto|\w+\s+com)\b/.exec(destino);
      if(corte){ origem += ' ' + destino.slice(corte.index); destino = destino.slice(0, corte.index); }
    }
    // "a reunião das 14 vai ser às 16"
    if(!destino){ const v = /\b(vai ser|vai ficar|ficou|fica|agora e|passou a ser|sera)\s+(?:para\s+)?(.+)$/.exec(depois); if(v){ destino = v[2]; origem = n.slice(0, mv.index) + ' ' + depois.slice(0, v.index); } }
    // "adiar reunião 14h 16h": o primeiro horário é o de agora, o último é o novo
    if(!destino){
      const hs = depois.match(RX_HORA) || [];
      if(hs.length >= 2){ const ult = depois.lastIndexOf(hs[hs.length - 1]); destino = 'as ' + hs[hs.length - 1]; origem = n.slice(0, mv.index) + ' ' + depois.slice(0, ult); }
    }
    let rel = RX_REL.exec(depois);
    // "das 14h" é horário, não "14 horas a mais"
    if(rel && /\b(das|as|de|da|do|para|pra|pro)\s*$/.test(depois.slice(0, rel.index))) rel = null;
    if(!destino && rel) origem = origem.replace(rel[0], ' ');
    const antecipar = /\b(antecipar|antecipa|antecipe)\b/.test(mv[0]);
    return { origem: origem.replace(/\b(a|o)\s*$/, '').trim(), destino: destino.trim(), rel: !destino && rel ? rel : null, antecipar };
  }
  function moverItem(it, destinoNorm, rel, antecipar){
    if(realizada(it)) return R(`A reunião “${it.titulo}” já tem anotações, então a data e o horário ficaram travados. Se precisar, abra e ajuste por lá.`, { cards:[card(it)] });
    let data = it.data, hora = it.hora;
    if(rel){
      const qtd = { uma:1, um:1, meia:.5, duas:2, dois:2, tres:3 }[rel[1]] ?? +rel[1], u = rel[2], sinal = antecipar ? -1 : 1;
      if(/^d/.test(u)) data = iso(somaDias(it.data ? deIso(it.data) : hojeD(), sinal * qtd));
      else if(/^s/.test(u)) data = iso(somaDias(it.data ? deIso(it.data) : hojeD(), sinal * qtd * 7));
      else {
        if(!it.hora) return R(`“${it.titulo}” não tem horário marcado. Para que horas eu passo?`, { cards:[card(it)], esperar:{ tipo:'destino', id:it.id } });
        let m = minutos(it.hora) + sinal * Math.round(/^m/.test(u) && !/^meia/.test(rel[1]) ? qtd : qtd * 60);
        let d = it.data ? deIso(it.data) : hojeD();
        while(m >= 1440){ m -= 1440; d = somaDias(d, 1); } while(m < 0){ m += 1440; d = somaDias(d, -1); }
        data = iso(d); hora = deMin(m);
      }
    } else {
      const q = quando(destinoNorm);
      if(!q.temData && !q.temHora){
        if(/\bmais tarde\b/.test(destinoNorm)) return R(`Para que horas eu passo “${it.titulo}”?`, { cards:[card(it)], esperar:{ tipo:'destino', id:it.id } });
        return R(`Para quando eu passo “${it.titulo}”? Me diga o dia e/ou o horário.`, { cards:[card(it)], esperar:{ tipo:'destino', id:it.id } });
      }
      if(q.temData) data = q.data;
      if(q.temHora) hora = q.hora;
      if(!data) data = iso(hojeD());
    }
    if(data === it.data && hora === it.hora) return R(`“${it.titulo}” já está ${quandoTxt(data, hora)}. Não precisei mudar nada.`, { cards:[card(it)] });
    const de = quandoTxt(it.data, it.hora);
    const depois = (data + (hora || '')) > ((it.data || '') + (it.hora || '')), antes = alterar(it.id, { data, hora });
    const verbo = depois ? 'Adiei' : 'Antecipei';
    const choque = conflito(it, data, hora);
    return R(`${pick(['Pronto!', 'Feito!', 'Prontinho!'])} ${verbo} “${it.titulo}” de ${de} para ${quandoTxt(data, hora)}.` + (choque ? `\nAtenção: nesse horário você também tem “${choque.titulo}” (${choque.hora}).` : ''),
      { cards:[card(it, { antes, podeDesfazer:true })] });
  }

  /* ---------- pedidos ---------- */
  const RX_APAGAR = /\b(desmarcar|desmarca|desmarque|cancelar|cancela|cancele|apagar|apaga|apague|excluir|exclui|exclua|deletar|deleta|delete|remover|remove|remova|tirar|tira|tire)\b/;
  const RX_FEITO = /\b(conclui|concluir|concluido|concluida|terminei|finalizei|ja fiz|fiz o|fiz a|fiz os|fiz as|resolvi|marca como (feito|feita|concluido|concluida)|marcar como (feito|feita|concluido|concluida)|marque como (feito|feita|concluido|concluida)|dar baixa|da baixa|de baixa|risca|riscar|ja foi feito|ja foi feita|esta feito|esta feita|ta feito|ta feita)\b/;
  const RX_PEDIDO = /\b(anota|anote|anotar|marca|marque|marcar|agenda|agende|agendar|coloca|coloque|colocar|lembra|lembre|lembrar|lembrete|inclui|inclua|incluir|registra|registre|registrar|adiciona|adicione|adicionar|poe|ponha|cria|crie|criar|salva|salve|bota|bote|preciso|precisa|tenho que|tenho de|temos que|devo|nao esquecer|nao posso esquecer|vou ter|vai ter|teremos|tenho uma|tenho um|vem aqui|vai vir|vem visitar|reuniao|alinhamento|call|compromisso|tarefa|prazo|entregar|visita|consulta|entrevista|treinamento|evento|almoco|jantar)\b/;
  // pedido explícito de anotar
  const RX_ANOTAR = /\b(anota|anote|anotar|marca|marque|marcar|agenda|agende|agendar|coloca|coloque|colocar|lembra|lembre|lembrar|lembrete|inclui|inclua|incluir|registra|registre|registrar|adiciona|adicione|adicionar|poe|ponha|cria|crie|criar|salva|salve|bota|bote)\b/;
  let ESPERA = null;   // o que a secretária perguntou e está esperando resposta

  function opcoesItens(l, acaoDe, rotulo){
    return l.slice(0, 5).map(it => ({ rotulo:it.titulo, sub:(rotulo || '') + quandoTxt(it.data, it.hora), acao:acaoDe(it) }));
  }

  function conversar(entrada){
    const texto = falaParaTexto(entrada);
    let n = limpo(texto);
    if(!n) return R('Pode falar, estou aqui.');

    /* respondendo uma pergunta da secretária */
    if(ESPERA){
      const esp = ESPERA; ESPERA = null;
      const curto = n.split(' ').length <= 4;   // "cancela a reunião das 14" é um pedido novo, não um "não"
      if(curto && /^(sim|s|isso|isso mesmo|pode|pode sim|claro|ok|okay|confirmo|confirma|manda|vai|uhum|aham|exato|positivo|beleza|blz|pode ser|por favor|quero|anota|pode anotar)\b/.test(n) && esp.sim) return executar(esp.sim);
      if(curto && /^(nao|n|nada|deixa|deixa pra la|esquece|cancela|negativo|melhor nao|nao precisa|era so conversa)\b/.test(n)) return R(pick(['Tudo bem, não mexi em nada.', 'Combinado, deixei como estava.']));
      if(esp.tipo === 'destino'){
        const it = DB.itens.find(i => i.id === esp.id), q = quando(n);
        if(it && (q.temData || q.temHora) && palavras(n).length <= 1 && !RX_MOVER.test(n) && !RX_APAGAR.test(n)) return moverItem(it, n, null, false);
      }
      // falou outra coisa: segue a conversa normalmente
    }

    /* cumprimentos e conversa */
    const c = tirarCumprimento(n);
    let prefixo = '';
    if(c.achou){
      if(!c.resto || /^(tudo bem|e voce|e vc|e ai)$/.test(c.resto)){
        const s = resumoHoje();
        const oi = cumprimento(n) + (NOME ? ', ' + NOME : '') + '!';
        const bem = c.perguntouBem ? ' Tudo ótimo por aqui, obrigada por perguntar.' : '';
        return R(`${oi}${bem} ${s.t}${s.l.length || s.atr.length ? '' : ' Me conta: o que você precisa hoje?'}`,
          { opcoes: [s.l.length ? { rotulo:'Ver o que tenho hoje', acao:{ tipo:'falar', texto:'o que tenho hoje?' } } : null, s.atr.length ? { rotulo:'Ver atrasados', acao:{ tipo:'falar', texto:'o que está atrasado?' } } : null].filter(Boolean) });
      }
      prefixo = cumprimento(n) + (NOME ? ', ' + NOME : '') + '! ';
      n = c.resto;
    }
    const comPrefixo = r => { if(prefixo) r.texto = prefixo + r.texto; return r; };

    if(/^(tudo bem|tudo bom|como vai|como voce esta|como vc esta|como esta voce)\b/.test(n)) return R(`Tudo ótimo, obrigada${NOME ? ', ' + NOME : ''}! E com você? Se precisar de algo na agenda, é só me falar.`);
    if(/^(obrigad[ao]|obg|brigad[ao]|valeu|vlw|muito obrigad|agradeco|grata|grato|thanks)\b/.test(n)) return R(pick(['De nada! Qualquer coisa, é só chamar.', 'Imagina! Estou por aqui.', 'Por nada! Conte comigo.']));
    if(/^(ok|okay|blz|beleza|certo|perfeito|otimo|otima|show|top|amei|maravilha|combinado|entendi|ta bom|ta otimo|joia|massa|legal|boa|isso|isso mesmo|uhum|aham|ta|sim|nao|kkk+|haha+|rs+)$/.test(n)) return R(pick(['Combinado!', 'Perfeito!', 'Certo!', 'Anotado aqui na cabeça! Se precisar, é só falar.']));
    if(/^(tchau|ate mais|ate amanha|ate logo|ate depois|fui|bjs|beijos|beijo|boa noite e ate)\b/.test(n)) return R(`Até mais${NOME ? ', ' + NOME : ''}! Estou por aqui quando precisar.`);
    if(/^(quem e voce|quem e vc|o que voce faz|o que vc faz|o que voce sabe fazer|ajuda|help|me ajuda como|como funciona|como te uso|o que posso pedir)\b/.test(n)) return R('Sou sua secretária. ' + AJUDA);
    if(/^(bom trabalho|parabens|voce e otima|vc e otima|adoro voce|te amo|linda|arrasou)\b/.test(n)) return R('Obrigada! Fico feliz em ajudar.');

    /* avisos do dia a dia: "vou almoçar", "estou indo para a reunião" */
    if(/^(eu\s+)?(estou|to|tou|vou|ja vou)\s+(indo|saindo|chegando|voltando|entrando|almocar|sair|embora|dormir|descansar|pra casa|para casa|tomar|pegar|buscar um cafe|fazer uma pausa|dar uma pausa)\b/.test(n) && !quando(n).temHora && !RX_ANOTAR.test(n)){
      const fala = /almoc/.test(n) ? 'Bom almoço' : /dormir|descansar|casa|embora/.test(n) ? 'Descanse bem' : /reuniao|alinhamento|call/.test(n) ? 'Boa reunião' : /cafe|pausa/.test(n) ? 'Aproveita a pausa' : 'Combinado';
      return comPrefixo(R(`${fala}${NOME ? ', ' + NOME : ''}! Estou por aqui quando precisar.`));
    }

    /* conversa solta: agradecimento, pedido de ajuda, desabafo (nada disso vira item) */
    const temPedidoForte = RX_MOVER.test(n) || RX_APAGAR.test(n) || RX_ANOTAR.test(n) || quando(n).temHora;
    if(!temPedidoForte && /\b(obrigad[ao]|brigad[ao]|valeu|agradec\w*|grat[ao])\b/.test(n)) return comPrefixo(R(pick(['De nada! Qualquer coisa, é só chamar.', 'Imagina! Estou por aqui.', 'Por nada! Conte comigo.'])));
    const nAjuda = n.replace(/^(eu\s+)?(quero|queria|gostaria)\s+(que\s+(voce|vc)\s+)?/, '');
    if(!temPedidoForte && /^(preciso de (ajuda|voce|vc|uma ajuda)|me ajuda|me ajude|socorro|ajuda aqui|me organiza|organiza meu dia|organizar meu dia|vamos organizar|planejar meu dia|planeja meu dia)\b/.test(nAjuda)){
      const s = resumoHoje();
      return comPrefixo(R(`Claro${NOME ? ', ' + NOME : ''}, estou aqui. ${s.t} Me diz o que você precisa: posso anotar, adiar, desmarcar ou te lembrar de algo.`,
        { opcoes:[s.l.length ? { rotulo:'Ver o que tenho hoje', acao:{ tipo:'falar', texto:'o que tenho hoje?' } } : null, { rotulo:'Ver a semana', acao:{ tipo:'falar', texto:'o que tenho na semana?' } }, s.atr.length ? { rotulo:'Ver atrasados', acao:{ tipo:'falar', texto:'o que está atrasado?' } } : null].filter(Boolean) }));
    }
    const RX_SENT = /\b(cansad\w*|cansativ\w*|exaust\w*|estressad\w*|estresse|sobrecarregad\w*|esgotad\w*|corrid[oa]|puxad[oa]|atolad\w*|correria|loucura|caotic\w*|pesad[oa]|dificil|complicad[oa]|triste|chatead\w*|preocupad\w*|ansios\w*|nervos\w*|feliz|animad\w*|contente|aliviad\w*|orgulhos\w*|dia bom|otimo dia|dia otimo|dia lindo|dia maravilhoso)\b/;
    if(!temPedidoForte && RX_SENT.test(n) && !/\b(tenho que|preciso|devo|lembra|lembre)\b/.test(n)){
      if(/feliz|animad|contente|aliviad|orgulhos|dia bom|otimo dia|dia otimo|dia lindo|dia maravilhoso/.test(n)) return comPrefixo(R(`Que bom${NOME ? ', ' + NOME : ''}! Fico feliz em saber. Se precisar de algo na agenda, é só falar.`));
      if(/preocupad|ansios|nervos|triste|chatead/.test(n)) return comPrefixo(R(`Sinto muito${NOME ? ', ' + NOME : ''}. Quer me contar o que está pesando? Se tiver algo para resolver, eu anoto ou reorganizo a agenda para você.`));
      const s = resumoHoje();
      return comPrefixo(R(`Imagino${NOME ? ', ' + NOME : ''}, o dia está puxado. ${s.l.length ? s.t + ' Quer que eu veja o que dá para adiar?' : 'Pelo menos a agenda de hoje está tranquila. Respira um pouco!'}`,
        { opcoes: s.l.length ? [{ rotulo:'Ver o que tenho hoje', acao:{ tipo:'falar', texto:'o que tenho hoje?' } }] : [] }));
    }

    /* adiar / remarcar */
    const mv = moverTexto(texto, n);
    if(mv){
      const e = encontrar(mv.origem, { soFuturos:true });
      if(!e.lista.length){
        const hoje = abertos().filter(i => i.data === iso(hojeD())).sort(ord);
        return comPrefixo(R(`Não achei ${e.q.temHora ? 'nada marcado às ' + e.q.hora : 'esse item'}${e.q.temData ? ' em ' + fmtData(e.q.data, true) : ''} na sua agenda. Qual deles eu mudo?`,
          { opcoes: opcoesItens(hoje.length ? hoje : abertos().filter(i => i.data >= iso(hojeD())).sort(ord), it => ({ tipo:'mover', id:it.id, destino:mv.destino, rel:mv.rel ? mv.rel[0] : '', antecipar:mv.antecipar })) }));
      }
      if(e.lista.length > 1) return comPrefixo(R('Achei mais de um. Qual deles eu mudo?', { opcoes: opcoesItens(e.lista, it => ({ tipo:'mover', id:it.id, destino:mv.destino, rel:mv.rel ? mv.rel[0] : '', antecipar:mv.antecipar })) }));
      return comPrefixo(moverItem(e.lista[0], mv.destino, mv.rel, mv.antecipar));
    }

    /* desmarcar (sempre pergunta antes) */
    if(RX_APAGAR.test(n)){
      const ref = n.replace(RX_APAGAR, ' ');
      const e = encontrar(ref, { soFuturos:true });
      if(e.lista.length === 1){
        const it = e.lista[0];
        const r = R(`Quer que eu desmarque “${it.titulo}” (${quandoTxt(it.data, it.hora)})?`, { cards:[card(it)], opcoes:[{ rotulo:'Sim, desmarcar', acao:{ tipo:'apagar', id:it.id } }, { rotulo:'Não, deixa como está', acao:{ tipo:'nada' } }] });
        ESPERA = { sim:{ tipo:'apagar', id:it.id } };
        return comPrefixo(r);
      }
      if(e.lista.length > 1) return comPrefixo(R('Achei mais de um. Qual eu desmarco?', { opcoes: opcoesItens(e.lista, it => ({ tipo:'confirmarApagar', id:it.id })) }));
      // não achou nada para desmarcar: é uma tarefa nova ("cancelar a assinatura")
    }

    /* concluir */
    if(RX_FEITO.test(n)){
      const e = encontrar(n.replace(RX_FEITO, ' '));
      if(e.lista.length === 1){
        const it = e.lista[0], antes = { data:it.data, hora:it.hora, feito:it.feito, feitoEm:it.feitoEm || '' };
        concluir(it, true);
        return comPrefixo(R(`${pick(['Ótimo!', 'Boa!', 'Perfeito!'])} Marquei “${it.titulo}” como concluído.`, { cards:[card(it, { antes, podeDesfazer:true })] }));
      }
      if(e.lista.length > 1) return comPrefixo(R('Qual deles você concluiu?', { opcoes: opcoesItens(e.lista, it => ({ tipo:'concluir', id:it.id })) }));
    }

    /* perguntas e busca */
    const mb = /^(busca|buscar|busque|procura|procurar|procure|pesquisa|pesquisar|pesquise|acha|achar|ache|encontra|encontrar|encontre)\b[:\s]*(.*)$/.exec(n);
    if(mb && S.buscar){
      const q = texto.trim().split(/\s+/).slice(1).join(' ').replace(/^(por|sobre|o|a)\s+/i, '');
      const r = q ? S.buscar(q) : [];
      if(!r.length) return comPrefixo(R(q ? `Não encontrei nada sobre “${q}”. Tente outra palavra.` : 'O que eu procuro? Ex.: “buscar orçamento”.'));
      const itens = r.filter(x => x.fonte === 'item').slice(0, 10), ent = r.filter(x => x.fonte === 'entrada').slice(0, 3);
      return comPrefixo(R(`Encontrei ${r.length} ${r.length === 1 ? 'resultado' : 'resultados'} para “${q}”:` + ent.map(x => '\n\n📥 Caixa de entrada: “' + x.trecho.slice(0, 180) + '”').join(''), { cards: itens.map(x => ({ id:x.id, titulo:x.titulo })) }));
    }
    if(ehPergunta(texto, n) && !/^(pode|poderia|consegue|da para|da pra|voce pode|vc pode)\b/.test(n)) return comPrefixo(responderPergunta(texto, n));

    /* desabafo: conversa, não vira item */
    const desabafo = /^(eu\s+)?(estou|to|tou|sou|fiquei|me sinto|ando|acho|achei|nossa|que dia|hoje foi|hoje ta|hoje esta|o dia ta|o dia esta|que semana|ai que)\b/.test(n) && !RX_PEDIDO.test(n) && !RX_VERBO.test(n.replace(/^(eu\s+)?(estou|to|tou)\s+/, ''));
    if(desabafo){
      if(/cansad|exaust|estressad|sobrecarregad|esgotad|corrid|puxad|cheio|lotad|atolad|correria/.test(n)){
        const s = resumoHoje();
        return comPrefixo(R(`Imagino${NOME ? ', ' + NOME : ''}, o dia está puxado. ${s.l.length ? s.t + ' Quer que eu veja o que dá para adiar?' : 'Pelo menos a agenda de hoje está tranquila. Respira um pouco!'}`,
          { opcoes: s.l.length ? [{ rotulo:'Ver o que tenho hoje', acao:{ tipo:'falar', texto:'o que tenho hoje?' } }] : [] }));
      }
      if(/feliz|otim|maravilh|animad|contente|bem\b/.test(n)) return comPrefixo(R('Que bom! Fico feliz em saber. Se precisar de algo na agenda, é só falar.'));
      return comPrefixo(R(`Entendi${NOME ? ', ' + NOME : ''}. Quer que eu anote algo sobre isso na agenda?`, { opcoes:[{ rotulo:'Sim, anotar', sub:'“' + texto.slice(0, 80) + '”', acao:{ tipo:'criar', texto } }, { rotulo:'Não, era só conversa', acao:{ tipo:'nada' } }] }));
    }

    /* anotar: direto só quando você pede ("anota", "marca", "me lembra"…) ou quando tem dia/horário.
       Sem isso, ela pergunta antes. */
    const q = quando(n);
    const direto = RX_ANOTAR.test(n) || q.temHora || (q.temData && !/^(hoje|hj|agora|amanha)$/.test(n) && (RX_PEDIDO.test(n) || RX_VERBO.test(n)));
    if(!direto){
      const parece = RX_PEDIDO.test(n) || RX_VERBO.test(n) || q.temData;
      const frase = texto.trim().replace(/[.!]+$/, '').slice(0, 90);
      const r = parece
        ? R(`Quer que eu anote “${frase}” na sua agenda${NOME ? ', ' + NOME : ''}? Se quiser, me diga também o dia.`, { opcoes:[{ rotulo:'Sim, anotar', acao:{ tipo:'criar', texto } }, { rotulo:'Não, era só conversa', acao:{ tipo:'nada' } }] })
        : R(`Entendi${NOME ? ', ' + NOME : ''}. Quer que eu faça algo com isso na agenda, ou era só para conversar?`, { opcoes:[{ rotulo:'Anotar na agenda', acao:{ tipo:'criar', texto } }, { rotulo:'Era só conversa', acao:{ tipo:'nada' } }] });
      ESPERA = { sim:{ tipo:'criar', texto } };
      return comPrefixo(r);
    }
    return comPrefixo(criar(texto));
  }

  // tira o que é só conversa ("bom dia", "tudo bem?", "obrigada") antes de anotar
  function soPedido(texto){
    return texto.split(/\n|(?<=[.!?])\s+/).map(seg => {
      const c = tirarCumprimento(limpo(seg));
      if(!c.resto || /^(por favor|obrigad[ao]|obg|valeu|ok|beleza|tudo bem|e voce)$/.test(c.resto)) return '';
      seg = seg.replace(/\s*\b(na|no|em)\s+(minha\s+|meu\s+)?(agenda|calend[aá]rio)\b/i, '');
      if(!c.achou) return seg;
      return seg.replace(/^[\s,!.]*(bom dia|boa tarde|boa noite|oi+e?|ol[aá]+|opa|hey|e a[ií]|salve)[\s,!.]*/i, '').replace(/^(tudo bem|tudo bom|tudo certo)[\s,!.?]*/i, '').replace(/^(secret[aá]ria|kah|karine)[\s,!.]*/i, '').trim();
    }).filter(Boolean).join('\n');
  }
  function criar(texto){
    let feitos = [];
    texto = soPedido(texto) || texto;
    try{ feitos = S.anotar(texto); }catch(_){ feitos = []; }
    feitos.forEach(f => { const it = DB.itens.find(i => i.id === f.id); if(!it) return; const t = it.titulo.replace(/^a[ií]\s*[:,-]\s*/i, '').replace(/^(uma|um|o|a)\s+(?=\S)/i, ''); if(t !== it.titulo && t.length > 2){ it.titulo = t.charAt(0).toUpperCase() + t.slice(1); f.titulo = it.titulo; } });
    if(feitos.length){ salvar(); render(); }
    if(!feitos.length) return R('Não consegui entender o que anotar. Me diga o que é, o dia e o horário. Ex.: “sexta às 10h alinhamento com o fornecedor”.');
    const avisos = feitos.map(f => { const it = DB.itens.find(i => i.id === f.id); const c = it && conflito(it, it.data, it.hora); return c ? `Atenção: ${quandoTxt(it.data, it.hora)} você também tem “${c.titulo}”.` : ''; }).filter(Boolean);
    const semData = feitos.filter(i => !i.data);
    let t;
    if(feitos.length === 1){
      const f = feitos[0];
      t = `${pick(['Anotado!', 'Pronto, anotei!', 'Feito!'])} “${f.titulo}” ${f.data ? 'para ' + quandoTxt(f.data, f.hora) : 'ficou sem data'}.`;
      if(!f.data){ t += ' Quer que eu marque um dia? É só me dizer.'; ESPERA = { tipo:'destino', id:f.id }; }
    } else t = `Anotei ${feitos.length} itens na sua agenda.` + (semData.length ? ` ${semData.length === 1 ? '1 ficou' : semData.length + ' ficaram'} sem data.` : '');
    if(avisos.length) t += '\n' + avisos.join('\n');
    return R(t, { cards: feitos.map(i => ({ id:i.id, titulo:i.titulo, podeDesfazer:true })) });
  }

  // botões das respostas (escolher qual, confirmar, criar...)
  function executar(a){
    a = a || {}; ESPERA = null;
    const it = a.id && DB.itens.find(i => i.id === a.id);
    if(a.tipo === 'nada') return R(pick(['Tudo bem, não mexi em nada.', 'Combinado, deixei como estava.']));
    if(a.tipo === 'falar') return conversar(a.texto);
    if(a.tipo === 'criar') return criar(a.texto);
    if(a.id && !it) return R('Esse item não está mais na agenda.');
    if(a.tipo === 'mover') return moverItem(it, a.destino || '', a.rel ? RX_REL.exec(a.rel) : null, a.antecipar);
    if(a.tipo === 'confirmarApagar'){ ESPERA = { sim:{ tipo:'apagar', id:it.id } }; return R(`Quer que eu desmarque “${it.titulo}” (${quandoTxt(it.data, it.hora)})?`, { cards:[card(it)], opcoes:[{ rotulo:'Sim, desmarcar', acao:{ tipo:'apagar', id:it.id } }, { rotulo:'Não, deixa como está', acao:{ tipo:'nada' } }] }); }
    if(a.tipo === 'apagar'){ const t = it.titulo; apagar(it.id); return R(`Desmarquei “${t}”.`, { cards:[{ id:it.id, titulo:t, apagado:true, podeDesfazer:true }] }); }
    if(a.tipo === 'concluir'){ const antes = { data:it.data, hora:it.hora, feito:it.feito, feitoEm:it.feitoEm || '' }; concluir(it, true); return R(`Marquei “${it.titulo}” como concluído.`, { cards:[card(it, { antes, podeDesfazer:true })] }); }
    return R('Não consegui fazer isso agora.');
  }

  // desfazer: volta como estava (mudança, conclusão, desmarcação ou item novo)
  function desfazerCard(c){
    if(c.apagado) return voltarApagado(c.id);
    if(c.antes) return restaurar(c.id, c.antes);
    return S.desfazer(c.id);
  }

  // quando ela faz uma pergunta ("para quando eu passo?"), guarda para entender a resposta seguinte
  const guardarEspera = r => { if(r && r.esperar) ESPERA = r.esperar; return r; };
  const conversarExp = t => guardarEspera(conversar(t));
  const executarExp = a => guardarEspera(executar(a));
  Object.assign(S, { conversar: conversarExp, executar: executarExp, desfazerCard, falaParaTexto, alterar, restaurar });
})();
