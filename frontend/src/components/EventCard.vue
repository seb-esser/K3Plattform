<template>
  <div class="card event-card">
    <div class="event-card-header">
      <h3>{{ event.organizer }}</h3>
      <StatusBadge :status="event.status" />
    </div>
    <p class="dates">{{ event.startDate }} {{ event.startTime }} &ndash; {{ event.endDate }} {{ event.endTime }}</p>
    <p class="publish-date">Gewünschtes Publikationsdatum: {{ event.publishDate }}</p>

    <div v-if="event.newsletterTitle || event.newsletterDescription" class="detail-block">
      <p class="detail-label">Newsletter</p>
      <p v-if="event.newsletterTitle" class="detail-title">{{ event.newsletterTitle }}</p>
      <p v-if="event.newsletterDescription">{{ event.newsletterDescription }}</p>
    </div>

    <div v-if="event.instagramCaption" class="detail-block">
      <p class="detail-label">Instagram{{ event.instagramCrosspostFacebook ? ' + Facebook' : '' }}</p>
      <p>{{ event.instagramCaption }}</p>
    </div>

    <div v-if="event.whatsappCaption" class="detail-block">
      <p class="detail-label">WhatsApp</p>
      <p>{{ event.whatsappCaption }}</p>
    </div>

    <div v-if="event.attachments.length" class="attachments">
      <p class="detail-label">Anhänge</p>
      <a v-for="a in event.attachments" :key="a.id" :href="a.url" target="_blank" rel="noopener" class="attachment">
        {{ a.originalFilename }} ({{ a.channel }})
      </a>
    </div>

    <div class="event-card-actions">
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

<style scoped>
.event-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.event-card-header h3 {
  margin: 0;
}
.dates,
.publish-date {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0.3rem 0;
}
.detail-block {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}
.detail-label {
  font-weight: 700;
  color: var(--color-primary-dark);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0 0 0.25rem;
}
.detail-title {
  font-weight: 600;
  margin: 0 0 0.25rem;
}
.attachments {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.attachment {
  font-size: 0.9rem;
}
.event-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
