// Page rendering and event handling
import * as store from './store.js';
import { searchMovies } from './api.js';
import {
  renderAvatar, renderMovieCard, renderListCard, renderProfileCard,
  renderMovieDetailModal, renderCreateListModal, renderSearchOverlay,
  renderEmptyState, renderStarRating, showToast
} from './components.js';

// ===== HOME PAGE =====
export function renderHomePage() {
  const state = store.getState();
  const current = store.getCurrentProfile();
  const lists = store.getLists();

  const isisStats = store.getProfileStats('isis');
  const juliaStats = store.getProfileStats('julia');

  const recentMovies = store.getAllMovies()
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, 6);

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero-title">omg hii</h1>
        <div class="hero-profiles">
          ${renderProfileCard(state.profiles.isis, current.id === 'isis', isisStats)}
          ${renderProfileCard(state.profiles.julia, current.id === 'julia', juliaStats)}
        </div>
      </section>

      <!-- Listas -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Nossas Listas</h2>
          <div>
            <button class="btn btn-primary" id="create-list-btn-home" style="margin-right: 8px;">+ nova lista</button>
            <a href="#/lists" class="section-link">Ver todas →</a>
          </div>
        </div>
        ${lists.length > 0
      ? `<div class="lists-grid">${lists.slice(0, 3).map(l => renderListCard(l)).join('')}</div>`
      : renderEmptyState('📋', 'Nenhuma lista ainda', 'Crie sua primeira lista de filmes!')
    }
      </section>

      ${recentMovies.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Adicionados Recentemente</h2>
        </div>
        <div class="poster-grid">
          ${recentMovies.map(m => renderMovieCard(m, m.listId)).join('')}
        </div>
      </section>
      ` : ''}
      
      <button class="btn-fab" id="fab-create-list" title="Nova Lista">+</button>
    </div>
  `;

  bindHomeEvents();
}

function bindHomeEvents() {
  // Profile card clicks
  document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
      const profileId = card.dataset.profile;
      store.setCurrentProfile(profileId);
      window.location.hash = '#/profile/' + profileId;
    });
  });

  // Create list buttons
  const createListHome = document.getElementById('create-list-btn-home');
  if (createListHome) createListHome.addEventListener('click', openCreateListModal);
  const fab = document.getElementById('fab-create-list');
  if (fab) fab.addEventListener('click', openCreateListModal);

  bindListCardClicks();
  bindMovieCardClicks();
}

// ===== LISTS PAGE =====
export function renderListsPage() {
  const lists = store.getLists();
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-enter">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">todas as listas</h2>
          <button class="btn btn-primary" id="create-list-btn">+ nova lista</button>
        </div>
        ${lists.length > 0
      ? `<div class="lists-grid">${lists.map(l => renderListCard(l)).join('')}</div>`
      : renderEmptyState('', 'nenhuma lista ainda', 'crie sua primeira lista!',
        '<button class="btn btn-primary" id="create-list-btn-empty">+ criar lista</button>')
    }
      </section>
    </div>
  `;

  // Create list button
  const createBtn = document.getElementById('create-list-btn') || document.getElementById('create-list-btn-empty');
  if (createBtn) createBtn.addEventListener('click', openCreateListModal);

  bindListCardClicks();
}

// ===== LIST DETAIL PAGE =====
export function renderListDetailPage(listId) {
  const list = store.getList(listId);
  if (!list) {
    window.location.hash = '#/lists';
    return;
  }

  const creator = store.getProfile(list.createdBy);
  const watchedCount = list.movies.filter(m => m.watched).length;
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-enter">
      <button class="back-btn" id="back-btn">← voltar para listas</button>

      <div class="list-detail-header">
        <h1>${list.name}</h1>
        ${list.description ? `<p class="list-detail-desc">${list.description}</p>` : ''}
        <div class="list-detail-meta">
          <span class="badge badge-${creator.id}">${renderAvatar(creator.avatar, true)} ${creator.name}</span>
          <span>${list.movies.length} filme${list.movies.length !== 1 ? 's' : ''}</span>
          <span>${watchedCount} assistido${watchedCount !== 1 ? 's' : ''}</span>
        </div>
        <div class="list-detail-actions">
          <button class="btn btn-primary" id="add-movie-btn">adicionar filme</button>
          <button class="btn btn-danger" id="delete-list-btn" data-list-id="${list.id}">excluir lista</button>
        </div>
      </div>

      ${list.movies.length > 0
      ? `<div class="poster-grid">${list.movies.map(m => renderMovieCard(m, listId)).join('')}</div>`
      : renderEmptyState('', 'lista vazia', 'adicione filmes usando o botão acima!',
        `<button class="btn btn-primary" id="add-movie-btn-empty">buscar filmes</button>`)
    }
    </div>
  `;

  // Back button
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.hash = '#/lists';
  });

  // Add movie buttons
  const addBtn = document.getElementById('add-movie-btn');
  const addBtnEmpty = document.getElementById('add-movie-btn-empty');
  if (addBtn) addBtn.addEventListener('click', () => openSearchOverlay(listId));
  if (addBtnEmpty) addBtnEmpty.addEventListener('click', () => openSearchOverlay(listId));

  // Delete list
  const deleteBtn = document.getElementById('delete-list-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm(`tem certeza que quer excluir "${list.name}"?`)) {
        store.deleteList(listId);
        showToast('lista excluída');
        window.location.hash = '#/lists';
      }
    });
  }

  bindMovieCardClicks();
}

