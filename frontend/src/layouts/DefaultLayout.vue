<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <AppSidebar />
    <main class="mx-auto flex w-full min-h-0 max-w-[1100px] flex-1 flex-col px-4 py-6 md:px-10 md:py-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../components/AppSidebar.vue';
</script>
