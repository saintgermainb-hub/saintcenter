/* =====================================================================
   Saint Center · Mural de Avisos — servidor (Google Apps Script)
   ---------------------------------------------------------------------
   Como instalar (uma vez só):
   1. script.google.com > Novo projeto > nome "Saint Center · Mural de Avisos".
   2. Apague o conteúdo de Código.gs e cole este arquivo inteiro. Salve.
   3. Implantar > Nova implantação > tipo "App da Web"
        Executar como: Eu  ·  Quem pode acessar: Qualquer pessoa
      Autorize quando o Google pedir.
   4. Copie o link que termina em /exec e cole em mural/config.js.
   A planilha com os avisos e as leituras é criada sozinha no seu Drive
   ("Saint Center · Mural de Avisos (dados)") na primeira vez que alguém usar.
   O login é o mesmo do Saint Center: este servidor confere a sessão lá.

   Quem publica: coordenação (admin do Saint Center), quem tem o nível
   "Publicar" no Mural em Pessoas e acessos, e quem tem cargo de
   supervisão, liderança ou coordenação. O resto do time só lê.
   ===================================================================== */

const SC_API = 'https://script.google.com/macros/s/AKfycbyWR9ceeCuNbgk_yjyzn-8mCQwCgpSVpFrn3gvsS2HGniMxP14pNNmVIRXLGqP8_F3g/exec';
const CARGOS_QUE_PUBLICAM = /supervis|l[ií]der|lideran|coordena|gerente|gest[aã]o/i;
const CATEGORIAS_PADRAO = ['Geral', 'Processo', 'Operação', 'Escala e turnos', 'RH', 'Sistemas', 'Reconhecimento'];

/* ---------------- entrada ---------------- */
function doPost(e) {
  let saida;
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const fn = API_FN[req.fn];
    if (!fn) throw new Error('Função desconhecida: ' + req.fn);
    const args = req.args || [];
    const ctx = sessao(args[0]);
    saida = { ok: true, resultado: fn(ctx, ...args.slice(1)) };
  } catch (er) {
    saida = { ok: false, erro: er.message || String(er) };
  }
  return ContentService.createTextOutput(JSON.stringify(saida)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  return ContentService.createTextOutput('Saint Center · Mural de Avisos: servidor no ar.');
}

/* ---------------- sessão (login do Saint Center) ---------------- */
function sessao(token) {
  if (!token) throw new Error('Sua sessão expirou. Entre de novo pelo Saint Center.');
  const cache = CacheService.getScriptCache();
  const ck = 'tk:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token));
  let u = null;
  const c = cache.get(ck);
  if (c) u = JSON.parse(c);
  else {
    const r = UrlFetchApp.fetch(SC_API, {
      method: 'post', contentType: 'text/plain;charset=utf-8', muteHttpExceptions: true, followRedirects: true,
      payload: JSON.stringify({ fn: 'eu', args: [token] })
    });
    let j;
    try { j = JSON.parse(r.getContentText()); } catch (_) { throw new Error('Não consegui conferir seu login no Saint Center. Tente de novo.'); }
    if (!j.ok) throw new Error(j.erro || 'Sua sessão expirou. Entre de novo pelo Saint Center.');
    u = (j.resultado && j.resultado.usuario) || j.resultado;
    cache.put(ck, JSON.stringify(u), 600);
  }
  if (!u || !u.login) throw new Error('Sua sessão expirou. Entre de novo pelo Saint Center.');
  if (u.ativo === false) throw new Error('Seu acesso está desativado.');
  const perms = u.perms || {};
  let nivel = '';
  Object.keys(perms).forEach(k => { if (!nivel && /^mural/.test(k) && perms[k]) nivel = perms[k]; });
  const publica = !!u.centerAdmin || nivel === 'admin' || CARGOS_QUE_PUBLICAM.test(String(u.cargo || ''));
  registrarPessoa(u);
  if (u.centerAdmin) atualizarEquipe(token);
  return { token, u, publica };
}
function exigirPublica(ctx) {
  if (!ctx.publica) throw new Error('Só supervisão, liderança e coordenação podem publicar no mural.');
}

