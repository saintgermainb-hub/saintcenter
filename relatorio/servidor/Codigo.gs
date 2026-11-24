/* =====================================================================
   Saint Center · Relatório Diário — servidor (Google Apps Script)
   ---------------------------------------------------------------------
   Como instalar (uma vez só):
   1. script.google.com > Novo projeto > nome "Saint Center · Relatório Diário".
   2. Apague o conteúdo de Código.gs e cole este arquivo inteiro. Salve.
   3. Implantar > Nova implantação > tipo "App da Web"
        Executar como: Eu  ·  Quem pode acessar: Qualquer pessoa
      Autorize quando o Google pedir.
   4. Copie o link que termina em /exec e cole em relatorio/index.html,
      na linha  const API = '...'.
   A planilha onde os dados ficam é criada sozinha no seu Drive
   ("Saint Center · Relatório Diário (dados)") na primeira vez que alguém usar.
   O login é o mesmo do Saint Center: este servidor confere a sessão lá.
   ===================================================================== */

const SC_API = 'https://script.google.com/macros/s/AKfycbyWR9ceeCuNbgk_yjyzn-8mCQwCgpSVpFrn3gvsS2HGniMxP14pNNmVIRXLGqP8_F3g/exec';
const MOD_KEYS = ['relatoriodiario', 'relatorio']; // chave do sistema em Administração > Sistemas (criada a partir do nome "Relatório Diário")

const MOTIVOS_RA_PADRAO = ['Atraso', 'Defeito', 'Troca/devolução', 'Reembolso', 'Atraso no envio', 'Erro de expedição',
  'Cupom', 'Erro de suporte', 'Acareação', 'Dúvidas/ajuda'];
const EQUIPES = ['suporte', 'ra', 'lentes'];

/* ---------------- entrada ---------------- */
function doPost(e) {
  let saida;
  try {
    const req = JSON.parse(e.postData.contents || '{}');
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
  return ContentService.createTextOutput('Saint Center · Relatório Diário: servidor no ar.');
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
    cache.put(ck, JSON.stringify(u), 300);
  }
  if (!u || !u.login) throw new Error('Sua sessão expirou. Entre de novo pelo Saint Center.');
  if (u.ativo === false) throw new Error('Seu acesso está desativado.');
  const perms = u.perms || {};
  let nivel = '';
  MOD_KEYS.forEach(k => { if (!nivel && perms[k]) nivel = perms[k]; });
  if (!nivel) Object.keys(perms).forEach(k => { if (!nivel && /^relatorio/.test(k) && perms[k]) nivel = perms[k]; });
  const admin = nivel === 'admin' || !!u.centerAdmin;
  if (!admin && !nivel) throw new Error('Você ainda não tem acesso ao Relatório Diário. Fale com a coordenação.');
  const cfg = lerConfig();
  const p = admin ? { lentes: 'editar', ra: 'editar', relatorio: 'gerar', config: true }
    : Object.assign({ lentes: '', ra: '', relatorio: '' }, (cfg.acessos || {})[u.login] || {}, { config: false });
  p.incluirMotivo = admin || (p.ra === 'editar' && !!cfg.raPodeIncluir);
  registrarPessoa(u);
  return { token, u, admin, p, cfg };
}

/* ---------------- planilha ---------------- */
const ABAS = {
  dias: ['chave', 'data', 'secao', 'json', 'por', 'em'],
  ra: ['id', 'data', 'motivo', 'qtd', 'obs', 'por', 'em'],
  config: ['chave', 'json', 'por', 'em'],
  pessoas: ['login', 'nome', 'cargo', 'ultimo'],
  log: ['em', 'login', 'acao', 'detalhe']
};
function planilha() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('PLANILHA');
  let ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (_) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('Saint Center · Relatório Diário (dados)');
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
function checarData(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d || ''))) throw new Error('Data inválida.');
  return String(d);
}

