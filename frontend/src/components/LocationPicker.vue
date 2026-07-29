<template>
  <div ref="wrapEl" class="location-picker overflow-hidden rounded-xl border border-border">
    <LMap
      ref="mapRef"
      :zoom="16"
      :center="center"
      :use-global-leaflet="false"
      style="height: 260px; width: 100%"
      @click="onMapClick"
      @ready="onMapReady"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; OpenStreetMap contributors"
      />
      <LMarker v-if="markerPosition" :lat-lng="markerPosition" draggable @dragend="onDragEnd" />
    </LMap>
    <p class="m-0 bg-surface-alt px-3 py-2 text-sm text-text-muted">
      {{ markerPosition ? `Position: ${markerPosition[0].toFixed(5)}, ${markerPosition[1].toFixed(5)}` : 'Klicke auf die Karte, um eine Position zu setzen.' }}
      <button
        v-if="markerPosition && clearable"
        type="button"
        class="ml-2 border-none bg-transparent p-0 text-sm text-primary-light underline"
        @click="clearPosition"
      >
        Position entfernen
      </button>
    </p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

const props = defineProps({
  modelValue: { type: Object, default: null }, // { lat, lng }
  clearable: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue']);

const DEFAULT_CENTER = [47.8397, 11.14411];
const wrapEl = ref(null);
let leafletMap = null;
let resizeObserver = null;

const center = computed(() => (props.modelValue ? [props.modelValue.lat, props.modelValue.lng] : DEFAULT_CENTER));
const markerPosition = computed(() => (props.modelValue ? [props.modelValue.lat, props.modelValue.lng] : null));

function onMapReady(mapInstance) {
  leafletMap = mapInstance;
  leafletMap.invalidateSize();
}

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

onMounted(() => {
  resizeObserver = new ResizeObserver(() => leafletMap?.invalidateSize());
  if (wrapEl.value) resizeObserver.observe(wrapEl.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.location-picker :deep(.leaflet-container) {
  border-radius: 0.7rem 0.7rem 0 0;
}
</style>