/* ---------------- planilha ---------------- */
const ABAS = {
  avisos: ['id', 'titulo', 'texto', 'categoria', 'prioridade', 'fixado', 'link', 'autorLogin', 'autorNome', 'criadoEm', 'editadoEm', 'status', 'expiraEm'],
  leituras: ['chave', 'avisoId', 'login', 'nome', 'em'],
  pessoas: ['login', 'nome', 'cargo', 'ultimo'],
  config: ['chave', 'json'],
  log: ['em', 'login', 'acao', 'detalhe']
};
function planilha() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PLANILHA');
  let ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (_) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('Saint Center · Mural de Avisos (dados)');
    props.setProperty('PLANILHA', ss.getId());
  }
  return ss;
}
function aba(nome) {
  const ss = planilha();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.getRange(1, 1, 1, ABAS[nome].length).setValues([ABAS[nome]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:Z').setNumberFormat('@');
    const s1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Página1') || ss.getSheetByName('Planilha1');
    if (s1 && ss.getSheets().length > 1) ss.deleteSheet(s1);
  }
  return sh;
}
function linhas(nome) {
  const sh = aba(nome);
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, ABAS[nome].length).getValues();
}
function acharLinha(nome, chave) {
  const sh = aba(nome);
  if (sh.getLastRow() < 2) return 0;
  const f = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(chave)).matchEntireCell(true).findNext();
  return f ? f.getRow() : 0;
}
function travar(fn) {
  const l = LockService.getScriptLock();
  if (!l.tryLock(15000)) throw new Error('Muitas gravações agora. Tente de novo em alguns segundos.');
  try { return fn(); } finally { l.releaseLock(); }
}
function agora() { return new Date().toISOString(); }
function log(ctx, acao, detalhe) {
  try { aba('log').appendRow([agora(), ctx.u.login, acao, String(detalhe || '').slice(0, 500)]); } catch (_) { }
}
function registrarPessoa(u) {
  const cache = CacheService.getScriptCache();
  if (cache.get('p:' + u.login)) return;
  cache.put('p:' + u.login, '1', 3600);
  try {
    travar(() => {
      const r = acharLinha('pessoas', u.login);
      const row = [u.login, u.nome || u.login, u.cargo || '', agora()];
      if (r) aba('pessoas').getRange(r, 1, 1, 4).setValues([row]);
      else aba('pessoas').appendRow(row);
    });
    CacheService.getScriptCache().remove('pessoas');
  } catch (_) { }
}

/* ---------------- equipe do Saint Center ----------------
   "Todos" = pessoas ativas em Pessoas e acessos. A lista é atualizada sempre que a
   coordenação usa o mural (no máximo a cada 20 min) e fica guardada aqui. */
function atualizarEquipe(token) {
  try {
    const props = PropertiesService.getScriptProperties();
    const atual = JSON.parse(props.getProperty('EQUIPE') || 'null');
    if (atual && Date.now() - atual.em < 20 * 60000) return;
    const r = UrlFetchApp.fetch(SC_API, {
      method: 'post', contentType: 'text/plain;charset=utf-8', muteHttpExceptions: true, followRedirects: true,
      payload: JSON.stringify({ fn: 'listarPessoas', args: [token] })
    });
    const j = JSON.parse(r.getContentText());
    if (!j.ok || !Array.isArray(j.resultado)) return;
    const lista = j.resultado.filter(p => p && p.login && p.ativo !== false).map(p => ({ login: String(p.login), nome: String(p.nome || p.login), cargo: String(p.cargo || '') }));
    if (!lista.length) return;
    props.setProperty('EQUIPE', JSON.stringify({ em: Date.now(), lista }));
  } catch (_) { }
}
/* quem precisa dar ciente: a equipe do Saint Center (ou, enquanto ela não foi lida, quem já abriu o mural) */
function equipe() {
  try {
    const e = JSON.parse(PropertiesService.getScriptProperties().getProperty('EQUIPE') || 'null');
    if (e && e.lista && e.lista.length) return e.lista;
  } catch (_) { }
  return todasPessoas();
}

/* ---------------- leitura com cache ---------------- */
function cacheJson(chave, seg, fn) {
  const cache = CacheService.getScriptCache();
  const c = cache.get(chave);
  if (c) return JSON.parse(c);
  const v = fn();
  try { cache.put(chave, JSON.stringify(v), seg); } catch (_) { } // acima de 100 KB o cache recusa: só lê da planilha
  return v;
}
function limparCache() { CacheService.getScriptCache().removeAll(['avisos', 'leituras', 'pessoas']); }

