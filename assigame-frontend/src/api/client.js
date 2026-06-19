import axios from 'axios';

// URL du backend Spring Boot. Configurable via .env (VITE_API_URL).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Extrait un message d'erreur lisible depuis une réponse du backend
// (le backend renvoie { message: "..." } en cas d'erreur 4xx).
export const getErrorMessage = (err, fallback = 'Une erreur est survenue. Veuillez réessayer.') => {
  return err?.response?.data?.message || fallback;
};

export default client;