// ===== MODAL HELPERS =====
function openCreateListModal() {
  const modals = document.getElementById('modals');
  modals.innerHTML = renderCreateListModal();

  // Close
  const closeBtn = modals.querySelector('.close-modal') || document.getElementById('close-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  const cancelBtn = document.getElementById('cancel-create-list');
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modals.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  // Create
  const saveBtn = document.getElementById('save-list-btn') || document.getElementById('confirm-create-list');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('list-name-input').value.trim();
      if (!name) {
        showToast('dê um nome para a lista!', 'error');
        return;
      }
      const desc = document.getElementById('list-desc-input').value.trim();
      store.createList({ name, description: desc, emoji: '' });
      closeModal();
      showToast('lista criada nem amo');
      // Re-render current page
      const hash = window.location.hash;
      if (hash === '#/lists' || hash === '') renderListsPage();
      else renderHomePage();
    });
  }
}

function openSearchOverlay(listId) {
  const modals = document.getElementById('modals');
  modals.innerHTML = renderSearchOverlay(listId);

  const input = document.getElementById('search-input');
  const resultsDiv = document.getElementById('search-results');
  let debounceTimer;

  // Close
  document.getElementById('close-search').addEventListener('click', () => {
    modals.innerHTML = '';
    renderListDetailPage(listId);
  });

  // Search with debounce
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (query.length < 2) return;

    debounceTimer = setTimeout(async () => {
      resultsDiv.innerHTML = '<div class="empty-state"><div class="empty-state-title">buscando...</div></div>';
      const results = await searchMovies(query);

      if (results.length === 0) {
        resultsDiv.innerHTML = renderEmptyState('nenhum resultado omg', 'tente buscar com outro nome');
        return;
      }

      resultsDiv.innerHTML = `<div class="search-results-grid">
        ${results.slice(0, 20).map(m => {
        const inList = store.getList(listId)?.movies.some(mov => mov.tmdbId === m.id);
        if (inList) return '';
        return `<div class="search-result-card" data-movie-id="${m.id}" data-movie='${JSON.stringify(m).replace(/'/g, "&#39;")}'>
            ${m.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w342${m.poster_path}" alt="${m.title}" loading="lazy">`
            : `<div class="movie-card-placeholder">🎬</div>`
          }
            <div class="search-result-add">
              <div class="plus-icon">+</div>
              <span>Adicionar</span>
            </div>
            <div class="search-result-info">
              <div class="title">${m.title}</div>
              <div class="year">${m.release_date ? m.release_date.split('-')[0] : ''}</div>
            </div>
          </div>`;
      }).join('')}
      </div>`;

      // Bind add clicks
      resultsDiv.querySelectorAll('.search-result-card').forEach(card => {
        card.addEventListener('click', () => {
          const movieData = JSON.parse(card.dataset.movie);
          const added = store.addMovieToList(listId, movieData);
          if (added) {
            showToast(`"${movieData.title}" adicionado!`);
            card.style.opacity = '0.3';
            card.style.pointerEvents = 'none';
          } else {
            showToast('filme já está na lista', 'error');
          }
        });
      });
    }, 400);
  });

  input.focus();
}

