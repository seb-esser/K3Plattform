import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('k3_token') || null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isEditor: (state) => !!state.user && ['editor', 'admin'].includes(state.user.role),
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('k3_token', data.token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('k3_token');
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const { data } = await api.get('/auth/me');
        this.user = data;
      } catch (err) {
        this.logout();
      }
    },
  },
});
