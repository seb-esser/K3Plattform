<template>
  <div class="flex justify-center pt-8 md:pt-12">
    <div class="card w-full max-w-[380px] shadow-lifted">
      <h1>Login</h1>
      <p class="field-hint mb-5">Zugang für Redakteur:innen von KJR und KoJa.</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">E-Mail</label>
          <input id="email" v-model="email" type="email" required autocomplete="username" />
        </div>
        <div class="field">
          <label for="password">Passwort</label>
          <input id="password" v-model="password" type="password" required autocomplete="current-password" />
        </div>

        <p v-if="error" class="mb-3 text-sm text-rejected">{{ error }}</p>

        <button type="submit" class="btn btn-primary w-full justify-center" :disabled="submitting">
          {{ submitting ? 'Anmelden…' : 'Anmelden' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref(null);
const submitting = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  error.value = null;
  submitting.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push(route.query.redirect || '/map');
  } catch (err) {
    error.value = 'Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.';
  } finally {
    submitting.value = false;
  }
}
</script>

