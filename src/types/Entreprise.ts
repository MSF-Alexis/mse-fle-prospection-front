import type { Contact } from './Contact';
import type { Note, StatutNote } from './Note';

export interface EntrepriseRow {
  siren: string;
  nom_complet: string | null;
  nom_raison_sociale: string | null;
  sigle: string | null;
  activite_principale: string | null;
  code_postal: string | null;
  commune: string | null;
  departement: string | null;
  latitude: number | null;
  longitude: number | null;
  statut_prospection: StatutNote | string;
  raw_data: Record<string, unknown>;
  imported_at: string;
  updated_at: string;
}

export interface Entreprise extends Record<string, unknown> {
  siren: string;
  nom_complet: string;
  nom_raison_sociale?: string;
  sigle?: string | null;
  activite_principale?: string;
  code_postal?: string | null;
  commune?: string | null;
  departement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  siege?: Record<string, unknown>;
  dirigeants?: Record<string, unknown>[];

  contacts: Contact[];
  notes: Note[];
  statut_prospection?: StatutNote | string;

  distance_km?: number | null;
}

export interface EntreprisesResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  ref_lat: number;
  ref_lon: number;
  results: Entreprise[];
}

export interface EntreprisesQuery {
  q?: string;
  departement?: string;
  activite?: string;
  statut?: string;
  page?: number;
  limit?: number;
  ref_lat?: number;
  ref_lon?: number;
  distance_max?: number;
  sort?: 'distance' | 'nom';
}
