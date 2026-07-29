<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
    :class="classes[status]"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClasses[status]" />
    {{ label }}
  </span>
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

const classes = {
  pending: 'bg-pending-bg text-pending',
  published: 'bg-published-bg text-published',
  rejected: 'bg-rejected-bg text-rejected',
};

const dotClasses = {
  pending: 'bg-pending',
  published: 'bg-published',
  rejected: 'bg-rejected',
};

const label = computed(() => LABELS[props.status] || props.status);
</script>
