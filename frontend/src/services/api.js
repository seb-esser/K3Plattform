import axios from 'axios';
import router from '../router';
import { useAuthStore } from '../stores/auth';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
