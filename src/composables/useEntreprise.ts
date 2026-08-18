import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import { distanceKm, getEntrepriseCoords } from '@/utils/geo';
import { useConfig } from '@/composables/useConfig';
import type { Entreprise } from '@/types/Entreprise';

function mapContactRow(row: any) {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom ?? undefined,
    poste: row.poste ?? undefined,
    email: row.email ?? undefined,
    telephone: row.telephone ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function mapNoteRow(row: any) {
  return {
    id: row.id,
    auteur: row.auteur ?? undefined,
    contenu: row.contenu,
    statut: row.statut ?? undefined,
    createdAt: row.created_at,
  };
}

export function useEntreprise() {
  const entreprise = ref<Entreprise | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const { config, fetchConfig } = useConfig();

  const fetchEntreprise = async (siren: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data: row, error: fetchError } = await supabase
        .from('entreprises')
        .select('*')
        .eq('siren', siren)
        .single();
      if (fetchError) throw fetchError;

      const [{ data: contactRows }, { data: noteRows }] = await Promise.all([
        supabase.from('contacts').select('*').eq('entreprise_siren', siren).order('created_at', { ascending: true }),
        supabase.from('notes').select('*').eq('entreprise_siren', siren).order('created_at', { ascending: true }),
      ]);

      const refConfig = await fetchConfig();
      const coords = getEntrepriseCoords(row);
      const distance_km = coords ? distanceKm(refConfig.ref_lat, refConfig.ref_lon, coords.lat, coords.lon) : null;

      entreprise.value = {
        ...(row.raw_data ?? {}),
        siren: row.siren,
        nom_complet: row.nom_complet,
        nom_raison_sociale: row.nom_raison_sociale,
        sigle: row.sigle,
        activite_principale: row.activite_principale,
        code_postal: row.code_postal,
        commune: row.commune,
        departement: row.departement,
        latitude: row.latitude,
        longitude: row.longitude,
        statut_prospection: row.statut_prospection,
        contacts: (contactRows ?? []).map(mapContactRow),
        notes: (noteRows ?? []).map(mapNoteRow),
        distance_km,
      } as Entreprise;

      return entreprise.value;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateStatut = async (siren: string, statut: string) => {
    const { data, error: updateError } = await supabase
      .from('entreprises')
      .update({ statut_prospection: statut, updated_at: new Date().toISOString() })
      .eq('siren', siren)
      .select()
      .single();

    if (updateError) throw updateError;

    if (entreprise.value?.siren === siren) {
      entreprise.value = { ...entreprise.value, statut_prospection: data.statut_prospection };
    }
    return data;
  };

  return { entreprise, loading, error, fetchEntreprise, updateStatut };
}
