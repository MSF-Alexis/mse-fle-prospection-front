import type { Contact } from './Contact';
import type { Note, StatutNote } from './Note';

export interface Siege {
  adresse?: string;
  code_postal?: string;
  commune?: string;
  libelle_commune?: string;
  departement?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: unknown;
}

export interface Dirigeant {
  nom?: string;
  prenoms?: string;
  denomination?: string;
  qualite?: string;
  type_dirigeant?: string;
  [key: string]: unknown;
}

/**
 * Document entreprise tel que renvoyé par l'API : tous les champs bruts de
 * recherche-entreprises.api.gouv.fr + les champs de suivi ajoutés par l'outil.
 */
export interface Entreprise {
  siren: string;
  nom_complet: string;
  nom_raison_sociale?: string;
  sigle?: string | null;
  activite_principale?: string;
  section_activite_principale?: string;
  tranche_effectif_salarie?: string;
  categorie_entreprise?: string;
  date_creation?: string;
  etat_administratif?: string;
  siege: Siege;
  dirigeants?: Dirigeant[];

  // Champs de suivi ajoutés par l'outil de prospection
  contacts: Contact[];
  notes: Note[];
  statut_prospection?: StatutNote | string;

  // Calculé à la volée par l'API (non stocké)
  distance_km?: number | null;

  [key: string]: unknown;
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
