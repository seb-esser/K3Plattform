<template>
  <div>
    <h1>Review-Queue</h1>
    <p v-if="events.error" class="text-sm text-rejected">{{ events.error }}</p>

    <p v-if="!events.loading && events.pending.length === 0" class="text-text-muted">
      Aktuell liegen keine Angebote zur Prüfung vor.
    </p>

    <div class="flex flex-col gap-4">
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

