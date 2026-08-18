import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import type { Entreprise, EntreprisesQuery, EntreprisesResponse } from '@/types/Entreprise';

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

function mapRpcRow(row: any, contacts: any[] = [], notes: any[] = []): Entreprise {
  return {
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
    contacts: contacts.map(mapContactRow),
    notes: notes.map(mapNoteRow),
    distance_km: row.distance_km ?? null,
    importedAt: row.imported_at,
    updatedAt: row.updated_at,
  } as Entreprise;
}

function groupBySiren(rows: any[]): Map<string, any[]> {
  const map = new Map<string, any[]>();
  for (const row of rows) {
    const list = map.get(row.entreprise_siren) ?? [];
    list.push(row);
    map.set(row.entreprise_siren, list);
  }
  return map;
}

export function useEntreprises() {
  const results = ref<Entreprise[]>([]);
  const total = ref(0);
  const page = ref(1);
  const totalPages = ref(1);
  const refLat = ref<number | null>(null);
  const refLon = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const search = async (query: EntreprisesQuery): Promise<EntreprisesResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const currentPage = Math.max(1, query.page ?? 1);
      const limit = Math.min(100, Math.max(1, query.limit ?? 20));
      const refLatValue = query.ref_lat ?? 48.8566;
      const refLonValue = query.ref_lon ?? 2.3522;

      // Pagination, filtres et distance sont calcules cote base via la
      // fonction RPC search_entreprises (voir supabase/rpc_search_entreprises.sql).
      const { data: rows, error: rpcError } = await supabase.rpc('search_entreprises', {
        ref_lat: refLatValue,
        ref_lon: refLonValue,
        distance_max_km: query.distance_max ?? null,
        q: query.q || null,
        p_departement: query.departement || null,
        p_activite: query.activite || null,
        p_statut: query.statut || null,
        sort_by: query.sort ?? 'nom',
        page_num: currentPage,
        page_size: limit,
      });

      if (rpcError) throw rpcError;

      const sirens = (rows ?? []).map((r: any) => r.siren);
      const [{ data: contactRows }, { data: noteRows }] = await Promise.all([
        sirens.length
          ? supabase.from('contacts').select('*').in('entreprise_siren', sirens)
          : Promise.resolve({ data: [] as any[] }),
        sirens.length
          ? supabase.from('notes').select('*').in('entreprise_siren', sirens)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const contactsBySiren = groupBySiren(contactRows ?? []);
      const notesBySiren = groupBySiren(noteRows ?? []);

      const entreprises = (rows ?? []).map((row: any) =>
        mapRpcRow(row, contactsBySiren.get(row.siren) ?? [], notesBySiren.get(row.siren) ?? []),
      );

      const serverTotal = rows?.[0]?.total_count ?? 0;
      const response: EntreprisesResponse = {
        total: serverTotal,
        page: currentPage,
        limit,
        total_pages: Math.max(1, Math.ceil(serverTotal / limit)),
        ref_lat: refLatValue,
        ref_lon: refLonValue,
        results: entreprises,
      };

      results.value = response.results;
      total.value = response.total;
      page.value = response.page;
      totalPages.value = response.total_pages;
      refLat.value = response.ref_lat;
      refLon.value = response.ref_lon;

      return response;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { results, total, page, totalPages, refLat, refLon, loading, error, search };
}
