<template>
  <aside
    class="flex w-full shrink-0 flex-row items-center gap-3 bg-gradient-to-b from-primary to-primary-dark px-4 py-3 text-text-on-primary md:w-[var(--sidebar-width)] md:flex-col md:items-stretch md:gap-6 md:px-5 md:py-6"
  >
    <div class="hidden flex-col items-center gap-2 md:flex">
      <img src="/logos/kjr.png" alt="KJR Weilheim-Schongau" class="w-24 rounded-lg bg-white p-1 shadow-soft" />
      <a
        href="https://kjr-wm-sog.de"
        target="_blank"
        rel="noopener"
        class="btn btn-outline mb-1 w-full justify-center border-white/40 text-text-on-primary hover:border-white hover:bg-white/10"
      >
        KJR WM SOG
      </a>
      <img src="/logos/logo-koja.jpg" alt="KoJa Weilheim-Schongau" class="w-24 rounded-lg bg-white p-1 shadow-soft" />
      <a
        href="https://www.weilheim-schongau.de/landkreis/jugend-und-familie/koja/"
        target="_blank"
        rel="noopener"
        class="btn btn-outline w-full justify-center border-white/40 text-text-on-primary hover:border-white hover:bg-white/10"
      >
        KoJa WM SOG
      </a>
    </div>

    <img src="/logos/kjr.png" alt="K3 Plattform" class="h-9 w-9 rounded-md bg-white p-1 md:hidden" />

    <nav class="flex flex-1 flex-row flex-wrap items-center gap-1 md:flex-col md:items-stretch md:gap-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-text-on-primary/85 transition-colors hover:bg-white/10 hover:text-text-on-primary"
        active-class="!bg-white/15 !text-text-on-primary"
      >
        <component :is="item.icon" class="h-5 w-5 shrink-0 opacity-90" />
        <span class="hidden md:inline">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto hidden rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-primary-dark md:inline"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </nav>

    <div class="ml-auto hidden flex-col md:ml-0 md:mt-auto md:flex md:border-t md:border-white/15 md:pt-4">
      <template v-if="auth.isAuthenticated">
        <p class="m-0 text-sm font-semibold">{{ auth.user.name }}</p>
        <p class="m-0 mb-2 text-xs text-text-on-primary/70">{{ auth.isEditor ? 'Redakteur:in' : auth.user.role }}</p>
        <button
          class="btn btn-outline w-full justify-center border-white/40 text-text-on-primary hover:border-white hover:bg-white/10"
          @click="handleLogout"
        >
          <ArrowRightOnRectangleIcon class="h-4 w-4" />
          Logout
        </button>
      </template>
      <RouterLink
        v-else
        to="/login"
        class="btn btn-outline w-full justify-center border-white/40 text-text-on-primary hover:border-white hover:bg-white/10"
      >
        <ArrowLeftOnRectangleIcon class="h-4 w-4" />
        Login
      </RouterLink>
    </div>

    <RouterLink v-if="!auth.isAuthenticated" to="/login" class="ml-auto md:hidden" aria-label="Login">
      <ArrowLeftOnRectangleIcon class="h-6 w-6" />
    </RouterLink>
    <button v-else class="ml-auto md:hidden" aria-label="Logout" @click="handleLogout">
      <ArrowRightOnRectangleIcon class="h-6 w-6" />
    </button>

    <p class="hidden text-center text-xs text-text-on-primary/50 md:block">Copyright &copy;&#65039; {{ year }}</p>
  </aside>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  HomeIcon,
  MapIcon,
  PaperAirplaneIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/auth';
import { useEventsStore } from '../stores/events';

const auth = useAuthStore();
const events = useEventsStore();
const router = useRouter();

const year = new Date().getFullYear();
const pendingCount = computed(() => events.pending.length);

const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Start', icon: HomeIcon },
    { to: '/map', label: 'Karte', icon: MapIcon },
    { to: '/submit', label: 'Angebot einsenden', icon: PaperAirplaneIcon },
  ];
  if (auth.isEditor) {
    items.push({
      to: '/review',
      label: 'Review-Queue',
      icon: ClipboardDocumentCheckIcon,
      badge: pendingCount.value > 0 ? pendingCount.value : null,
    });
  }
  items.push({ to: '/impressum', label: 'Impressum', icon: InformationCircleIcon });
  return items;
});

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
