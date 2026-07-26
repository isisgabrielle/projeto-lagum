import { getPosterUrl } from './api.js';
import { getProfile } from './store.js';

export function renderAvatar(avatar, isBadge = false) {
  if (avatar && avatar.startsWith('/')) {
    const style = avatar.includes('isis') ? 'style="object-position: center 45%; transform: scale(1.9);"' : '';
    if (isBadge) {
      return `<span class="badge-img-wrapper"><img src="${avatar}" class="badge-img" ${style} alt=""></span>`;
    }
    return `<img src="${avatar}" class="avatar-img" ${style} alt="">`;
  }
  return avatar || '';
}

export function renderMovieCard(movie, listId) {
  const posterUrl = getPosterUrl(movie.posterPath || movie.poster_path);
  const stars = movie.rating ? '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating) : '';

  return `
    <div class="movie-card" data-tmdb-id="${movie.tmdbId || movie.id}" data-list-id="${listId}" id="movie-${movie.tmdbId || movie.id}">
      ${posterUrl
      ? `<img src="${posterUrl}" alt="${movie.title}" loading="lazy">`
      : `<div class="movie-card-placeholder"></div>`
    }
      ${movie.watched ? `<div class="movie-card-watched">✓</div>` : ''}
      ${movie.rating ? `<div class="movie-card-rating">${stars}</div>` : ''}
    </div>
  `;
}

export function renderListCard(list) {
  const creator = getProfile(list.createdBy);
  const movieCount = list.movies ? list.movies.length : 0;
  
  // Get up to 4 posters
  const posters = [];
  for (let i = 0; i < 4; i++) {
    if (list.movies && list.movies[i]) {
      const p = getPosterUrl(list.movies[i].posterPath || list.movies[i].poster_path);
      posters.push(p ? `<img src="${p}" alt="">` : `<div class="poster-placeholder">🎬</div>`);
    } else {
      posters.push(`<div class="poster-placeholder"></div>`);
    }
  }

  return `
    <div class="list-card" data-list-id="${list.id}">
      <div class="list-card-posters">
        ${posters.join('')}
      </div>
      <div class="list-card-info">
        <div class="list-card-name">${list.name}</div>
        <div class="list-card-meta">
          ${creator ? renderAvatar(creator.avatar, true) + ' ' + creator.name : ''} • ${movieCount} filmes
        </div>
      </div>
    </div>
  `;
}

export function renderProfileCard(profile, isActive, stats) {
  return `
    <div class="profile-card ${isActive ? 'active' : ''}" data-profile="${profile.id}" id="profile-card-${profile.id}">
      <div class="profile-avatar">${renderAvatar(profile.avatar)}</div>
      <div class="profile-name">${profile.name}</div>
      <div class="profile-stats">
        ${stats ? `${stats.moviesAdded} filmes · ${stats.listsCreated} listas` : ''}
      </div>
    </div>
  `;
}

export function renderStarRating(currentRating = 0, interactive = false) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    const filled = val <= currentRating ? 'filled' : '';
    const attrs = interactive ? `data-rating="${val}"` : '';
    return `<span class="star ${filled}" ${attrs}>★</span>`;
  }).join('');

  return `<div class="star-rating" ${interactive ? 'data-interactive="true"' : ''}>${stars}</div>`;
}

export function renderSearchResult(movie) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const escapedMovie = JSON.stringify(movie).replace(/'/g, "&#39;");

  return `
    <div class="search-result-card" data-movie-id="${movie.id}" data-movie='${escapedMovie}'>
      ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}">` : '<div class="movie-card-placeholder"></div>'}
      <div class="search-result-info">
        <div class="search-result-title">${movie.title}</div>
        <div class="search-result-year">${year}</div>
      </div>
    </div>
  `;
}

export function renderSearchOverlay() {
  return `
    <div class="modal-overlay active" id="search-modal">
      <div class="modal" style="max-width: 600px; width: 90%;">
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
  `;
}

export function renderMovieDetailModal(movie, listId, isCreator) {
  const addedBy = getProfile(movie.addedBy);
  const posterUrl = getPosterUrl(movie.posterPath);
  
  return `
    <div class="modal-overlay active" id="movie-detail-modal">
      <div class="modal">
        <div class="modal-header">
          <h2>${movie.title}</h2>
          <button class="btn btn-secondary close-modal">fechar</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <div style="flex: 0 0 150px;">
              ${posterUrl ? `<img src="${posterUrl}" style="width: 100%; border-radius: var(--radius-sm);">` : ''}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <p style="color: var(--text-muted); margin-bottom: var(--space-sm);">adicionado por ${addedBy ? renderAvatar(addedBy.avatar, true) + ' ' + addedBy.name : ''}</p>
              
              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">status</label>
                <button class="btn ${movie.watched ? 'btn-primary' : 'btn-secondary'}" id="toggle-watched-btn" style="width: 100%;">
                  ${movie.watched ? 'assistido ✓' : 'marcar como assistido'}
                </button>
              </div>

              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">avaliação</label>
                ${renderStarRating(movie.rating || 0, true)}
              </div>

              <div style="margin-bottom: var(--space-md);">
                <label class="form-label">comentário</label>
                <textarea class="form-input" id="movie-comment-input" rows="3" placeholder="o que achou do filme?">${movie.comment || ''}</textarea>
              </div>
              
              <button class="btn btn-primary" id="save-movie-btn" style="width: 100%;">salvar</button>
              
              ${isCreator ? `<button class="btn btn-secondary" id="remove-movie-btn" style="width: 100%; margin-top: var(--space-sm); color: var(--accent-red);">remover da lista</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderCreateListModal() {
  return `
    <div class="modal-overlay active" id="create-list-modal">
      <div class="modal" style="width: 100%; max-width: 480px;">
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
  `;
}

export function renderEmptyState(emoji, title, text) {
  return `
    <div class="empty-state">
      <div class="empty-state-title">${title}</div>
      <div class="empty-state-text">${text}</div>
    </div>
  `;
}

export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  
  // force reflow
  toast.offsetHeight;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}
