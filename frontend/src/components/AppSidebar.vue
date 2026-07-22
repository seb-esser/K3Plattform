<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <img src="/logos/kjr.png" alt="KJR Weilheim-Schongau" class="logo logo-kjr" />
      <a href="https://kjr-wm-sog.de" target="_blank" rel="noopener" class="btn btn-outline link-btn">
        KJR WM SOG
      </a>
      <img src="/logos/logo-koja.jpg" alt="KoJa Weilheim-Schongau" class="logo logo-koja" />
      <a
        href="https://www.weilheim-schongau.de/landkreis/jugend-und-familie/koja/"
        target="_blank"
        rel="noopener"
        class="btn btn-outline link-btn"
      >
        KoJa WM SOG
      </a>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-link">Start</RouterLink>
      <RouterLink to="/map" class="nav-link">Karte</RouterLink>
      <RouterLink to="/submit" class="nav-link">Angebot einsenden</RouterLink>
      <RouterLink v-if="auth.isEditor" to="/review" class="nav-link">
        Review-Queue
        <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
      </RouterLink>
      <RouterLink to="/impressum" class="nav-link">Impressum</RouterLink>
    </nav>

    <div class="sidebar-auth">
      <template v-if="auth.isAuthenticated">
        <p class="auth-name">{{ auth.user.name }}</p>
        <p class="auth-role">{{ auth.isEditor ? 'Redakteur:in' : auth.user.role }}</p>
        <button class="btn btn-outline" @click="handleLogout">Logout</button>
      </template>
      <RouterLink v-else to="/login" class="btn btn-outline">Login</RouterLink>
    </div>

    <p class="copyright">Copyright &copy;&#65039; {{ year }}</p>
  </aside>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useEventsStore } from '../stores/events';

const auth = useAuthStore();
const events = useEventsStore();
const router = useRouter();

const year = new Date().getFullYear();
const pendingCount = computed(() => events.pending.length);

watchEffect(() => {
  if (auth.isEditor) {
    events.fetchPending();
  }
});

function handleLogout() {
  auth.logout();
  router.push('/');
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  gap: 1.5rem;
}

.sidebar-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  max-width: 100px;
  border-radius: var(--radius-sm);
  background: white;
  padding: 4px;
}

.link-btn {
  color: var(--color-text-on-primary);
  border-color: rgba(247, 245, 240, 0.5);
  width: 100%;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.link-btn:hover {
  background: rgba(247, 245, 240, 0.12);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  color: var(--color-text-on-primary);
  text-decoration: none;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(247, 245, 240, 0.15);
}

.badge {
  background: var(--color-accent);
  color: var(--color-primary-dark);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.05rem 0.5rem;
}

.sidebar-auth {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(247, 245, 240, 0.2);
}

.auth-name {
  margin: 0;
  font-weight: 600;
}

.auth-role {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: rgba(247, 245, 240, 0.75);
}

.sidebar-auth .btn {
  width: 100%;
  justify-content: center;
}

.copyright {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(247, 245, 240, 0.6);
  text-align: center;
}

@media (max-width: 860px) {
  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.75rem 1rem;
  }
  .sidebar-brand {
    flex-direction: row;
  }
  .logo {
    max-width: 40px;
  }
  .link-btn {
    display: none;
  }
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .sidebar-auth {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
  .copyright {
    display: none;
  }
}
</style>
