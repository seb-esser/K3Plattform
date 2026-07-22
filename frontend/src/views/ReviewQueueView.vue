<template>
  <div>
    <h1>Review-Queue</h1>
    <p v-if="events.error" class="error">{{ events.error }}</p>

    <p v-if="!events.loading && events.pending.length === 0" class="empty">
      Aktuell liegen keine Angebote zur Prüfung vor.
    </p>

    <div class="queue-list">
      <EventCard
        v-for="event in events.pending"
        :key="event.id"
        :event="event"
        @publish-request="handlePublishRequest"
        @reject-request="handleRejectRequest"
      />
    </div>

    <EventEditModal
      v-if="publishingEvent"
      :event="publishingEvent"
      mode="publish"
      @close="publishingEvent = null"
      @saved="publishingEvent = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEventsStore } from '../stores/events';
import EventCard from '../components/EventCard.vue';
import EventEditModal from '../components/EventEditModal.vue';

const events = useEventsStore();
const publishingEvent = ref(null);

onMounted(() => {
  events.fetchPending();
});

function handlePublishRequest(event) {
  publishingEvent.value = event;
}

async function handleRejectRequest(event) {
  if (!confirm(`Angebot von "${event.organizer}" wirklich ablehnen?`)) return;
  try {
    await events.rejectEvent(event.id);
  } catch (err) {
    events.error = 'Ablehnen fehlgeschlagen.';
  }
}
</script>

<style scoped>
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error {
  color: var(--color-status-rejected-text);
}
.empty {
  color: var(--color-text-muted);
}
</style>
