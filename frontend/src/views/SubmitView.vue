<template>
  <div>
    <h1>[AKTEUR] Neues Angebot einsenden</h1>
    <p class="mb-6 text-text-muted">
      Hier kannst Du uns Daten übermitteln, die wir über die bekannten Channels ausspielen können.
    </p>

    <div v-if="submitted" class="card max-w-[480px] border-l-4 border-published bg-published-bg/40">
      <p>
        Danke! Dein Angebot wurde übermittelt und wird von unserem Team geprüft. Bitte beachte, dass wir für die
        Verarbeitung bis zu 7 Tage benötigen.
      </p>
      <button class="btn btn-outline" @click="resetForm">Weiteres Angebot einsenden</button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="max-w-3xl">
      <div class="card">
        <h2>Basisdaten</h2>
        <div class="form-grid items-start">
          <div>
            <div class="field">
              <label>Veranstalter</label>
              <input v-model="form.organizer" type="text" required />
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
          <div>
            <div class="field">
              <label>Standort (optional)</label>
              <LocationPicker v-model="location" />
              <p class="field-hint">
                Optional – die genaue Verortung nehmen unsere Redakteur:innen bei Bedarf noch vor.
              </p>
            </div>
          </div>
        </div>

        <div class="field mb-0">
          <label>Gewünschtes Publikationsdatum</label>
          <input v-model="form.publishDate" type="date" required />
          <p class="field-hint">
            Bitte beachte, dass wir für die Verarbeitung Deines Angebots bis zu 7 Tage benötigen.
          </p>
        </div>
      </div>

      <details class="card group mt-5" open>
        <summary
          class="flex cursor-pointer list-none items-center justify-between font-bold text-primary-dark [&::-webkit-details-marker]:hidden"
        >
          Newsletter
          <ChevronDownIcon class="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>
        <div class="mt-4">
          <div class="field">
            <label>Deine Überschrift</label>
            <input v-model="form.newsletterTitle" type="text" />
          </div>
          <div class="field">
            <label>Beschreibe Dein Angebot</label>
            <textarea v-model="form.newsletterDescription" rows="3"></textarea>
          </div>
          <div class="field">
            <label>Begleitende Dateien (z.B. Bilder, Videos, ...)</label>
            <input type="file" multiple @change="onFileChange($event, 'newsletterFiles')" />
          </div>
          <label class="mb-2 flex items-center gap-2 font-normal">
            <input v-model="form.newsletterDistributePrivate" type="checkbox" class="w-auto" />
            Verteilung im Newsletter für Privatpersonen.
          </label>
          <label class="mb-2 flex items-center gap-2 font-normal">
            <input v-model="form.newsletterDistributePublic" type="checkbox" class="w-auto" />
            Verteilung im Newsletter für öffentliche Einrichtungen (Schulen, Gemeinde- und Stadtverwaltungen, ...).
          </label>
        </div>
      </details>

      <details class="card group mt-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between font-bold text-primary-dark [&::-webkit-details-marker]:hidden"
        >
          Instagram
          <ChevronDownIcon class="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>
        <div class="mt-4">
          <p class="field-hint mb-3">
            Bitte nummeriere die Bilder in ihrer Benennung, sodass klar wird, in welcher Reihenfolge wir sie
            veröffentlichen sollen
          </p>
          <div class="field">
            <label>Bild-Dateien für Instagram und Facebook</label>
            <input type="file" multiple @change="onFileChange($event, 'instagramFiles')" />
          </div>
          <div class="field">
            <label>Caption Instagram</label>
            <textarea v-model="form.instagramCaption" rows="2"></textarea>
          </div>
          <label class="mb-2 flex items-center gap-2 font-normal">
            <input v-model="form.instagramCrosspostFacebook" type="checkbox" class="w-auto" />
            Auch über Facebook ausspielen
          </label>
        </div>
      </details>

      <details class="card group mt-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between font-bold text-primary-dark [&::-webkit-details-marker]:hidden"
        >
          WhatsApp Channel
          <ChevronDownIcon class="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>
        <div class="mt-4">
          <p class="field-hint mb-3">
            Bitte nummeriere die Bilder in ihrer Benennung, sodass klar wird, in welcher Reihenfolge wir sie
            veröffentlichen sollen
          </p>
          <div class="field">
            <label>Bild-Dateien für WhatsApp-Channel</label>
            <input type="file" multiple @change="onFileChange($event, 'whatsappFiles')" />
          </div>
          <div class="field mb-0">
            <label>Caption WhatsApp-Channel</label>
            <textarea v-model="form.whatsappCaption" rows="2"></textarea>
          </div>
        </div>
      </details>

      <p v-if="error" class="mt-4 text-sm text-rejected">{{ error }}</p>

      <button type="submit" class="btn btn-primary mt-5" :disabled="submitting">
        {{ submitting ? 'Senden…' : 'Senden' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useEventsStore } from '../stores/events';
import LocationPicker from '../components/LocationPicker.vue';

const events = useEventsStore();

const initialForm = () => ({
  organizer: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  publishDate: '',
  newsletterTitle: '',
  newsletterDescription: '',
  newsletterDistributePrivate: false,
  newsletterDistributePublic: false,
  instagramCaption: '',
  instagramCrosspostFacebook: false,
  whatsappCaption: '',
});

const form = reactive(initialForm());
const location = ref(null);
const files = reactive({ newsletterFiles: [], instagramFiles: [], whatsappFiles: [] });
const submitting = ref(false);
const submitted = ref(false);
const error = ref(null);

function onFileChange(event, key) {
  files[key] = Array.from(event.target.files || []);
}

function resetForm() {
  Object.assign(form, initialForm());
  location.value = null;
  files.newsletterFiles = [];
  files.instagramFiles = [];
  files.whatsappFiles = [];
  submitted.value = false;
  error.value = null;
}

async function handleSubmit() {
  error.value = null;
  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('organizer', form.organizer);
    formData.append('start_date', form.startDate);
    formData.append('start_time', form.startTime);
    formData.append('end_date', form.endDate);
    formData.append('end_time', form.endTime);
    formData.append('publish_date', form.publishDate);
    if (location.value) {
      formData.append('lat', location.value.lat);
      formData.append('lng', location.value.lng);
    }
    formData.append('newsletter_title', form.newsletterTitle);
    formData.append('newsletter_description', form.newsletterDescription);
    formData.append('newsletter_distribute_private', form.newsletterDistributePrivate);
    formData.append('newsletter_distribute_public', form.newsletterDistributePublic);
    formData.append('instagram_caption', form.instagramCaption);
    formData.append('instagram_crosspost_facebook', form.instagramCrosspostFacebook);
    formData.append('whatsapp_caption', form.whatsappCaption);

    files.newsletterFiles.forEach((file) => formData.append('newsletter_files', file));
    files.instagramFiles.forEach((file) => formData.append('instagram_files', file));
    files.whatsappFiles.forEach((file) => formData.append('whatsapp_files', file));

    await events.submitEvent(formData);
    submitted.value = true;
  } catch (err) {
    error.value = err.response?.data?.error || 'Senden fehlgeschlagen. Bitte versuche es erneut.';
  } finally {
    submitting.value = false;
  }
}
</script>

