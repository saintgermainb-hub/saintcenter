/* Agenda Coordenação · sincronização entre computador e celular (servidor do Saint Center) */
(function(){
  if(typeof LIBERADO === 'undefined' || !LIBERADO) return;
  const API = 'https://script.google.com/macros/s/AKfycbyWR9ceeCuNbgk_yjyzn-8mCQwCgpSVpFrn3gvsS2HGniMxP14pNNmVIRXLGqP8_F3g/exec';
  const KBASE = CHAVE + ':base', KEM = CHAVE + ':base-em';
  const token = () => localStorage.getItem('sg-agenda-app-codigo') || localStorage.getItem('sc-token') || '';

  /* ---------- selo discreto ---------- */
  const css = document.createElement('style');
  css.textContent = `.sync-selo{position:fixed;left:16px;bottom:14px;z-index:30;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#aea9b4;display:flex;align-items:center;gap:6px;pointer-events:none}
    .sync-selo i{width:6px;height:6px;border-radius:50%;background:#aea9b4;display:inline-block}
    .sync-selo.ok i{background:#ff5cb8}.sync-selo.erro{color:#c2187a}.sync-selo.erro i{background:#c2187a}
    .sync-selo.ind i{animation:neon 1.1s ease-in-out infinite}`;
  document.head.appendChild(css);
  const selo = document.createElement('div'); selo.className = 'sync-selo'; selo.innerHTML = '<i></i><span>Conectando</span>';
  document.body.appendChild(selo);
  function estado(cls, txt){ selo.className = 'sync-selo ' + cls; selo.lastChild.textContent = txt; window.dispatchEvent(new CustomEvent('sg-agenda-sync', { detail:{ cls, txt } })); }

  async function call(fn, ...args){
    const r = await fetch(API, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({fn, args:[token()].concat(args)}) });
    const j = await r.json();
    if(!j.ok) throw Object.assign(new Error(j.erro || 'Erro'), { servidor:true });
    return j.resultado;
  }

  /* ---------- junção: o que mudou de cada lado desde a última sincronização ---------- */
  const S = v => v === undefined ? undefined : JSON.stringify(v);
  function juntarLista(b, l, r){
    const mb = new Map((b||[]).map(x => [x.id, x])), ml = new Map((l||[]).map(x => [x.id, x])), mr = new Map((r||[]).map(x => [x.id, x]));
    const ordem = [], visto = new Set();
    (r||[]).concat(l||[]).forEach(x => { if(x && !visto.has(x.id)){ visto.add(x.id); ordem.push(x.id); } });
    const out = [];
    ordem.forEach(id => {
      const bi = S(mb.get(id)), li = S(ml.get(id)), ri = S(mr.get(id));
      let v;
      if(li === bi) v = mr.get(id);            // só mudou (ou foi apagado) do outro lado
      else if(ri === bi) v = ml.get(id);       // só mudou aqui
      else v = ml.has(id) ? ml.get(id) : mr.get(id); // mudou dos dois lados: fica o deste aparelho
      if(v) out.push(v);
    });
    return out;
  }
  function juntar(b, l, r){
    b = b || {}; const o = {};
    new Set(Object.keys(l).concat(Object.keys(r))).forEach(k => {
      if(Array.isArray(l[k]) && Array.isArray(r[k]) && (l[k].concat(r[k])).every(x => x && x.id)) o[k] = juntarLista(b[k], l[k], r[k]);
      else o[k] = S(l[k]) === S(b[k]) ? r[k] : l[k];
    });
    if(!Array.isArray(o.itens)) o.itens = []; if(!Array.isArray(o.entradas)) o.entradas = [];
    return o;
  }

  const salvarLocal = salvar;
  let base = null; try{ base = JSON.parse(localStorage.getItem(KBASE) || 'null'); }catch(_){}
  let baseEm = Number(localStorage.getItem(KEM) || 0);
  function guardarBase(txt, em){ base = JSON.parse(txt); baseEm = em; try{ localStorage.setItem(KBASE, txt); localStorage.setItem(KEM, String(em)); }catch(_){} }
  const ocupado = () => !!document.querySelector('dialog[open]') || (document.activeElement && /TEXTAREA|INPUT/.test(document.activeElement.tagName) && document.activeElement.value);

  function aplicar(novo){ DB = novo; salvarLocal(); try{ render(); }catch(_){} }

  let enviando = false, deNovo = false, tEnvio = null, pausado = false;
  async function enviar(){
    if(pausado) return;
    if(enviando){ deNovo = true; return; }
    enviando = true; estado('ind', 'Salvando');
    try{
      for(let t = 0; t < 4; t++){
        const txt = JSON.stringify(DB);
        if(base && txt === JSON.stringify(base)){ estado('ok', 'Sincronizado'); break; }
        const r = await call('agendaSalvar', txt, baseEm);
        if(!r.conflito){ guardarBase(txt, r.em); estado('ok', 'Sincronizado'); break; }
        const s = await call('agendaLer');                     // alguém salvou antes (o outro aparelho): junta e tenta de novo
        const remoto = s.dados ? JSON.parse(s.dados) : { itens:[], entradas:[] };
        const junto = juntar(base, DB, remoto);
        guardarBase(s.dados || '{"itens":[],"entradas":[]}', s.em);
        aplicar(junto);
      }
    }catch(e){ falhou(e); }
    enviando = false;
    if(deNovo){ deNovo = false; enviar(); }
  }
  async function puxar(forcar){
    if(pausado || enviando || (!forcar && ocupado())) return;
    try{
      const s = await call('agendaLer');
      if(!s.dados){ enviar(); return; }                         // primeira vez: leva esta agenda para o servidor
      if(s.em === baseEm && base){ if(JSON.stringify(DB) !== JSON.stringify(base)) enviar(); else estado('ok', 'Sincronizado'); return; }
      const remoto = JSON.parse(s.dados);
      const junto = juntar(base, DB, remoto);
      guardarBase(s.dados, s.em);
      if(JSON.stringify(junto) !== JSON.stringify(DB)) aplicar(junto);
      if(JSON.stringify(junto) !== s.dados) enviar(); else estado('ok', 'Sincronizado');
    }catch(e){ falhou(e); }
  }
  function falhou(e){
    const m = String(e && e.message || '');
    if(/desconhecida/i.test(m)){ pausado = true; estado('', 'Só neste aparelho'); return; }      // servidor ainda sem a agenda
    if(/sess[aã]o expirou|entre novamente|desativado|nova senha/i.test(m)){ pausado = true; estado('erro', 'Entre de novo para sincronizar'); window.dispatchEvent(new CustomEvent('sg-agenda-sessao')); return; }
    estado('erro', 'Sem conexão · tento de novo');
  }

  salvar = function(){ salvarLocal(); clearTimeout(tEnvio); tEnvio = setTimeout(enviar, 1200); };
  window.SG_nuvem = { call, ativo: () => !pausado && !!token() };
  window.SG_sync = { puxar:() => puxar(true), enviar, retomar(){ pausado = false; puxar(true); } };

  if(!token()){ estado('', 'Só neste aparelho'); return; }
  puxar(true);
  setInterval(() => { if(document.visibilityState === 'visible') puxar(false); }, 45000);
  document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') puxar(false); });
  window.addEventListener('focus', () => puxar(false));
})();
