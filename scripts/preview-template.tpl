<title>Règlement New Los Santos</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400&display=swap">
<style>
:root{
  color-scheme:dark;
  --ground:#0b0b0a; --surface:#141412; --side:#101010; --ink:#ecece4; --muted:#a3a396; --line:#2a2a24;
  --nls:#e8e81c; --legal:#2fae27; --illegal:#d42323;
  --accent:var(--nls); --accent-soft:rgba(232,232,28,.12); --focus:var(--nls);
  --info-bg:#12202c; --info-bd:#6fa8dc; --warn-bg:#262108; --warn-bd:#e8e81c;
  --danger-bg:#2a0f0f; --danger-bd:#ef5a5a; --ok-bg:#0f2410; --ok-bd:#46c93d;
  --display:"Barlow Condensed","Arial Narrow",Arial,sans-serif;
  --body:"Source Sans 3","Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,Consolas,monospace;
}
.page.side-legal{--accent:var(--legal);--accent-soft:rgba(47,174,39,.14)}
.page.side-illegal{--accent:var(--illegal);--accent-soft:rgba(212,35,35,.14)}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.6}
a{color:var(--accent)}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--focus);outline-offset:2px}

.topbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;display:flex;align-items:center;gap:12px;
  padding:10px 16px;background:var(--surface);border-bottom:1px solid var(--line)}
.brand{font-family:var(--display);font-weight:700;font-size:22px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink);text-decoration:none;white-space:nowrap}
.brand span{color:var(--accent)}
.draft{margin-left:auto;font-size:13px;color:var(--muted);border:1px dashed var(--line);padding:3px 10px;border-radius:999px;white-space:nowrap}
.menu-btn{display:none;background:none;border:1px solid var(--line);color:var(--ink);border-radius:6px;padding:6px 10px;font:inherit;font-size:14px;cursor:pointer}

.layout{display:grid;grid-template-columns:280px minmax(0,1fr);min-height:calc(100% - 56px)}
.side{background:var(--side);border-right:1px solid var(--line);padding:20px 16px 40px;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto}
.search{width:100%;font:inherit;font-size:15px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);margin-bottom:6px}
.search-note{font-size:13px;color:var(--muted);margin:0 0 14px;min-height:1.2em}
.nav-group{margin-bottom:18px}
.nav-title{font-family:var(--display);font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:var(--muted);margin:0 0 4px}
.side ul{list-style:none;margin:0;padding:0}
.side li a{display:block;padding:5px 10px;border-radius:5px;color:var(--ink);text-decoration:none;font-size:15px;line-height:1.35}
.side li.sub a{padding-left:24px;font-size:14px;color:var(--muted)}
.side li a:hover{background:var(--accent-soft)}
.side li a[aria-current="page"]{background:var(--accent-soft);color:var(--accent);font-weight:600}
.side li[hidden]{display:none}

