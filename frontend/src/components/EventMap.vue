<template>
  <LMap :zoom="16" :center="center" :use-global-leaflet="false" style="height: 100%; width: 100%">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&amp;copy; OpenStreetMap contributors"
    />
    <LMarker
      v-for="event in locatedEvents"
      :key="event.id"
      :lat-lng="[event.lat, event.lng]"
      :draggable="editable"
      @dragend="onDragEnd(event, $event)"
    >
      <LTooltip>{{ event.organizer }}</LTooltip>
      <LPopup>
        <div class="popup">
          <p class="popup-title">{{ event.organizer }}</p>
          <StatusBadge :status="event.status" />
          <p class="popup-dates">
            {{ event.startDate }} {{ event.startTime }} &ndash; {{ event.endDate }} {{ event.endTime }}
          </p>
          <p v-if="event.newsletterDescription" class="popup-desc">{{ event.newsletterDescription }}</p>
          <div v-if="editable" class="popup-actions">
            <button class="btn btn-outline btn-sm" @click="$emit('edit-request', event)">Bearbeiten</button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-request', event)">Löschen</button>
          </div>
        </div>
      </LPopup>
    </LMarker>
  </LMap>
</template>

<script setup>
import { computed } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  events: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(['marker-dragend', 'edit-request', 'delete-request']);

const center = [47.8397, 11.14411];

const locatedEvents = computed(() => props.events.filter((e) => e.lat != null && e.lng != null));

function onDragEnd(event, leafletEvent) {
  const { lat, lng } = leafletEvent.target.getLatLng();
  emit('marker-dragend', { event, lat, lng });
}
</script>

<style scoped>
.popup {
  min-width: 200px;
}
.popup-title {
  font-weight: 700;
  margin: 0 0 0.35rem;
}
.popup-dates {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin: 0.5rem 0;
}
.popup-desc {
  margin: 0.35rem 0;
}
.popup-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
}
.btn-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}
</style>
