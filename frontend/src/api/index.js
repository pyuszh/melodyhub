import axios from 'axios';

// ── Replace with your Render backend URL ──────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const logout   = ()     => api.post('/auth/logout');

// ── Music ─────────────────────────────────────────────────────────────────────
export const getAllMusics  = ()          => api.get('/music');
export const getAllAlbums  = ()          => api.get('/music/albums');
export const getAlbumById = (albumId)   => api.get(`/music/albums/${albumId}`);

export const uploadMusic = (formData) =>
  api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const createAlbum = (data) => api.post('/music/album', data);

export default api;
