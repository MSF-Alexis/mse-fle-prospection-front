<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import EntrepriseFilters from '@/components/entreprises/EntrepriseFilters.vue';
import EntrepriseCard from '@/components/entreprises/EntrepriseCard.vue';
import Pagination from '@/components/ui/Pagination.vue';
import Loader from '@/components/ui/Loader.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { useEntreprises } from '@/composables/useEntreprises';
import { useConfig } from '@/composables/useConfig';
import type { EntreprisesQuery } from '@/types/Entreprise';

const { results, total, page, totalPages, loading, error, search } = useEntreprises();
const { fetchConfig } = useConfig();

const filters = reactive<EntreprisesQuery>({
  q: '',
  departement: '',
  activite: '',
  statut: '',
  sort: 'nom',
  distance_max: undefined,
  ref_lat: undefined,
  ref_lon: undefined,
  page: 1,
  limit: 20,
});

function runSearch(targetPage = 1) {
  filters.page = targetPage;
  search({ ...filters });
}

function onReset() {
  filters.q = '';
  filters.departement = '';
  filters.activite = '';
  filters.statut = '';
  filters.sort = 'nom';
  filters.distance_max = undefined;
  runSearch(1);
}

onMounted(async () => {
  const config = await fetchConfig().catch(() => null);
  if (config) {
    filters.ref_lat = config.ref_lat;
    filters.ref_lon = config.ref_lon;
  }
  runSearch(1);
});
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Suivi de prospection</h1>
      <p class="mt-1 text-sm text-slate-500">
        Recherchez parmi vos entreprises, filtrez par secteur, statut ou distance, et suivez
        vos contacts et notes d'appel.
      </p>
    </header>

    <EntrepriseFilters v-model="filters" class="mb-6" @submit="runSearch(1)" @reset="onReset" />

    <p class="mb-3 text-sm text-slate-500">
      <span class="font-semibold text-slate-700">{{ total }}</span> entreprise{{ total > 1 ? 's' : '' }}
      trouvée{{ total > 1 ? 's' : '' }}
    </p>

    <Loader v-if="loading" label="Recherche en cours…" />

    <p v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      Impossible de contacter l'API ({{ error.message }}). Vérifiez que le serveur
      <code>prospection-api</code> tourne bien.
    </p>

    <EmptyState
      v-else-if="results.length === 0"
      title="Aucune entreprise ne correspond à ces critères"
      description="Essayez d'élargir la recherche, de retirer un filtre ou d'augmenter la distance max."
    />

    <div v-else class="flex flex-col gap-2.5">
      <EntrepriseCard v-for="entreprise in results" :key="entreprise.siren" :entreprise="entreprise" />
    </div>

    <Pagination :page="page" :total-pages="totalPages" @change="runSearch" />
  </main>
</template>
