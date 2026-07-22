import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/map', name: 'map', component: () => import('../views/MapView.vue') },
  { path: '/submit', name: 'submit', component: () => import('../views/SubmitView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewQueueView.vue'),
    meta: { requiresAuth: true, requiresEditor: true },
  },
  { path: '/impressum', name: 'impressum', component: () => import('../views/ImpressumView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresEditor && !authStore.isEditor) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