main{padding-block:32px 80px;padding-inline:clamp(16px,5vw,64px)}
.page{max-width:760px}
.crumb{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px;display:flex;flex-wrap:wrap;gap:10px;align-items:baseline}
.crumb .file{font-family:var(--mono);text-transform:none;letter-spacing:0;font-size:12px;opacity:.8}
.page h1{font-family:var(--display);font-weight:700;font-size:clamp(34px,5vw,46px);line-height:1.05;letter-spacing:.01em;margin:0 0 16px;text-wrap:balance}
.page h2{font-family:var(--display);font-weight:700;font-size:28px;line-height:1.15;margin:40px 0 10px;text-wrap:balance;padding-bottom:6px;border-bottom:1px solid var(--line)}
.page h3{font-family:var(--display);font-weight:600;font-size:22px;margin:28px 0 6px}
.lede{font-size:19px;color:var(--muted);margin-top:-6px}
.page p,.page li{max-width:68ch}
.page ul,.page ol{padding-left:1.3em}
.page li{margin:4px 0}
.page code{font-family:var(--mono);font-size:.85em;background:var(--accent-soft);padding:1px 5px;border-radius:4px}
.page strong{font-weight:700}
.table-wrap{overflow-x:auto;margin:16px 0;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
.page table{border-collapse:collapse;width:100%;font-size:15px}
.page th,.page td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.page th{font-weight:700;background:var(--side)}
.page tr:last-child td{border-bottom:0}

.hint{margin:18px 0;padding:12px 16px;border-left:4px solid var(--info-bd);background:var(--info-bg);border-radius:0 8px 8px 0}
.hint p{margin:.3em 0}
.hint-label{display:block;font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:var(--info-bd)}
.hint-warning{border-color:var(--warn-bd);background:var(--warn-bg)} .hint-warning .hint-label{color:var(--warn-bd)}
.hint-danger{border-color:var(--danger-bd);background:var(--danger-bg)} .hint-danger .hint-label{color:var(--danger-bd)}
.hint-success{border-color:var(--ok-bd);background:var(--ok-bg)} .hint-success .hint-label{color:var(--ok-bd)}

.pager{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:56px}
.pager a{display:block;border:1px solid var(--line);border-radius:8px;padding:12px 14px;text-decoration:none;color:var(--ink);background:var(--surface);font-weight:600}
.pager a:hover{border-color:var(--accent)}
.pager small{display:block;font-weight:400;color:var(--muted);font-size:13px}
.pager .next{text-align:right}


.brand{display:flex;align-items:center;gap:10px}
.brand img{width:40px;height:40px}
.topbar{border-bottom:2px solid var(--nls)}
.page h1{color:var(--ink)}
.page h1::after{content:"";display:block;width:72px;height:4px;background:var(--accent);margin-top:12px}
.crumb{color:var(--accent)}
.page h2{border-bottom-color:var(--line)}
.page th{color:var(--accent)}
.page strong{color:#fff}
.side li a[aria-current="page"]{color:var(--nls);box-shadow:inset 3px 0 0 var(--nls)}
.side li a[data-side="legal"][aria-current="page"]{color:var(--legal);box-shadow:inset 3px 0 0 var(--legal);background:rgba(47,174,39,.14)}
.side li a[data-side="illegal"][aria-current="page"]{color:var(--illegal);box-shadow:inset 3px 0 0 var(--illegal);background:rgba(212,35,35,.14)}
.nav-title.t-legal{color:var(--legal)} .nav-title.t-illegal{color:var(--illegal)}
.pager a:hover{border-color:var(--accent)}
.page a.button{display:inline-block;margin:6px 8px 6px 0;padding:10px 18px;border-radius:6px;font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;line-height:1.2}
.page a.button.primary{background:var(--accent);color:#0b0b0a}
.page a.button.secondary{border:1.5px solid var(--accent);color:var(--accent)}
.page a.button:hover{filter:brightness(1.12)}
.page a[href^="https://discord"]:not(.button)::after{content:" ↗";font-size:.8em}
@media (max-width:860px){
  .menu-btn{display:inline-block}
  .layout{grid-template-columns:1fr}
  .side{position:fixed;inset:56px 0 0 0;height:auto;z-index:15;transform:translateX(-100%);transition:transform .2s ease;width:min(320px,86vw)}
  body.nav-open .side{transform:none;box-shadow:0 0 0 100vmax rgba(0,0,0,.35)}
  .draft{display:none}
}
@media (prefers-reduced-motion:reduce){.side{transition:none}}
</style>

<header class="topbar">
  <button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="side">Sommaire</button>
  <a class="brand" href="#<!--FIRST-->" data-page="<!--FIRST-->"><img src="data:image/png;base64,<!--LOGO-->" alt="" width="40" height="40">New Los Santos <span>· Règlement</span></a>
  <span class="draft">Aperçu de relecture · <!--COUNT--> pages · pas encore publié</span>
</header>
<div class="layout">
  <aside class="side" id="side">
    <label for="search" class="nav-title">Rechercher dans le règlement</label>
    <input class="search" id="search" type="search" placeholder="braquage, wipe, ticket…" autocomplete="off">
    <p class="search-note" id="search-note" aria-live="polite"></p>
<!--NAV-->
  </aside>
  <main id="main">
<!--PAGES-->
  </main>
</div>
<script>
(function(){
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.side a[data-page]'));
  var first = pages[0].dataset.id;
  function show(id){
    var target = document.getElementById('p-' + id) ? id : first;
    pages.forEach(function(p){ p.hidden = p.dataset.id !== target; });
    links.forEach(function(a){ if(a.dataset.page === target) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.body.classList.remove('nav-open');
    document.getElementById('menu-btn').setAttribute('aria-expanded','false');
    window.scrollTo(0,0);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[data-page]');
    if(!a) return;
    e.preventDefault();
    if(location.hash !== '#' + a.dataset.page){ try{ history.pushState(null,'','#' + a.dataset.page); }catch(err){} }
    show(a.dataset.page);
  });
  window.addEventListener('popstate', function(){ show(location.hash.slice(1)); });
  window.addEventListener('hashchange', function(){ show(location.hash.slice(1)); });
  document.getElementById('menu-btn').addEventListener('click', function(){
    var open = document.body.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  var texts = {};
  pages.forEach(function(p){ texts[p.dataset.id] = p.textContent.toLowerCase(); });
  var norm = function(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,''); };
  Object.keys(texts).forEach(function(k){ texts[k] = norm(texts[k]); });
  document.getElementById('search').addEventListener('input', function(){
    var q = norm(this.value.trim().toLowerCase());
    var hits = 0;
    links.forEach(function(a){
      var ok = !q || texts[a.dataset.page].indexOf(q) !== -1;
      a.parentElement.hidden = !ok;
      if(ok) hits++;
    });
    document.querySelectorAll('.nav-group').forEach(function(g){
      g.hidden = !g.querySelector('li:not([hidden])');
    });
    document.getElementById('search-note').textContent = q ? (hits ? hits + ' page' + (hits > 1 ? 's' : '') + ' contiennent « ' + this.value.trim() + ' »' : 'Aucune page ne contient « ' + this.value.trim() + ' »') : '';
  });
  show(location.hash.slice(1));
})();
</script>
