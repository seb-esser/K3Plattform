import { defineStore } from 'pinia';
import api from '../services/api';

export const useEventsStore = defineStore('events', {
  state: () => ({
    published: [],
    pending: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPublished() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/events');
        this.published = data;
      } catch (err) {
        this.error = 'Angebote konnten nicht geladen werden.';
      } finally {
        this.loading = false;
      }
    },
    async fetchPending() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/events/pending');
        this.pending = data;
      } catch (err) {
        this.error = 'Warteschlange konnte nicht geladen werden.';
      } finally {
        this.loading = false;
      }
    },
    async submitEvent(formData) {
      const { data } = await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    async updateEvent(id, patch) {
      const { data } = await api.patch(`/events/${id}`, patch);
      this._replaceInLists(data);
      return data;
    },
    async publishEvent(id, { lat, lng, ...rest }) {
      return this.updateEvent(id, { ...rest, lat, lng, status: 'published' });
    },
    async rejectEvent(id) {
      return this.updateEvent(id, { status: 'rejected' });
    },
    async deleteEvent(id) {
      await api.delete(`/events/${id}`);
      this.published = this.published.filter((e) => e.id !== id);
      this.pending = this.pending.filter((e) => e.id !== id);
    },
    _replaceInLists(event) {
      const replace = (list) => {
        const idx = list.findIndex((e) => e.id === event.id);
        if (idx !== -1) list.splice(idx, 1);
      };
      replace(this.published);
      replace(this.pending);
      if (event.status === 'published') this.published.push(event);
      if (event.status === 'pending') this.pending.push(event);
    },
  },
});