/* ---------------- config e pessoas ---------------- */
function lerConfig() {
  const cache = CacheService.getScriptCache();
  const c = cache.get('cfg');
  if (c) return JSON.parse(c);
  const r = acharLinha('config', 'geral');
  let cfg = {};
  if (r) { try { cfg = JSON.parse(aba('config').getRange(r, 2).getValue() || '{}'); } catch (_) { cfg = {}; } }
  cfg.motivosRA = Array.isArray(cfg.motivosRA) && cfg.motivosRA.length ? cfg.motivosRA : MOTIVOS_RA_PADRAO.slice();
  cfg.acessos = cfg.acessos || {};
  cache.put('cfg', JSON.stringify(cfg), 120);
  return cfg;
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
  } catch (_) { }
}

/* ---------------- leitura ---------------- */
function lerSecao(data, secao) {
  const r = acharLinha('dias', data + '|' + secao);
  if (!r) return null;
  const v = aba('dias').getRange(r, 1, 1, 6).getValues()[0];
  let obj = null;
  try { obj = JSON.parse(v[3] || 'null'); } catch (_) { obj = null; }
  if (obj) { obj._por = v[4]; obj._em = v[5]; }
  return obj;
}
function gravarSecao(ctx, data, secao, obj) {
  return travar(() => {
    const chave = data + '|' + secao;
    const row = [chave, data, secao, JSON.stringify(obj), ctx.u.nome || ctx.u.login, agora()];
    const r = acharLinha('dias', chave);
    if (r) aba('dias').getRange(r, 1, 1, 6).setValues([row]);
    else aba('dias').appendRow(row);
    log(ctx, 'salvar ' + secao, data);
    return { _por: row[4], _em: row[5] };
  });
}
function lancamentosRA(data) {
  return linhas('ra').filter(l => String(l[1]) === data).map(l => ({
    id: String(l[0]), motivo: String(l[2]), qtd: Number(l[3]) || 0, obs: String(l[4] || ''), por: String(l[5] || ''), em: String(l[6] || '')
  }));
}
function filaAnterior(data) {
  // última "sem resolução" salva nos 7 dias antes da data
  const d = new Date(data + 'T12:00:00Z');
  for (let i = 1; i <= 7; i++) {
    const x = new Date(d.getTime() - i * 864e5).toISOString().slice(0, 10);
    const s = lerSecao(x, 'suporte');
    if (s && s.semResolucao != null && s.semResolucao !== '') return { data: x, valor: Number(s.semResolucao) };
  }
  return null;
}

