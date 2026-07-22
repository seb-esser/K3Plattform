<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../components/AppSidebar.vue';
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 2rem 2.5rem;
  max-width: 1100px;
}

@media (max-width: 860px) {
  .app-shell {
    flex-direction: column;
  }
  .app-main {
    padding: 1.5rem;
  }
}
</style>
