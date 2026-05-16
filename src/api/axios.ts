import axios from 'axios';

// Cria uma instância do axios já configurada com a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor: antes de TODA requisição, pega o token salvo e coloca no cabeçalho
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;