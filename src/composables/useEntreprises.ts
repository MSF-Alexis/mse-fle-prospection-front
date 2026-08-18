import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import { distanceKm, getEntrepriseCoords } from '@/utils/geo';
import type { Entreprise, EntreprisesQuery, EntreprisesResponse } from '@/types/Entreprise';

function mapRow(row: any, contacts: any[] = [], notes: any[] = []): Entreprise {
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
    importedAt: row.imported_at,
    updatedAt: row.updated_at,
  } as Entreprise;
}

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
      let request = supabase.from('entreprises').select('*');

      if (query.q) {
        const q = query.q;
        request = request.or(
          [
            `nom_complet.ilike.%${q}%`,
            `nom_raison_sociale.ilike.%${q}%`,
            `sigle.ilike.%${q}%`,
            `siren.ilike.%${q}%`,
            `commune.ilike.%${q}%`,
            `code_postal.ilike.%${q}%`,
          ].join(','),
        );
      }
      if (query.departement) request = request.eq('departement', query.departement);
      if (query.activite) request = request.eq('activite_principale', query.activite);
      if (query.statut) request = request.eq('statut_prospection', query.statut);

      const { data: rows, error: fetchError } = await request;
      if (fetchError) throw fetchError;

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
        mapRow(row, contactsBySiren.get(row.siren) ?? [], notesBySiren.get(row.siren) ?? []),
      );

      const refLatValue = query.ref_lat ?? 48.8566;
      const refLonValue = query.ref_lon ?? 2.3522;

      const withDistance = entreprises.map((entreprise) => {
        const coords = getEntrepriseCoords(entreprise);
        const distance_km = coords ? distanceKm(refLatValue, refLonValue, coords.lat, coords.lon) : null;
        return { ...entreprise, distance_km };
      });

      const filteredByDistance =
        query.distance_max !== undefined && !Number.isNaN(query.distance_max)
          ? withDistance.filter((e) => e.distance_km !== null && e.distance_km <= query.distance_max!)
          : withDistance;

      const sorted = [...filteredByDistance].sort((a, b) => {
        if (query.sort === 'distance') {
          if (a.distance_km === null) return 1;
          if (b.distance_km === null) return -1;
          return a.distance_km - b.distance_km;
        }
        return String(a.nom_complet ?? '').localeCompare(String(b.nom_complet ?? ''));
      });

      const currentPage = Math.max(1, query.page ?? 1);
      const limit = Math.min(100, Math.max(1, query.limit ?? 20));
      const totalCount = sorted.length;
      const pageResults = sorted.slice((currentPage - 1) * limit, (currentPage - 1) * limit + limit);

      const response: EntreprisesResponse = {
        total: totalCount,
        page: currentPage,
        limit,
        total_pages: Math.max(1, Math.ceil(totalCount / limit)),
        ref_lat: refLatValue,
        ref_lon: refLonValue,
        results: pageResults,
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

function groupBySiren(rows: any[]): Map<string, any[]> {
  const map = new Map<string, any[]>();
  for (const row of rows) {
    const list = map.get(row.entreprise_siren) ?? [];
    list.push(row);
    map.set(row.entreprise_siren, list);
  }
  return map;
}
