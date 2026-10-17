// Keeps the whole app (home page and every form) on the phone so it opens without internet.
// After uploading changed files, change VERSION (app-v1 -> app-v2) so phones pick up the new version.
const VERSION='pmj-app-v3';
const FILES=['./','index.html','mmu.html','awc.html','vdvk.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET' || new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(caches.open(VERSION).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{ if(r&&r.ok) c.put(e.request,r.clone()); return r; }).catch(()=>hit||c.match('index.html'));
    return hit||net;
  })));
});
