(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=s(a);fetch(a.href,n)}})();const q="julisisboxd_data",u={currentProfile:"isis",profiles:{isis:{id:"isis",name:"Isis",avatar:"/isis.png",color:"orange",bio:"isis minion lagum papoi",cover:"",favorites:[{tmdbId:211672,title:"Minions",year:"2015",posterPath:"/q03Y9oP0qFj3GZxaHGRAkzaL01B.jpg"},{tmdbId:438148,title:"Minions: The Rise of Gru",year:"2022",posterPath:"/wKiOkHT3g5QZLcQV32H4W5nN2wF.jpg"},{tmdbId:20352,title:"Despicable Me",year:"2010",posterPath:"/qiiwnT9iH4W0zFm1X6hS22aPZzD.jpg"},{tmdbId:93456,title:"Despicable Me 2",year:"2013",posterPath:"/4UvNG6JFaSzMLUXUsq62VcVjNhP.jpg"}]},julia:{id:"julia",name:"Julia",avatar:"/julia.jpg",color:"blue",bio:"julia minion amante de morangos, verde e papoi",cover:"",favorites:[{tmdbId:211672,title:"Minions",year:"2015",posterPath:"/q03Y9oP0qFj3GZxaHGRAkzaL01B.jpg"},{tmdbId:438148,title:"Minions: The Rise of Gru",year:"2022",posterPath:"/wKiOkHT3g5QZLcQV32H4W5nN2wF.jpg"},{tmdbId:20352,title:"Despicable Me",year:"2010",posterPath:"/qiiwnT9iH4W0zFm1X6hS22aPZzD.jpg"},{tmdbId:93456,title:"Despicable Me 2",year:"2013",posterPath:"/4UvNG6JFaSzMLUXUsq62VcVjNhP.jpg"}]}},lists:[{id:"list-1",name:"exp de lista com filmes recomendados por juli minion",description:"filmes que isis recomenda",createdBy:"isis",createdAt:new Date().toISOString(),movies:[]},{id:"list-2",name:"exp de lista com filmes que recomendei pra julis",description:"filmes que a Julia recomenda",createdBy:"julia",createdAt:new Date().toISOString(),movies:[]},{id:"list-3",name:"vamos assistir juntas",description:"filmes que queremos ver juntas!",createdBy:"isis",createdAt:new Date().toISOString(),movies:[]}]};function d(){try{const e=localStorage.getItem(q);if(!e)return g(u),u;const t=JSON.parse(e);return Object.keys(u.profiles).forEach(s=>{t.profiles[s].favorites||(t.profiles[s].favorites=u.profiles[s].favorites),t.profiles[s].bio||(t.profiles[s].bio=u.profiles[s].bio),t.profiles[s].cover===void 0&&(t.profiles[s].cover=u.profiles[s].cover)}),t}catch{return g(u),u}}function g(e){localStorage.setItem(q,JSON.stringify(e))}function f(e){const t=d();return e(t),g(t),t}function C(){const e=d();return e.profiles[e.currentProfile]}function D(e){f(t=>{t.currentProfile=e})}function $(e){return d().profiles[e]}function L(e){const s=d().lists,i=s.filter(o=>o.createdBy===e).length;let a=0,n=0;return s.forEach(o=>{o.movies.forEach(r=>{r.addedBy===e&&a++,r.watched&&n++})}),{listsCreated:i,moviesAdded:a,moviesWatched:n}}function I(){return d().lists}function B(e){return d().lists.find(t=>t.id===e)}function N({name:e,description:t,emoji:s}){const i=d(),a={id:"list-"+Date.now(),name:e,description:t||"",emoji:"",createdBy:i.currentProfile,createdAt:new Date().toISOString(),movies:[]};return f(n=>{n.lists.unshift(a)}),a}function _(e){f(t=>{t.lists=t.lists.filter(s=>s.id!==e)})}function U(e,t){const s=d(),i=s.lists.find(n=>n.id===e);if(!i||i.movies.some(n=>n.tmdbId===t.id))return!1;const a={tmdbId:t.id,title:t.title,year:t.release_date?t.release_date.split("-")[0]:"",posterPath:t.poster_path,overview:t.overview||"",watched:!1,watchedDate:null,rating:0,comment:"",addedBy:s.currentProfile,addedAt:new Date().toISOString()};return i.movies.push(a),g(s),!0}function R(e,t){f(s=>{const i=s.lists.find(a=>a.id===e);i&&(i.movies=i.movies.filter(a=>a.tmdbId!==t))})}function z(e,t){let s=!1;return f(i=>{const a=i.lists.find(o=>o.id===e);if(!a)return;const n=a.movies.find(o=>o.tmdbId===t);n&&(n.watched=!n.watched,n.watchedDate=n.watched?new Date().toISOString():null,s=n.watched)}),s}function F(e,t,s){f(i=>{const a=i.lists.find(o=>o.id===e);if(!a)return;const n=a.movies.find(o=>o.tmdbId===t);n&&(n.rating=s)})}function J(e,t,s){f(i=>{const a=i.lists.find(o=>o.id===e);if(!a)return;const n=a.movies.find(o=>o.tmdbId===t);n&&(n.comment=s)})}function K(){const e=d(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),i=document.createElement("a");i.href=s,i.download=`julisisboxd_backup_${new Date().toISOString().split("T")[0]}.json`,i.click(),URL.revokeObjectURL(s)}function G(e){return new Promise((t,s)=>{const i=new FileReader;i.onload=a=>{try{const n=JSON.parse(a.target.result);if(!n.profiles||!n.lists){s(new Error("Arquivo inválido"));return}g(n),t(n)}catch{s(new Error("Erro ao ler arquivo"))}},i.readAsText(e)})}function W(){const e=d(),t=[];return e.lists.forEach(s=>{s.movies.forEach(i=>{t.push({...i,listId:s.id,listName:s.name})})}),t}const V="SUA_API_KEY_AQUI",Z="https://api.themoviedb.org/3",Q="https://image.tmdb.org/t/p",E=new Map;function Y(e,t){return`${e}?${new URLSearchParams(t).toString()}`}async function X(e,t={}){const s={api_key:V,language:"pt-BR",...t},i=Y(e,s);if(E.has(i))return E.get(i);try{const a=`${Z}${e}?${new URLSearchParams(s)}`,n=await fetch(a);if(!n.ok)throw new Error(`TMDB Error: ${n.status}`);const o=await n.json();return E.set(i,o),o}catch(a){return console.error("TMDB fetch error:",a),null}}async function ee(e){if(!e||e.length<2)return[];const t=await X("/search/movie",{query:e});return(t==null?void 0:t.results)||[]}function H(e,t="w342"){return e?`${Q}/${t}${e}`:null}function b(e,t=!1){if(e&&e.startsWith("/")){const s=e.includes("isis")?'style="object-position: center 45%; transform: scale(1.9);"':"";return t?`<span class="badge-img-wrapper"><img src="${e}" class="badge-img" ${s} alt=""></span>`:`<img src="${e}" class="avatar-img" ${s} alt="">`}return e||""}function k(e,t){const s=H(e.posterPath||e.poster_path),i=e.rating?"★".repeat(e.rating)+"☆".repeat(5-e.rating):"";return`
    <div class="movie-card" data-tmdb-id="${e.tmdbId||e.id}" data-list-id="${t}" id="movie-${e.tmdbId||e.id}">
      ${s?`<img src="${s}" alt="${e.title}" loading="lazy">`:'<div class="movie-card-placeholder"></div>'}
      ${e.watched?'<div class="movie-card-watched">✓</div>':""}
      ${e.rating?`<div class="movie-card-rating">${i}</div>`:""}
    </div>
  `}function j(e){const t=$(e.createdBy),s=e.movies?e.movies.length:0;return`
    <div class="list-card" data-list-id="${e.id}">
      <h3 class="list-card-title">${e.name}</h3>
      <div class="list-card-meta">
        ${t?b(t.avatar,!0)+" "+t.name:""} • ${s} filmes
      </div>
    </div>
  `}function A(e,t,s){return`
    <div class="profile-card ${t?"active":""}" data-profile="${e.id}" id="profile-card-${e.id}">
      <div class="profile-avatar">${b(e.avatar)}</div>
      <div class="profile-name">${e.name}</div>
      <div class="profile-stats">
        ${s?`${s.moviesAdded} filmes · ${s.listsCreated} listas`:""}
      </div>
    </div>
  `}function te(e=0,t=!1){const s=Array.from({length:5},(i,a)=>{const n=a+1,o=n<=e?"filled":"",r=t?`data-rating="${n}"`:"";return`<span class="star ${o}" ${r}>★</span>`}).join("");return`<div class="star-rating" ${t?'data-interactive="true"':""}>${s}</div>`}function se(){return`
    <div class="modal-overlay active" id="search-modal">
      <div class="modal-content" style="max-width: 600px; width: 90%;">
        <div class="modal-header">
          <h2>buscar filme</h2>
          <button class="btn btn-secondary close-modal">fechar</button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-input" id="movie-search-input" placeholder="nome do filme..." autofocus>
          <div id="search-results" class="search-results-grid" style="margin-top: var(--space-md);"></div>
        </div>
      </div>
    </div>
  `}function ie(e,t,s){const i=$(e.addedBy),a=H(e.posterPath);return`
    <div class="modal-overlay active" id="movie-detail-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${e.title}</h2>
          <button class="btn btn-secondary close-modal">fechar</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <div style="flex: 0 0 150px;">
              ${a?`<img src="${a}" style="width: 100%; border-radius: var(--radius-sm);">`:""}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <p style="color: var(--text-muted); margin-bottom: var(--space-sm);">adicionado por ${i?b(i.avatar,!0)+" "+i.name:""}</p>
              
              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">status</label>
                <button class="btn ${e.watched?"btn-primary":"btn-secondary"}" id="toggle-watched-btn" style="width: 100%;">
                  ${e.watched?"assistido ✓":"marcar como assistido"}
                </button>
              </div>

              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">avaliação</label>
                ${te(e.rating||0,!0)}
              </div>

              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">comentário</label>
                <textarea class="form-input" id="movie-comment-input" rows="3" placeholder="o que achou do filme?">${e.comment||""}</textarea>
              </div>
              
              <button class="btn btn-primary" id="save-movie-btn" style="width: 100%;">salvar</button>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function ae(){return`
    <div class="modal-overlay active" id="create-list-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>nova lista</h2>
          <button class="btn btn-secondary close-modal">fechar</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: var(--space-md);">
            <label class="form-label">nome da lista</label>
            <input class="form-input" id="list-name-input" placeholder="ex: filmes de terror" autofocus>
          </div>
          <div style="margin-bottom: var(--space-md);">
            <label class="form-label">descrição (opcional)</label>
            <textarea class="form-input" id="list-desc-input" rows="2"></textarea>
          </div>
          <button class="btn btn-primary" id="save-list-btn" style="width: 100%;">criar lista</button>
        </div>
      </div>
    </div>
  `}function h(e,t,s){return`
    <div class="empty-state">
      <div class="empty-state-title">${t}</div>
      <div class="empty-state-text">${s}</div>
    </div>
  `}function m(e){const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className="toast",s.textContent=e,t.appendChild(s),s.offsetHeight,s.classList.add("active"),setTimeout(()=>{s.classList.remove("active"),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)},3e3)}function S(){const e=d(),t=C(),s=I(),i=L("isis"),a=L("julia"),n=W().sort((r,l)=>new Date(l.addedAt)-new Date(r.addedAt)).slice(0,6),o=document.getElementById("app");o.innerHTML=`
    <div class="page-enter">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero-title">omg hii</h1>
        <div class="hero-profiles">
          ${A(e.profiles.isis,t.id==="isis",i)}
          ${A(e.profiles.julia,t.id==="julia",a)}
        </div>
      </section>

      <!-- Listas -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Nossas Listas</h2>
          <a href="#/lists" class="section-link">Ver todas →</a>
        </div>
        ${s.length>0?`<div class="lists-grid">${s.slice(0,3).map(r=>j(r)).join("")}</div>`:h("📋","Nenhuma lista ainda","Crie sua primeira lista de filmes!")}
      </section>

      ${n.length>0?`
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Adicionados Recentemente</h2>
        </div>
        <div class="poster-grid">
          ${n.map(r=>k(r,r.listId)).join("")}
        </div>
      </section>
      `:""}
    </div>
  `,ne()}function ne(){document.querySelectorAll(".profile-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.profile;D(t),window.location.hash="#/profile/"+t})}),x(),M()}function O(){const e=I(),t=document.getElementById("app");t.innerHTML=`
    <div class="page-enter">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">todas as listas</h2>
          <button class="btn btn-primary" id="create-list-btn">+ nova lista</button>
        </div>
        ${e.length>0?`<div class="lists-grid">${e.map(i=>j(i)).join("")}</div>`:h("","nenhuma lista ainda","crie sua primeira lista!")}
      </section>
    </div>
  `;const s=document.getElementById("create-list-btn")||document.getElementById("create-list-btn-empty");s&&s.addEventListener("click",oe),x()}function y(e){const t=B(e);if(!t){window.location.hash="#/lists";return}const s=$(t.createdBy),i=t.movies.filter(l=>l.watched).length,a=document.getElementById("app");a.innerHTML=`
    <div class="page-enter">
      <button class="back-btn" id="back-btn">← voltar para listas</button>

      <div class="list-detail-header">
        <h1>${t.name}</h1>
        ${t.description?`<p class="list-detail-desc">${t.description}</p>`:""}
        <div class="list-detail-meta">
          <span class="badge badge-${s.id}">${b(s.avatar,!0)} ${s.name}</span>
          <span>${t.movies.length} filme${t.movies.length!==1?"s":""}</span>
          <span>${i} assistido${i!==1?"s":""}</span>
        </div>
        <div class="list-detail-actions">
          <button class="btn btn-primary" id="add-movie-btn">adicionar filme</button>
          <button class="btn btn-danger" id="delete-list-btn" data-list-id="${t.id}">excluir lista</button>
        </div>
      </div>

      ${t.movies.length>0?`<div class="poster-grid">${t.movies.map(l=>k(l,e)).join("")}</div>`:h("","lista vazia","adicione filmes usando o botão acima!")}
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{window.location.hash="#/lists"});const n=document.getElementById("add-movie-btn"),o=document.getElementById("add-movie-btn-empty");n&&n.addEventListener("click",()=>T(e)),o&&o.addEventListener("click",()=>T(e));const r=document.getElementById("delete-list-btn");r&&r.addEventListener("click",()=>{confirm(`tem certeza que quer excluir "${t.name}"?`)&&(_(e),m("lista excluída"),window.location.hash="#/lists")}),M()}function oe(){const e=document.getElementById("modals");e.innerHTML=ae(),document.getElementById("close-modal").addEventListener("click",v),document.getElementById("cancel-create-list").addEventListener("click",v),e.querySelector(".modal-overlay").addEventListener("click",t=>{t.target.classList.contains("modal-overlay")&&v()}),document.getElementById("confirm-create-list").addEventListener("click",()=>{const t=document.getElementById("list-name-input").value.trim();if(!t){m("dê um nome para a lista!");return}const s=document.getElementById("list-desc-input").value.trim();N({name:t,description:s,emoji:selectedEmoji}),v(),m("lista criada nem amo");const i=window.location.hash;i==="#/lists"||i===""?O():S()})}function T(e){const t=document.getElementById("modals");t.innerHTML=se();const s=document.getElementById("search-input"),i=document.getElementById("search-results");let a;document.getElementById("close-search").addEventListener("click",()=>{t.innerHTML="",y(e)}),s.addEventListener("input",()=>{clearTimeout(a);const n=s.value.trim();n.length<2||(a=setTimeout(async()=>{i.innerHTML='<div class="empty-state"><div class="empty-state-title">buscando...</div></div>';const o=await ee(n);if(o.length===0){i.innerHTML=h("nenhum resultado omg","tente buscar com outro nome");return}i.innerHTML=`<div class="search-results-grid">
        ${o.slice(0,20).map(r=>{var c;return((c=B(e))==null?void 0:c.movies.some(p=>p.tmdbId===r.id))?"":`<div class="search-result-card" data-movie-id="${r.id}" data-movie='${JSON.stringify(r).replace(/'/g,"&#39;")}'>
            ${r.poster_path?`<img src="https://image.tmdb.org/t/p/w342${r.poster_path}" alt="${r.title}" loading="lazy">`:'<div class="movie-card-placeholder">🎬</div>'}
            <div class="search-result-add">
              <div class="plus-icon">+</div>
              <span>Adicionar</span>
            </div>
            <div class="search-result-info">
              <div class="title">${r.title}</div>
              <div class="year">${r.release_date?r.release_date.split("-")[0]:""}</div>
            </div>
          </div>`}).join("")}
      </div>`,i.querySelectorAll(".search-result-card").forEach(r=>{r.addEventListener("click",()=>{const l=JSON.parse(r.dataset.movie);U(e,l)?(m(`"${l.title}" adicionado!`),r.style.opacity="0.3",r.style.pointerEvents="none"):m("filme já está na lista")})})},400))}),s.focus()}function re(e,t){const s=B(t);if(!s)return;const i=s.movies.find(l=>l.tmdbId===e);if(!i)return;const a=document.getElementById("modals");a.innerHTML=ie(i),document.getElementById("close-modal").addEventListener("click",v),a.querySelector(".modal-overlay").addEventListener("click",l=>{l.target.classList.contains("modal-overlay")&&v()});let n=i.rating;const o=a.querySelector(".star-rating[data-interactive]");o&&o.querySelectorAll(".star").forEach(l=>{l.addEventListener("mouseenter",()=>{const c=parseInt(l.dataset.rating);o.querySelectorAll(".star").forEach((p,P)=>{p.classList.toggle("hovered",P+1<=c&&P+1>n)})}),l.addEventListener("mouseleave",()=>{o.querySelectorAll(".star").forEach(c=>c.classList.remove("hovered"))}),l.addEventListener("click",()=>{n=parseInt(l.dataset.rating),o.querySelectorAll(".star").forEach((c,p)=>{c.classList.toggle("filled",p+1<=n),c.classList.remove("hovered")})})});const r=document.getElementById("watched-toggle");r&&r.addEventListener("click",()=>{const l=r.querySelector(".toggle-track"),c=r.querySelector(".toggle-label"),p=l.classList.toggle("active");c.textContent=p?"Assistido ✓":"Ainda não assistido"}),document.getElementById("save-movie-btn").addEventListener("click",()=>{const l=document.getElementById("movie-comment").value,c=a.querySelector(".toggle-track").classList.contains("active");F(t,e,n),J(t,e,l),c!==i.watched&&z(t,e),v(),m("salvo!"),y(t)}),document.getElementById("remove-movie-btn").addEventListener("click",()=>{confirm(`remover "${i.title}" da lista?`)&&(R(t,e),v(),m("filme removido"),y(t))})}function v(){document.getElementById("modals").innerHTML=""}function x(){document.querySelectorAll(".list-card").forEach(e=>{e.addEventListener("click",()=>{window.location.hash=`#/list/${e.dataset.listId}`})})}function M(){document.querySelectorAll(".movie-card").forEach(e=>{e.addEventListener("click",()=>{const t=parseInt(e.dataset.tmdbId),s=e.dataset.listId;re(t,s)})})}function le(e){const t=$(e),s=document.getElementById("app");if(!t){window.location.hash="#/";return}const i=I().filter(l=>l.createdBy===e),a=L(e),n=t.favorites||[],o=n.length>0?`<div class="poster-grid" style="grid-template-columns: repeat(4, 1fr); max-width: 600px;">${n.map(l=>k(l,"fav")).join("")}</div>`:h("","nenhum filme favoritado ainda",""),r=i.length>0?`<div class="lists-grid">${i.map(l=>j(l)).join("")}</div>`:h("","nenhuma lista criada","");s.innerHTML=`
    <div class="page-enter">
      <button class="back-btn" id="back-btn" style="position:absolute; top:24px; left:24px; z-index:10; color:white; text-shadow:0 1px 4px rgba(0,0,0,0.8);">← voltar</button>
      
      <div class="profile-page-header">
        <div class="profile-cover" style="${t.cover?`background-image: url(${t.cover})`:"background: linear-gradient(135deg, var(--color-surface), var(--color-border));"}"></div>
        <div class="profile-page-info">
          <div class="profile-page-avatar">${b(t.avatar)}</div>
          <h1 class="profile-page-name">${t.name}</h1>
          <p class="profile-page-bio">${t.bio||""}</p>
          <div class="profile-page-stats">
            <div class="stat-item"><span class="stat-value">${a.moviesWatched}</span> <span class="stat-label">filmes</span></div>
            <div class="stat-item"><span class="stat-value">${a.listsCreated}</span> <span class="stat-label">listas</span></div>
          </div>
        </div>
      </div>

      <div class="profile-page-content" style="padding: var(--space-xl) var(--space-lg); max-width: 1000px; margin: 0 auto;">
        <section class="section" style="margin-bottom: var(--space-xl)">
          <div class="section-header">
            <h2 class="section-title">filmes favoritos</h2>
          </div>
          ${o}
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">listas de ${t.name.toLowerCase()}</h2>
          </div>
          ${r}
        </section>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{window.location.hash="#/"}),x(),M()}function w(){const t=(window.location.hash||"#/").replace("#/","").split("/");switch(t[0]||"home"){case"":case"home":S();break;case"lists":O();break;case"list":y(t[1]);break;case"profile":le(t[1]);break;default:S()}window.scrollTo(0,0)}function ce(){document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.getElementById("modals");t.innerHTML&&(t.innerHTML="",w())}if(e.ctrlKey&&e.key==="e"&&(e.preventDefault(),K(),m("dados exportados!")),e.ctrlKey&&e.key==="i"){e.preventDefault();const t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=async s=>{try{await G(s.target.files[0]),m("dados importados!"),w()}catch(i){m(i.message)}},t.click()}})}function de(){ce(),window.addEventListener("hashchange",w),w(),console.log("%cjulisisboxd","font-size:20px; font-weight:bold; background:linear-gradient(135deg,#FF8A00,#E84855); -webkit-background-clip:text; -webkit-text-fill-color:transparent;"),console.log("%cfeito para Isis & Julia","color:#9AB; font-size:12px;")}document.addEventListener("DOMContentLoaded",de);
