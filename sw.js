// Keeps the whole app (home page and every form) on the phone so it opens without internet.
// With internet, pages always come fresh from GitHub, so uploaded changes show on the next open.
// Without internet, the copy saved on the phone is used.
// After uploading changed files, you can still change VERSION (pmj-app-v5 -> pmj-app-v6) to clear old copies.
const VERSION='pmj-app-v5';
const FILES=['./','index.html','mmu.html','awc.html','vdvk.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET' || new URL(e.request.url).origin!==location.origin) return;
  // Network first: get the newest page and keep a copy; fall back to the saved copy when offline.
  e.respondWith(caches.open(VERSION).then(c=>
    fetch(e.request,{cache:'no-store'}).then(r=>{ if(r&&r.ok) c.put(e.request,r.clone()); return r; })
      .catch(()=>c.match(e.request,{ignoreSearch:true}).then(hit=>hit||c.match('index.html')))
  ));
});
