<template>
  <div class="location-picker">
    <LMap :zoom="16" :center="center" style="height: 260px; width: 100%" @click="onMapClick">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; OpenStreetMap contributors"
      />
      <LMarker v-if="markerPosition" :lat-lng="markerPosition" draggable @dragend="onDragEnd" />
    </LMap>
    <p class="field-hint">
      {{ markerPosition ? `Position: ${markerPosition[0].toFixed(5)}, ${markerPosition[1].toFixed(5)}` : 'Klicke auf die Karte, um eine Position zu setzen.' }}
      <button v-if="markerPosition && clearable" type="button" class="link-button" @click="clearPosition">
        Position entfernen
      </button>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

const props = defineProps({
  modelValue: { type: Object, default: null }, // { lat, lng }
  clearable: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue']);

const DEFAULT_CENTER = [47.8397, 11.14411];

const center = computed(() => (props.modelValue ? [props.modelValue.lat, props.modelValue.lng] : DEFAULT_CENTER));
const markerPosition = computed(() => (props.modelValue ? [props.modelValue.lat, props.modelValue.lng] : null));

function onMapClick(event) {
  const { lat, lng } = event.latlng;
  emit('update:modelValue', { lat, lng });
}

function onDragEnd(event) {
  const { lat, lng } = event.target.getLatLng();
  emit('update:modelValue', { lat, lng });
}

function clearPosition() {
  emit('update:modelValue', null);
}
</script>

<style scoped>
.location-picker {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.location-picker :deep(.leaflet-container) {
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}
.field-hint {
  padding: 0.5rem 0.75rem;
  margin: 0;
  background: var(--color-surface-alt);
}
.link-button {
  background: none;
  border: none;
  color: var(--color-primary-light);
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  font-size: inherit;
  text-decoration: underline;
}
</style>
