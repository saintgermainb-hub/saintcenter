/* Secretária · Agenda Coordenação — abre rápido e recebe os avisos (notificações) */
const CACHE = 'secretaria-v3';
const API = 'https://script.google.com/macros/s/AKfycbyWR9ceeCuNbgk_yjyzn-8mCQwCgpSVpFrn3gvsS2HGniMxP14pNNmVIRXLGqP8_F3g/exec';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// abre na hora com o que já está guardado e atualiza por trás (na próxima abertura já vem a versão nova)
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const guardado = await c.match(e.request, { ignoreSearch: true });
    const rede = fetch(e.request).then(r => { if(r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => guardado);
    if(guardado){ e.waitUntil(rede.catch(() => {})); return guardado; }
    return rede;
  }));
});

// código do aparelho guardado pelo aplicativo (o service worker não lê o localStorage)
function lerCodigo(){
  return new Promise(ok => {
    const r = indexedDB.open('sg-secretaria', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('cfg');
    r.onsuccess = () => { try{ const g = r.result.transaction('cfg').objectStore('cfg').get('codigo'); g.onsuccess = () => ok(g.result || ''); g.onerror = () => ok(''); }catch(_){ ok(''); } };
    r.onerror = () => ok('');
  });
}
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let titulo = 'Secretária', texto = 'Tem coisa na sua agenda precisando de atenção.';
    try{
      const cod = await lerCodigo();
      if(cod){
        const r = await fetch(API, { method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body: JSON.stringify({ fn:'agendaAvisoPendente', args:[cod] }) });
        const j = await r.json();
        if(j.ok && j.resultado && j.resultado.texto){ titulo = j.resultado.titulo || titulo; texto = j.resultado.texto; }
      }
    }catch(_){}
    await self.registration.showNotification(titulo, { body: texto, icon: 'icone-192.png', badge: 'icone-192.png', tag: 'secretaria', renotify: true, data: { url: './?aviso=1' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    for(const c of cs){ if('focus' in c){ c.postMessage({ aviso:true }); return c.focus(); } }
    return self.clients.openWindow('./?aviso=1');
  })());
});
