import { reactive, watch } from 'vue';
import type { EntreprisesQuery } from '@/types/Entreprise';

const STORAGE_KEY = 'prospection:entreprises:filters';

const DEFAULT_FILTERS: EntreprisesQuery = {
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
};

function loadSavedFilters(): EntreprisesQuery {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FILTERS };
    const parsed = JSON.parse(raw) as EntreprisesQuery;
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

export function usePersistedEntreprisesFilters() {
  const filters = reactive<EntreprisesQuery>(loadSavedFilters());

  watch(
    filters,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  function resetFilters() {
    Object.assign(filters, { ...DEFAULT_FILTERS });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FILTERS));
  }

  return { filters, resetFilters, defaultFilters: DEFAULT_FILTERS };
}