function openMovieDetailModal(tmdbId, listId) {
  const list = store.getList(listId);
  if (!list) return;
  const movie = list.movies.find(m => m.tmdbId === tmdbId);
  if (!movie) return;

  const modals = document.getElementById('modals');
  modals.innerHTML = renderMovieDetailModal(movie, listId);

  // Close
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modals.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  // Star rating
  let currentRating = movie.rating;
  const starContainer = modals.querySelector('.star-rating[data-interactive]');
  if (starContainer) {
    starContainer.querySelectorAll('.star').forEach(star => {
      star.addEventListener('mouseenter', () => {
        const r = parseInt(star.dataset.rating);
        starContainer.querySelectorAll('.star').forEach((s, i) => {
          s.classList.toggle('hovered', i + 1 <= r && i + 1 > currentRating);
        });
      });
      star.addEventListener('mouseleave', () => {
        starContainer.querySelectorAll('.star').forEach(s => s.classList.remove('hovered'));
      });
      star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        starContainer.querySelectorAll('.star').forEach((s, i) => {
          s.classList.toggle('filled', i + 1 <= currentRating);
          s.classList.remove('hovered');
        });
      });
    });
  }

  // Watched toggle
  const toggle = document.getElementById('watched-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const track = toggle.querySelector('.toggle-track');
      const label = toggle.querySelector('.toggle-label');
      const isActive = track.classList.toggle('active');
      label.textContent = isActive ? 'Assistido ✓' : 'Ainda não assistido';
    });
  }

  // Save
  document.getElementById('save-movie-btn').addEventListener('click', () => {
    const comment = document.getElementById('movie-comment').value;
    const isWatched = modals.querySelector('.toggle-track').classList.contains('active');

    store.setRating(listId, tmdbId, currentRating);
    store.setComment(listId, tmdbId, comment);
    if (isWatched !== movie.watched) store.toggleWatched(listId, tmdbId);

    closeModal();
    showToast('salvo!');
    renderListDetailPage(listId);
  });

  // Remove
  document.getElementById('remove-movie-btn').addEventListener('click', () => {
    if (confirm(`remover "${movie.title}" da lista?`)) {
      store.removeMovieFromList(listId, tmdbId);
      closeModal();
      showToast('filme removido');
      renderListDetailPage(listId);
    }
  });
}

function closeModal() {
  document.getElementById('modals').innerHTML = '';
}

// ===== EVENT BINDING HELPERS =====
function bindListCardClicks() {
  document.querySelectorAll('.list-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.hash = `#/list/${card.dataset.listId}`;
    });
  });
}

function bindMovieCardClicks() {
  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const tmdbId = parseInt(card.dataset.tmdbId);
      const listId = card.dataset.listId;
      openMovieDetailModal(tmdbId, listId);
    });
  });
}

// ===== PROFILE PAGE =====
export function renderProfilePage(profileId) {
  const profile = store.getProfile(profileId);
  const app = document.getElementById('app');

  if (!profile) {
    window.location.hash = '#/';
    return;
  }

  const lists = store.getLists().filter(l => l.createdBy === profileId);
  const stats = store.getProfileStats(profileId);
  const favorites = profile.favorites || [];

  const favoritesHtml = favorites.length > 0
    ? `<div class="poster-grid" style="grid-template-columns: repeat(4, 1fr); max-width: 600px;">${favorites.map(m => renderMovieCard(m, 'fav')).join('')}</div>`
    : renderEmptyState('', 'nenhum filme favoritado ainda', '');

  const listsHtml = lists.length > 0
    ? `<div class="lists-grid">${lists.map(l => renderListCard(l)).join('')}</div>`
    : renderEmptyState('', 'nenhuma lista criada', '');

  app.innerHTML = `
    <div class="page-enter">
      <button class="back-btn" id="back-btn" style="position:absolute; top:24px; left:24px; z-index:10; color:white; text-shadow:0 1px 4px rgba(0,0,0,0.8);">← voltar</button>
      
      <div class="profile-page-header">
        <div class="profile-cover" style="${profile.cover ? `background-image: url(${profile.cover})` : 'background: linear-gradient(135deg, var(--color-surface), var(--color-border));'}"></div>
        <div class="profile-page-info">
          <div class="profile-page-avatar">${renderAvatar(profile.avatar)}</div>
          <h1 class="profile-page-name">${profile.name}</h1>
          <p class="profile-page-bio">${profile.bio || ''}</p>
          <div class="profile-page-stats">
            <div class="stat-item"><span class="stat-value">${stats.moviesWatched}</span> <span class="stat-label">filmes</span></div>
            <div class="stat-item"><span class="stat-value">${stats.listsCreated}</span> <span class="stat-label">listas</span></div>
          </div>
        </div>
      </div>

      <div class="profile-page-content" style="padding: var(--space-xl) var(--space-lg); max-width: 1000px; margin: 0 auto;">
        <section class="section" style="margin-bottom: var(--space-xl)">
          <div class="section-header">
            <h2 class="section-title">filmes favoritos</h2>
          </div>
          ${favoritesHtml}
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">listas de ${profile.name.toLowerCase()}</h2>
          </div>
          ${listsHtml}
        </section>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.hash = '#/';
  });
  
  bindListCardClicks();
  bindMovieCardClicks();
}

