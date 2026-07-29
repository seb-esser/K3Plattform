<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <h1>Kommende Angebote</h1>
    <p v-if="events.error" class="text-sm text-rejected">{{ events.error }}</p>

    <div class="card relative mt-2 min-h-[520px] flex-1 overflow-hidden p-0">
      <EventMap
        :events="events.published"
        :editable="auth.isEditor"
        @marker-dragend="handleDragEnd"
        @edit-request="handleEditRequest"
        @delete-request="handleDeleteRequest"
      />
    </div>

    <EventEditModal
      v-if="editingEvent"
      :event="editingEvent"
      mode="edit"
      @close="editingEvent = null"
      @saved="editingEvent = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useEventsStore } from '../stores/events';
import EventMap from '../components/EventMap.vue';
import EventEditModal from '../components/EventEditModal.vue';

const auth = useAuthStore();
const events = useEventsStore();
const editingEvent = ref(null);

onMounted(() => {
  events.fetchPublished();
});

async function handleDragEnd({ event, lat, lng }) {
  try {
    await events.updateEvent(event.id, { lat, lng });
  } catch (err) {
    events.error = 'Position konnte nicht gespeichert werden.';
  }
}

function handleEditRequest(event) {
  editingEvent.value = event;
}

async function handleDeleteRequest(event) {
  if (!confirm(`"${event.organizer}" wirklich von der Karte löschen?`)) return;
  try {
    await events.deleteEvent(event.id);
  } catch (err) {
    events.error = 'Eintrag konnte nicht gelöscht werden.';
  }
}
</script>

