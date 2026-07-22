<template>
  <span class="status-badge" :class="`status-${status}`">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
});

const LABELS = {
  pending: 'Ausstehend',
  published: 'Veröffentlicht',
  rejected: 'Abgelehnt',
};

const label = computed(() => LABELS[props.status] || props.status);
</script>

<style scoped>
.status-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 0.15rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
}
.status-pending {
  background: var(--color-status-pending-bg);
  color: var(--color-status-pending-text);
}
.status-published {
  background: var(--color-status-published-bg);
  color: var(--color-status-published-text);
}
.status-rejected {
  background: var(--color-status-rejected-bg);
  color: var(--color-status-rejected-text);
}
</style>