function todosAvisos() {
  return cacheJson('avisos', 600, () => linhas('avisos').map(l => ({
    id: String(l[0]), titulo: String(l[1] || ''), texto: String(l[2] || ''), categoria: String(l[3] || 'Geral'),
    prioridade: String(l[4] || 'normal'), fixado: String(l[5]) === 'sim', link: String(l[6] || ''),
    autorLogin: String(l[7] || ''), autorNome: String(l[8] || ''), criadoEm: String(l[9] || ''), editadoEm: String(l[10] || ''),
    status: String(l[11] || 'ativo'), expiraEm: String(l[12] || '')
  })));
}
/* leituras agrupadas: { avisoId: { login: em } } */
function todasLeituras() {
  return cacheJson('leituras', 600, () => {
    const m = {};
    linhas('leituras').forEach(l => { const a = String(l[1]); (m[a] = m[a] || {})[String(l[2])] = String(l[4] || ''); });
    return m;
  });
}
function todasPessoas() {
  return cacheJson('pessoas', 600, () => linhas('pessoas').map(l => ({ login: String(l[0]), nome: String(l[1] || l[0]), cargo: String(l[2] || '') })));
}
function lerConfig() {
  return cacheJson('cfg', 600, () => {
    const r = acharLinha('config', 'geral');
    let cfg = {};
    if (r) { try { cfg = JSON.parse(aba('config').getRange(r, 2).getValue() || '{}'); } catch (_) { cfg = {}; } }
    cfg.categorias = Array.isArray(cfg.categorias) && cfg.categorias.length ? cfg.categorias : CATEGORIAS_PADRAO.slice();
    return cfg;
  });
}

function expirado(a) { return a.expiraEm && a.expiraEm < agora().slice(0, 10); }

/* ---------------- funções chamadas pela página ---------------- */
function iniciar(ctx) {
  const avisos = todosAvisos();
  const lei = todasLeituras();
  const lidos = {};
  avisos.forEach(a => { const x = lei[a.id] && lei[a.id][ctx.u.login]; if (x) lidos[a.id] = x; });
  const visiveis = avisos.filter(a => ctx.publica || (a.status === 'ativo' && !expirado(a)));
  const eq = equipe(), total = eq.length;
  return {
    eu: { login: ctx.u.login, nome: ctx.u.nome || ctx.u.login, cargo: ctx.u.cargo || '' },
    publica: ctx.publica,
    categorias: lerConfig().categorias,
    avisos: visiveis.map(a => {
      const l = lei[a.id] || {};
      const faltam = eq.filter(p => !l[p.login]).length; // enquanto faltar alguém, o aviso pisca no mural
      return Object.assign({}, a, { faltam }, ctx.publica ? { leram: total - faltam, pessoas: total } : {});
    }),
    lidos
  };
}

/* resumo leve para o Saint Center mostrar quantos avisos novos a pessoa tem */
function resumo(ctx) {
  const lei = todasLeituras();
  const novos = todosAvisos().filter(a => a.status === 'ativo' && !expirado(a) && !(lei[a.id] && lei[a.id][ctx.u.login]));
  return { novos: novos.length, urgentes: novos.filter(a => a.prioridade === 'urgente').length };
}

function limparAviso(d) {
  const titulo = String(d.titulo || '').trim().slice(0, 160);
  const texto = String(d.texto || '').trim().slice(0, 8000);
  if (!titulo) throw new Error('Dê um título ao aviso.');
  if (!texto) throw new Error('Escreva o aviso.');
  const prioridade = ['normal', 'importante', 'urgente'].indexOf(d.prioridade) >= 0 ? d.prioridade : 'normal';
  let link = String(d.link || '').trim().slice(0, 500);
  if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
  const expiraEm = /^\d{4}-\d{2}-\d{2}$/.test(String(d.expiraEm || '')) ? String(d.expiraEm) : '';
  return { titulo, texto, categoria: String(d.categoria || 'Geral').trim().slice(0, 40) || 'Geral', prioridade, fixado: !!d.fixado, link, expiraEm };
}

