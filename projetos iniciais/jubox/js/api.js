// TMDB API wrapper
// Replace with your own key from https://www.themoviedb.org/settings/api
const API_KEY = 'SUA_API_KEY_AQUI';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// Simple cache
const cache = new Map();

function getCacheKey(endpoint, params) {
  return `${endpoint}?${new URLSearchParams(params).toString()}`;
}

async function fetchTMDB(endpoint, params = {}) {
  const allParams = { api_key: API_KEY, language: 'pt-BR', ...params };
  const cacheKey = getCacheKey(endpoint, allParams);

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `${BASE_URL}${endpoint}?${new URLSearchParams(allParams)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error('TMDB fetch error:', err);
    return null;
  }
}

export async function searchMovies(query) {
  if (!query || query.length < 2) return [];
  const data = await fetchTMDB('/search/movie', { query });
  return data?.results || [];
}

export async function getMovieDetails(id) {
  const data = await fetchTMDB(`/movie/${id}`);
  return data;
}

export async function getPopularMovies() {
  const data = await fetchTMDB('/movie/popular');
  return data?.results || [];
}

export function getPosterUrl(posterPath, size = 'w342') {
  if (!posterPath) return null;
  if (posterPath.startsWith('http')) return posterPath;
  return `${IMG_BASE}/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath, size = 'w780') {
  if (!backdropPath) return null;
  return `${IMG_BASE}/${size}${backdropPath}`;
}
