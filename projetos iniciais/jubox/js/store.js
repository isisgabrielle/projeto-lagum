// State management with localStorage
const STORAGE_KEY = 'julisisboxd_data';

const DEFAULT_STATE = {
  currentProfile: 'isis',
  profiles: {
    isis: {
      id: 'isis', name: 'isis', avatar: '/isis.png', color: 'orange',
      bio: 'isis minion lagum papoi',
      cover: '/capa-isis.jpg',
      favorites: [
        { tmdbId: 211672, title: 'Minions', year: '2015', posterPath: '/caq9Xi6b1sZNREfzFBO2tRIBzWn.jpg' },
        { tmdbId: 438148, title: 'Minions: The Rise of Gru', year: '2022', posterPath: '/iTP3mMw0AoqmScYzDoMmYeKxYe.jpg' },
        { tmdbId: 20352, title: 'Despicable Me', year: '2010', posterPath: '/rYZzutMXxvirK9gK01iLo3Blaj3.jpg' },
        { tmdbId: 93456, title: 'Despicable Me 2', year: '2013', posterPath: '/7mYMq6OQyum1wAiUI7i6w78YKEO.jpg' }
      ]
    },
    julia: {
      id: 'julia', name: 'julis', avatar: '/julia.jpg', color: 'blue',
      bio: 'julia minion amante de morangos, verde e papoi',
      cover: '/capa-julia.jpg',
      favorites: [
        { tmdbId: 211672, title: 'Minions', year: '2015', posterPath: '/caq9Xi6b1sZNREfzFBO2tRIBzWn.jpg' },
        { tmdbId: 438148, title: 'Minions: The Rise of Gru', year: '2022', posterPath: '/iTP3mMw0AoqmScYzDoMmYeKxYe.jpg' },
        { tmdbId: 20352, title: 'Despicable Me', year: '2010', posterPath: '/rYZzutMXxvirK9gK01iLo3Blaj3.jpg' },
        { tmdbId: 93456, title: 'Despicable Me 2', year: '2013', posterPath: '/7mYMq6OQyum1wAiUI7i6w78YKEO.jpg' }
      ]
    }
  },
  lists: [
    {
      id: 'list-1',
      name: 'exp de lista com filmes recomendados por juli minion',
      description: 'filmes que isis recomenda',
      createdBy: 'isis',
      createdAt: new Date().toISOString(),
      movies: []
    },
    {
      id: 'list-2',
      name: 'exp de lista com filmes que recomendei pra julis',
      description: 'filmes que a Julia recomenda',
      createdBy: 'julia',
      createdAt: new Date().toISOString(),
      movies: []
    },
    {
      id: 'list-3',
      name: 'vamos assistir juntas',
      description: 'filmes que queremos ver juntas!',
      createdBy: 'isis',
      createdAt: new Date().toISOString(),
      movies: []
    }
  ]
};

export function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    Object.keys(DEFAULT_STATE.profiles).forEach(id => {
      if (!parsed.profiles[id].favorites) {
        parsed.profiles[id].favorites = DEFAULT_STATE.profiles[id].favorites;
      } else {
        // Migration to fix broken TMDB paths in user's localStorage
        parsed.profiles[id].favorites = parsed.profiles[id].favorites.map(fav => {
          if (fav.tmdbId === 211672) fav.posterPath = '/caq9Xi6b1sZNREfzFBO2tRIBzWn.jpg';
          if (fav.tmdbId === 438148) fav.posterPath = '/iTP3mMw0AoqmScYzDoMmYeKxYe.jpg';
          if (fav.tmdbId === 20352) fav.posterPath = '/rYZzutMXxvirK9gK01iLo3Blaj3.jpg';
          if (fav.tmdbId === 93456) fav.posterPath = '/7mYMq6OQyum1wAiUI7i6w78YKEO.jpg';
          return fav;
        });
      }
      
      // Sincroniza sempre os dados principais do perfil com o DEFAULT_STATE
      // para que alterações feitas no código (como bio, cover e nome) apareçam na tela
      parsed.profiles[id].name = DEFAULT_STATE.profiles[id].name;
      parsed.profiles[id].bio = DEFAULT_STATE.profiles[id].bio;
      parsed.profiles[id].cover = DEFAULT_STATE.profiles[id].cover;
      parsed.profiles[id].avatar = DEFAULT_STATE.profiles[id].avatar;
      
    });
    return parsed;
  } catch {
    setState(DEFAULT_STATE);
    return DEFAULT_STATE;
  }
}

