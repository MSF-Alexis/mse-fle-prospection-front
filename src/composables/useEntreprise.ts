import { ref } from 'vue';
import { apiGet, apiPatch } from '@/services/api';
import type { Entreprise } from '@/types/Entreprise';

export function useEntreprise() {
  const entreprise = ref<Entreprise | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchEntreprise = async (siren: string) => {
    loading.value = true;
    error.value = null;
    try {
      entreprise.value = await apiGet<Entreprise>(`/entreprises/${siren}`);
      return entreprise.value;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateStatut = async (siren: string, statut: string) => {
    const updated = await apiPatch<Entreprise>(`/entreprises/${siren}/statut`, { statut });
    if (entreprise.value?.siren === siren) {
      entreprise.value = { ...entreprise.value, statut_prospection: updated.statut_prospection };
    }
    return updated;
  };

  return { entreprise, loading, error, fetchEntreprise, updateStatut };
}
