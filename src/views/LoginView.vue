<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { loading, error, signInWithPassword } = useAuth();

const email = ref('');
const password = ref('');

async function onSubmit() {
  await signInWithPassword(email.value, password.value);
  const redirect = (route.query.redirect as string) || '/';
  router.push(redirect);
}
</script>

<template>
  <main class="mx-auto flex min-h-[calc(100vh-57px)] max-w-md flex-col items-center justify-center px-4">
    <div class="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="mb-1 text-xl font-bold text-slate-900">Connexion</h1>
      <p class="mb-5 text-sm text-slate-500">Accédez au suivi de prospection.</p>

      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">
          {{ error.message }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        >
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </main>
</template>
