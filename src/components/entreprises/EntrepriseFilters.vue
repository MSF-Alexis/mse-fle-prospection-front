<script setup lang="ts">
import { ref } from 'vue';
import { STATUT_OPTIONS } from '@/helpers/statut';
import type { EntreprisesQuery } from '@/types/Entreprise';

const filters = defineModel<EntreprisesQuery>({ required: true });
const emit = defineEmits<{ submit: []; reset: [] }>();
const geoError = ref('');
const showRefPoint = ref(false);

function onSubmit() {
  emit('submit');
}

function onReset() {
  emit('reset');
}

function useMyLocation() {
  geoError.value = '';
  if (!('geolocation' in navigator)) {
    geoError.value = "La géolocalisation n'est pas disponible sur ce navigateur.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      filters.value.ref_lat = Number(position.coords.latitude.toFixed(6));
      filters.value.ref_lon = Number(position.coords.longitude.toFixed(6));
      onSubmit();
    },
    () => {
      geoError.value = 'Position indisponible ou accès refusé.';
    },
  );
}
</script>

<template>
  <form
    class="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    @submit.prevent="onSubmit"
  >
    <div class="lg:col-span-2">
      <label class="mb-1 block text-xs font-medium text-slate-500">Recherche</label>
      <input
        v-model="filters.q"
        type="text"
        placeholder="Nom, sigle, SIREN, commune, code postal…"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-500">Département</label>
      <input
        v-model="filters.departement"
        type="text"
        placeholder="ex. 75"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-500">Code NAF</label>
      <input
        v-model="filters.activite"
        type="text"
        placeholder="ex. 33.20A"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-500">Statut de prospection</label>
      <select
        v-model="filters.statut"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        @change="onSubmit"
      >
        <option value="">Tous les statuts</option>
        <option v-for="option in STATUT_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-500">
        Distance max (km) — depuis le point de référence
      </label>
      <input
        v-model.number="filters.distance_max"
        type="number"
        min="0"
        step="1"
        placeholder="ex. 30"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-500">Trier par</label>
      <select
        v-model="filters.sort"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        @change="onSubmit"
      >
        <option value="nom">Nom (A → Z)</option>
        <option value="distance">Proximité (point de référence)</option>
      </select>
    </div>

    <div class="flex items-end gap-2 lg:col-span-1">
      <button
        type="submit"
        class="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        Rechercher
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        @click="onReset"
      >
        Réinitialiser
      </button>
    </div>

    <div class="col-span-full border-t border-slate-100 pt-3">
      <button
        type="button"
        class="text-xs font-medium text-blue-600 hover:underline"
        @click="showRefPoint = !showRefPoint"
      >
        {{ showRefPoint ? 'Masquer' : 'Modifier' }} le point de référence pour le calcul de distance
      </button>

      <div v-if="showRefPoint" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Latitude de référence</label>
          <input
            v-model.number="filters.ref_lat"
            type="number"
            step="0.0001"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Longitude de référence</label>
          <input
            v-model.number="filters.ref_lon"
            type="number"
            step="0.0001"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div class="flex items-end gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            @click="useMyLocation"
          >
            📍 Utiliser ma position
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            @click="onSubmit"
          >
            Appliquer
          </button>
        </div>
        <p v-if="geoError" class="col-span-full text-xs text-red-500">{{ geoError }}</p>
      </div>
    </div>
  </form>
</template>
