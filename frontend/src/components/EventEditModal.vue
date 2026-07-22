<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal card">
      <h2>{{ mode === 'publish' ? 'Auf Karte platzieren & veröffentlichen' : 'Angebot bearbeiten' }}</h2>

      <form @submit.prevent="handleSave">
        <div class="form-grid">
          <div class="field">
            <label>Veranstalter</label>
            <input v-model="form.organizer" type="text" required />
          </div>
          <div class="field">
            <label>Gewünschtes Publikationsdatum</label>
            <input v-model="form.publishDate" type="date" required />
          </div>
          <div class="field">
            <label>Startdatum</label>
            <input v-model="form.startDate" type="date" required />
          </div>
          <div class="field">
            <label>Startzeit</label>
            <input v-model="form.startTime" type="time" required />
          </div>
          <div class="field">
            <label>Enddatum</label>
            <input v-model="form.endDate" type="date" required />
          </div>
          <div class="field">
            <label>Endzeit</label>
            <input v-model="form.endTime" type="time" required />
          </div>
        </div>

        <div class="field">
          <label>Position auf der Karte {{ mode === 'publish' ? '(erforderlich zum Veröffentlichen)' : '' }}</label>
          <LocationPicker v-model="location" />
        </div>

        <fieldset class="section">
          <legend>Newsletter</legend>
          <div class="field">
            <label>Überschrift</label>
            <input v-model="form.newsletterTitle" type="text" />
          </div>
          <div class="field">
            <label>Beschreibung</label>
            <textarea v-model="form.newsletterDescription" rows="3"></textarea>
          </div>
          <label class="checkbox"><input v-model="form.newsletterDistributePrivate" type="checkbox" /> Verteilung im Newsletter für Privatpersonen.</label>
          <label class="checkbox"><input v-model="form.newsletterDistributePublic" type="checkbox" /> Verteilung im Newsletter für öffentliche Einrichtungen.</label>
        </fieldset>

        <fieldset class="section">
          <legend>Instagram</legend>
          <div class="field">
            <label>Caption Instagram</label>
            <textarea v-model="form.instagramCaption" rows="2"></textarea>
          </div>
          <label class="checkbox"><input v-model="form.instagramCrosspostFacebook" type="checkbox" /> Auch über Facebook ausspielen</label>
        </fieldset>

        <fieldset class="section">
          <legend>WhatsApp Channel</legend>
          <div class="field">
            <label>Caption WhatsApp-Channel</label>
            <textarea v-model="form.whatsappCaption" rows="2"></textarea>
          </div>
        </fieldset>

        <div class="field">
          <label>Interne Redaktionsnotiz</label>
          <textarea v-model="form.editorNotes" rows="2"></textarea>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="$emit('close')">Abbrechen</button>
          <button type="submit" class="btn btn-primary" :disabled="!canSave || saving">
            {{ mode === 'publish' ? 'Veröffentlichen' : 'Speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useEventsStore } from '../stores/events';
import LocationPicker from './LocationPicker.vue';

const props = defineProps({
  event: { type: Object, required: true },
  mode: { type: String, default: 'edit' }, // 'edit' | 'publish'
});
const emit = defineEmits(['close', 'saved']);

const events = useEventsStore();
const error = ref(null);
const saving = ref(false);

const form = reactive({
  organizer: props.event.organizer,
  startDate: props.event.startDate,
  startTime: props.event.startTime,
  endDate: props.event.endDate,
  endTime: props.event.endTime,
  publishDate: props.event.publishDate,
  newsletterTitle: props.event.newsletterTitle || '',
  newsletterDescription: props.event.newsletterDescription || '',
  newsletterDistributePrivate: props.event.newsletterDistributePrivate || false,
  newsletterDistributePublic: props.event.newsletterDistributePublic || false,
  instagramCaption: props.event.instagramCaption || '',
  instagramCrosspostFacebook: props.event.instagramCrosspostFacebook || false,
  whatsappCaption: props.event.whatsappCaption || '',
  editorNotes: props.event.editorNotes || '',
});

const location = ref(
  props.event.lat != null && props.event.lng != null ? { lat: props.event.lat, lng: props.event.lng } : null
);

const canSave = computed(() => (props.mode === 'publish' ? !!location.value : true));

async function handleSave() {
  error.value = null;
  saving.value = true;
  const patch = {
    organizer: form.organizer,
    start_date: form.startDate,
    start_time: form.startTime,
    end_date: form.endDate,
    end_time: form.endTime,
    publish_date: form.publishDate,
    lat: location.value ? location.value.lat : null,
    lng: location.value ? location.value.lng : null,
    newsletter_title: form.newsletterTitle,
    newsletter_description: form.newsletterDescription,
    newsletter_distribute_private: form.newsletterDistributePrivate,
    newsletter_distribute_public: form.newsletterDistributePublic,
    instagram_caption: form.instagramCaption,
    instagram_crosspost_facebook: form.instagramCrosspostFacebook,
    whatsapp_caption: form.whatsappCaption,
    editor_notes: form.editorNotes,
  };
  try {
    if (props.mode === 'publish') {
      await events.publishEvent(props.event.id, patch);
    } else {
      await events.updateEvent(props.event.id, patch);
    }
    emit('saved');
  } catch (err) {
    error.value = err.response?.data?.error || 'Speichern fehlgeschlagen.';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(13, 46, 61, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
  z-index: 1000;
}
.modal {
  width: 100%;
  max-width: 640px;
}
.section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem 1rem;
  margin: 1.25rem 0;
}
.section legend {
  font-weight: 700;
  color: var(--color-primary-dark);
  padding: 0 0.4rem;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
  margin-bottom: 0.4rem;
}
.checkbox input {
  width: auto;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.error {
  color: var(--color-status-rejected-text);
}
</style>