export function setState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateState(fn) {
  const state = getState();
  fn(state);
  setState(state);
  return state;
}

// Profile
export function getCurrentProfile() {
  const state = getState();
  return state.profiles[state.currentProfile];
}

export function setCurrentProfile(profileId) {
  updateState(s => { s.currentProfile = profileId; });
}

export function getProfile(id) {
  return getState().profiles[id];
}

export function getProfileStats(profileId) {
  const state = getState();
  const lists = state.lists;
  const listsCreated = lists.filter(l => l.createdBy === profileId).length;
  let moviesAdded = 0;
  let moviesWatched = 0;
  lists.forEach(l => {
    l.movies.forEach(m => {
      if (m.addedBy === profileId) moviesAdded++;
      if (m.watched) moviesWatched++;
    });
  });
  return { listsCreated, moviesAdded, moviesWatched };
}

// Lists
export function getLists() {
  return getState().lists;
}

export function getList(id) {
  return getState().lists.find(l => l.id === id);
}

export function createList({ name, description, emoji }) {
  const state = getState();
  const newList = {
    id: 'list-' + Date.now(),
    name,
    description: description || '',
    emoji: '',
    createdBy: state.currentProfile,
    createdAt: new Date().toISOString(),
    movies: []
  };
  updateState(s => { s.lists.unshift(newList); });
  return newList;
}

export function deleteList(id) {
  updateState(s => { s.lists = s.lists.filter(l => l.id !== id); });
}

export function updateList(id, updates) {
  updateState(s => {
    const list = s.lists.find(l => l.id === id);
    if (list) Object.assign(list, updates);
  });
}

// Movies in lists
export function addMovieToList(listId, movieData) {
  const state = getState();
  const list = state.lists.find(l => l.id === listId);
  if (!list) return false;
  // Check if already exists
  if (list.movies.some(m => m.tmdbId === movieData.id)) return false;

  const movie = {
    tmdbId: movieData.id,
    title: movieData.title,
    year: movieData.release_date ? movieData.release_date.split('-')[0] : '',
    posterPath: movieData.poster_path,
    overview: movieData.overview || '',
    watched: false,
    watchedDate: null,
    rating: 0,
    comment: '',
    addedBy: state.currentProfile,
    addedAt: new Date().toISOString()
  };
  list.movies.push(movie);
  setState(state);
  return true;
}

export function removeMovieFromList(listId, tmdbId) {
  updateState(s => {
    const list = s.lists.find(l => l.id === listId);
    if (list) list.movies = list.movies.filter(m => m.tmdbId !== tmdbId);
  });
}

export function toggleWatched(listId, tmdbId) {
  let newVal = false;
  updateState(s => {
    const list = s.lists.find(l => l.id === listId);
    if (!list) return;
    const movie = list.movies.find(m => m.tmdbId === tmdbId);
    if (!movie) return;
    movie.watched = !movie.watched;
    movie.watchedDate = movie.watched ? new Date().toISOString() : null;
    newVal = movie.watched;
  });
  return newVal;
}

export function setRating(listId, tmdbId, rating) {
  updateState(s => {
    const list = s.lists.find(l => l.id === listId);
    if (!list) return;
    const movie = list.movies.find(m => m.tmdbId === tmdbId);
    if (movie) movie.rating = rating;
  });
}

export function setComment(listId, tmdbId, comment) {
  updateState(s => {
    const list = s.lists.find(l => l.id === listId);
    if (!list) return;
    const movie = list.movies.find(m => m.tmdbId === tmdbId);
    if (movie) movie.comment = comment;
  });
}

// Export / Import
export function exportData() {
  const state = getState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `julisisboxd_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.profiles || !data.lists) {
          reject(new Error('Arquivo inválido'));
          return;
        }
        setState(data);
        resolve(data);
      } catch {
        reject(new Error('Erro ao ler arquivo'));
      }
    };
    reader.readAsText(file);
  });
}

// Get all movies across all lists (for stats)
export function getAllMovies() {
  const state = getState();
  const all = [];
  state.lists.forEach(l => {
    l.movies.forEach(m => {
      all.push({ ...m, listId: l.id, listName: l.name });
    });
  });
  return all;
}