function publicar(ctx, dados) {
  exigirPublica(ctx);
  const a = limparAviso(dados || {});
  const id = 'A' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  travar(() => {
    aba('avisos').appendRow([id, a.titulo, a.texto, a.categoria, a.prioridade, a.fixado ? 'sim' : 'nao', a.link,
      ctx.u.login, ctx.u.nome || ctx.u.login, agora(), '', 'ativo', a.expiraEm]);
    // quem publica já fica como ciente
    aba('leituras').appendRow([id + '|' + ctx.u.login, id, ctx.u.login, ctx.u.nome || ctx.u.login, agora()]);
  });
  limparCache();
  log(ctx, 'publicou', a.titulo);
  return iniciar(ctx);
}

function editar(ctx, id, dados) {
  exigirPublica(ctx);
  const a = limparAviso(dados || {});
  travar(() => {
    const r = acharLinha('avisos', id);
    if (!r) throw new Error('Aviso não encontrado.');
    const sh = aba('avisos');
    sh.getRange(r, 2, 1, 6).setValues([[a.titulo, a.texto, a.categoria, a.prioridade, a.fixado ? 'sim' : 'nao', a.link]]);
    sh.getRange(r, 11).setValue(agora());
    sh.getRange(r, 13).setValue(a.expiraEm);
  });
  limparCache();
  log(ctx, 'editou', a.titulo);
  return iniciar(ctx);
}

function fixar(ctx, id, sim) {
  exigirPublica(ctx);
  travar(() => {
    const r = acharLinha('avisos', id);
    if (!r) throw new Error('Aviso não encontrado.');
    aba('avisos').getRange(r, 6).setValue(sim ? 'sim' : 'nao');
  });
  limparCache();
  return iniciar(ctx);
}

function arquivar(ctx, id, sim) {
  exigirPublica(ctx);
  travar(() => {
    const r = acharLinha('avisos', id);
    if (!r) throw new Error('Aviso não encontrado.');
    aba('avisos').getRange(r, 12).setValue(sim ? 'arquivado' : 'ativo');
  });
  limparCache();
  log(ctx, sim ? 'arquivou' : 'reativou', id);
  return iniciar(ctx);
}

function ciente(ctx, id) {
  const a = todosAvisos().find(x => x.id === String(id));
  if (!a) throw new Error('Aviso não encontrado.');
  const lei = todasLeituras();
  if (lei[a.id] && lei[a.id][ctx.u.login]) return { id: a.id, em: lei[a.id][ctx.u.login] };
  const em = agora();
  travar(() => {
    if (!acharLinha('leituras', a.id + '|' + ctx.u.login))
      aba('leituras').appendRow([a.id + '|' + ctx.u.login, a.id, ctx.u.login, ctx.u.nome || ctx.u.login, em]);
  });
  CacheService.getScriptCache().remove('leituras');
  return { id: a.id, em };
}

function leitores(ctx, id) {
  exigirPublica(ctx);
  const lei = todasLeituras()[String(id)] || {};
  const nomes = {};
  todasPessoas().forEach(p => nomes[p.login] = p.nome);
  linhas('leituras').forEach(l => { if (String(l[1]) === String(id)) nomes[String(l[2])] = nomes[String(l[2])] || String(l[3]); });
  const leram = Object.keys(lei).map(login => ({ login, nome: nomes[login] || login, em: lei[login] })).sort((a, b) => a.em < b.em ? -1 : 1);
  equipe().forEach(p => nomes[p.login] = nomes[p.login] || p.nome);
  const faltam = equipe().filter(p => !lei[p.login]).map(p => ({ login: p.login, nome: p.nome, cargo: p.cargo })).sort((a, b) => a.nome.localeCompare(b.nome));
  return { leram, faltam };
}

function salvarCategorias(ctx, lista) {
  exigirPublica(ctx);
  const cats = (Array.isArray(lista) ? lista : []).map(c => String(c || '').trim().slice(0, 40)).filter(Boolean);
  if (!cats.length) throw new Error('Deixe pelo menos uma categoria.');
  travar(() => {
    const cfg = lerConfig(); cfg.categorias = [...new Set(cats)];
    const r = acharLinha('config', 'geral');
    if (r) aba('config').getRange(r, 2).setValue(JSON.stringify(cfg));
    else aba('config').appendRow(['geral', JSON.stringify(cfg)]);
  });
  CacheService.getScriptCache().remove('cfg');
  return lerConfig().categorias;
}

const API_FN = { iniciar, resumo, publicar, editar, fixar, arquivar, ciente, leitores, salvarCategorias };