/* ---------------- funções chamadas pela página ---------------- */
const API_FN = {
  iniciar(ctx) {
    const r = { eu: { login: ctx.u.login, nome: ctx.u.nome, cargo: ctx.u.cargo || '' }, admin: ctx.admin, p: ctx.p, motivosRA: ctx.cfg.motivosRA };
    if (ctx.admin) r.config = ctx.cfg;
    return r;
  },

  dia(ctx, data) {
    data = checarData(data);
    const p = ctx.p, r = { data };
    const veRel = !!p.relatorio;
    if (p.lentes || veRel) r.lentes = lerSecao(data, 'lentes');
    if (p.ra || veRel) { r.ra = lancamentosRA(data); r.raInfo = lerSecao(data, 'rainfo'); }
    if (veRel) {
      r.suporte = lerSecao(data, 'suporte');
      r.equipes = lerSecao(data, 'equipes');
      r.filaAnterior = filaAnterior(data);
    }
    return r;
  },

  salvarLentes(ctx, data, obj) {
    data = checarData(data);
    if (ctx.p.lentes !== 'editar') throw new Error('Você pode ver, mas não editar, os números de Lentes.');
    const campos = ['entraram', 'prime', 'iguacu', 'repro', 'tratativa', 'pendentes', 'cancelamentos'];
    const limpo = {};
    campos.forEach(k => { const v = obj && obj[k]; limpo[k] = (v === '' || v == null) ? '' : Math.max(0, Math.round(Number(v) || 0)); });
    limpo.obs = String((obj && obj.obs) || '').slice(0, 400);
    limpo.parouEm = String((obj && obj.parouEm) || '').trim().slice(0, 120);
    return gravarSecao(ctx, data, 'lentes', limpo);
  },

  raAdicionar(ctx, data, motivo, qtd, obs) {
    data = checarData(data);
    if (ctx.p.ra !== 'editar') throw new Error('Você pode ver, mas não lançar, reclamações do Reclame Aqui.');
    motivo = String(motivo || '').trim().slice(0, 60);
    if (!motivo) throw new Error('Escolha o motivo.');
    qtd = Math.max(1, Math.min(500, Math.round(Number(qtd) || 1)));
    const id = Utilities.getUuid().slice(0, 12);
    travar(() => aba('ra').appendRow([id, data, motivo, qtd, String(obs || '').slice(0, 200), ctx.u.nome || ctx.u.login, agora()]));
    log(ctx, 'ra +' + qtd, data + ' ' + motivo);
    return lancamentosRA(data);
  },

  salvarRAInfo(ctx, data, obj) {
    data = checarData(data);
    if (ctx.p.ra !== 'editar') throw new Error('Você pode ver, mas não editar, o Reclame Aqui.');
    const v = obj && obj.semResposta;
    return gravarSecao(ctx, data, 'rainfo', { semResposta: (v === '' || v == null) ? '' : Math.max(0, Math.round(Number(v) || 0)) });
  },

  raRemover(ctx, data, id) {
    data = checarData(data);
    if (ctx.p.ra !== 'editar') throw new Error('Você não pode apagar lançamentos do Reclame Aqui.');
    travar(() => { const r = acharLinha('ra', id); if (r) aba('ra').deleteRow(r); });
    log(ctx, 'ra apagar', data + ' ' + id);
    return lancamentosRA(data);
  },

  salvarSuporte(ctx, data, obj) {
    data = checarData(data);
    if (ctx.p.relatorio !== 'gerar') throw new Error('Só a supervisão sobe o relatório do AvantDesk.');
    return gravarSecao(ctx, data, 'suporte', limparObj(obj));
  },

  salvarEquipes(ctx, data, obj) {
    data = checarData(data);
    if (ctx.p.relatorio !== 'gerar') throw new Error('Só a supervisão informa a composição das equipes.');
    const limpo = {};
    EQUIPES.forEach(k => {
      const e = (obj && obj[k]) || {};
      limpo[k] = {};
      ['pessoas', 'free5', 'free10', 'atestado', 'faltou'].forEach(c => {
        const v = e[c]; limpo[k][c] = (v === '' || v == null) ? '' : Math.max(0, Math.round(Number(v) || 0));
      });
    });
    return gravarSecao(ctx, data, 'equipes', limpo);
  },

  salvarConfig(ctx, cfg) {
    if (!ctx.p.config) throw new Error('Só a coordenação configura o Relatório Diário.');
    const nivelOk = { lentes: ['', 'ver', 'editar'], ra: ['', 'ver', 'editar'], relatorio: ['', 'ver', 'gerar'] };
    const acessos = {};
    Object.keys((cfg && cfg.acessos) || {}).forEach(login => {
      const a = cfg.acessos[login] || {}, o = {};
      Object.keys(nivelOk).forEach(k => { o[k] = nivelOk[k].indexOf(a[k] || '') >= 0 ? (a[k] || '') : ''; });
      acessos[String(login)] = o;
    });
    const motivos = ((cfg && cfg.motivosRA) || []).map(m => String(m).trim().slice(0, 60)).filter(Boolean);
    const novo = { motivosRA: motivos.length ? motivos : MOTIVOS_RA_PADRAO.slice(), acessos, raPodeIncluir: !!(cfg && cfg.raPodeIncluir) };
    travar(() => {
      const row = ['geral', JSON.stringify(novo), ctx.u.nome || ctx.u.login, agora()];
      const r = acharLinha('config', 'geral');
      if (r) aba('config').getRange(r, 1, 1, 4).setValues([row]); else aba('config').appendRow(row);
    });
    CacheService.getScriptCache().remove('cfg');
    log(ctx, 'config', '');
    return novo;
  },

  raNovoMotivo(ctx, nome) {
    if (!ctx.p.incluirMotivo) throw new Error('Os motivos são fixos. Peça para a coordenação incluir um motivo novo.');
    nome = String(nome || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    if (!nome) throw new Error('Escreva o motivo.');
    return travar(() => {
      CacheService.getScriptCache().remove('cfg');
      const cfg = lerConfig();
      if (!cfg.motivosRA.some(m => m.toLowerCase() === nome.toLowerCase())) cfg.motivosRA.push(nome);
      const row = ['geral', JSON.stringify(cfg), ctx.u.nome || ctx.u.login, agora()];
      const r = acharLinha('config', 'geral');
      if (r) aba('config').getRange(r, 1, 1, 4).setValues([row]); else aba('config').appendRow(row);
      CacheService.getScriptCache().remove('cfg');
      log(ctx, 'novo motivo RA', nome);
      return cfg.motivosRA;
    });
  },

  pessoas(ctx) {
    if (!ctx.p.config) throw new Error('Só a coordenação vê a lista.');
    return linhas('pessoas').map(l => ({ login: String(l[0]), nome: String(l[1]), cargo: String(l[2]), ultimo: String(l[3]) }));
  },

  serie(ctx, de, ate) {
    if (!ctx.p.relatorio) throw new Error('Você não tem acesso à evolução do relatório.');
    de = checarData(de); ate = checarData(ate);
    if (de > ate) { const t = de; de = ate; ate = t; }
    if ((new Date(ate) - new Date(de)) / 864e5 > 400) throw new Error('Período grande demais (máximo 400 dias).');
    const dias = {}, ra = {};
    linhas('dias').forEach(l => {
      const d = String(l[1]), sec = String(l[2]);
      if (d < de || d > ate || (sec !== 'suporte' && sec !== 'lentes' && sec !== 'rainfo')) return;
      let o = null; try { o = JSON.parse(l[3] || 'null'); } catch (_) { o = null; }
      if (!o) return;
      if (sec === 'suporte') o = { criados: o.criados, resolvidos: o.resolvidos, regua: o.regua, semResolucao: o.semResolucao,
        novo: o.novo, emAberto: o.emAberto, pendente: o.pendente, espera: o.espera, motivos: o.motivos || [] };
      (dias[d] = dias[d] || {})[sec] = o;
    });
    linhas('ra').forEach(l => {
      const d = String(l[1]); if (d < de || d > ate) return;
      const m = String(l[2]); ra[d] = ra[d] || {}; ra[d][m] = (ra[d][m] || 0) + (Number(l[3]) || 0);
    });
    return { de, ate, dias, ra };
  },

  diasPreenchidos(ctx, mes) {
    if (!/^\d{4}-\d{2}$/.test(String(mes || ''))) throw new Error('Mês inválido.');
    const out = {};
    linhas('dias').forEach(l => { if (String(l[1]).indexOf(mes) === 0) { (out[l[1]] = out[l[1]] || {})[l[2]] = true; } });
    linhas('ra').forEach(l => { if (String(l[1]).indexOf(mes) === 0) { (out[l[1]] = out[l[1]] || {}).ra = true; } });
    return out;
  }
};

function limparObj(o) {
  // guarda só números, textos curtos e listas simples (vindos do PDF do AvantDesk)
  const s = JSON.stringify(o || {});
  if (s.length > 20000) throw new Error('Dados grandes demais.');
  return JSON.parse(s);
}
