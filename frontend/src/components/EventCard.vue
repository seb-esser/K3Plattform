<template>
  <div class="card transition-shadow hover:shadow-lifted">
    <div class="flex items-center justify-between gap-3">
      <h3 class="m-0 text-lg font-bold text-primary-dark">{{ event.organizer }}</h3>
      <StatusBadge :status="event.status" />
    </div>
    <p class="my-1 text-sm text-text-muted">
      {{ event.startDate }} {{ event.startTime }} &ndash; {{ event.endDate }} {{ event.endTime }}
    </p>
    <p class="my-1 text-sm text-text-muted">Gewünschtes Publikationsdatum: {{ event.publishDate }}</p>

    <div v-if="event.newsletterTitle || event.newsletterDescription" class="mt-3 border-t border-border pt-3">
      <p class="mb-1 text-xs font-bold uppercase tracking-wide text-primary-dark">Newsletter</p>
      <p v-if="event.newsletterTitle" class="mb-1 font-semibold">{{ event.newsletterTitle }}</p>
      <p v-if="event.newsletterDescription" class="text-sm">{{ event.newsletterDescription }}</p>
    </div>

    <div v-if="event.instagramCaption" class="mt-3 border-t border-border pt-3">
      <p class="mb-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
        Instagram{{ event.instagramCrosspostFacebook ? ' + Facebook' : '' }}
      </p>
      <p class="text-sm">{{ event.instagramCaption }}</p>
    </div>

    <div v-if="event.whatsappCaption" class="mt-3 border-t border-border pt-3">
      <p class="mb-1 text-xs font-bold uppercase tracking-wide text-primary-dark">WhatsApp</p>
      <p class="text-sm">{{ event.whatsappCaption }}</p>
    </div>

    <div v-if="event.attachments.length" class="mt-3 flex flex-col gap-1 border-t border-border pt-3">
      <p class="mb-1 text-xs font-bold uppercase tracking-wide text-primary-dark">Anhänge</p>
      <a
        v-for="a in event.attachments"
        :key="a.id"
        :href="a.url"
        target="_blank"
        rel="noopener"
        class="text-sm underline"
      >
        {{ a.originalFilename }} ({{ a.channel }})
      </a>
    </div>

    <div class="mt-4 flex flex-wrap gap-3">
      <button class="btn btn-primary" @click="$emit('publish-request', event)">
        Auf Karte platzieren &amp; veröffentlichen
      </button>
      <button class="btn btn-danger" @click="$emit('reject-request', event)">Ablehnen</button>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  event: { type: Object, required: true },
});
defineEmits(['publish-request', 'reject-request']);
</script>
