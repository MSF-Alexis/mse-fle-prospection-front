import { ref } from 'vue';
import { apiGet } from '@/services/api';
import type { Entreprise, EntreprisesQuery, EntreprisesResponse } from '@/types/Entreprise';

export function useEntreprises() {
  const results = ref<Entreprise[]>([]);
  const total = ref(0);
  const page = ref(1);
  const totalPages = ref(1);
  const refLat = ref<number | null>(null);
  const refLon = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const search = async (query: EntreprisesQuery) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet<EntreprisesResponse>('/entreprises', query as Record<string, unknown>);
      results.value = data.results;
      total.value = data.total;
      page.value = data.page;
      totalPages.value = data.total_pages;
      refLat.value = data.ref_lat;
      refLon.value = data.ref_lon;
      return data;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { results, total, page, totalPages, refLat, refLon, loading, error, search };
}
