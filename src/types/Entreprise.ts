import type { Contact } from './Contact';
import type { Note, StatutNote } from './Note';

export interface Siege {
  epci?: string | null;
  cedex?: string | null;
  siret?: string | null;
  geo_id?: string | null;
  region?: string | null;
  adresse?: string | null;
  commune?: string | null;
  latitude?: string | null;
  est_siege?: boolean;
  longitude?: string | null;
  type_voie?: string | null;
  liste_idcc?: string[] | null;
  code_postal?: string | null;
  coordonnees?: string | null;
  departement?: string | null;
  numero_voie?: string | null;
  libelle_voie?: string | null;
  liste_finess?: string[] | null;
  date_creation?: string | null;
  nom_commercial?: string | null;
  libelle_commune?: string | null;
  etat_administratif?: string | null;
  activite_principale?: string | null;
  caractere_employeur?: string | null;
  date_debut_activite?: string | null;
  tranche_effectif_salarie?: string | null;
  activite_principale_naf25?: string | null;
  annee_tranche_effectif_salarie?: string | null;
  statut_diffusion_etablissement?: string | null;
  [key: string]: unknown;
}

export interface Dirigeant {
  nom?: string;
  prenoms?: string;
  denomination?: string;
  qualite?: string;
  nationalite?: string | null;
  type_dirigeant?: string;
  date_de_naissance?: string;
  annee_de_naissance?: string;
  siren?: string;
  [key: string]: unknown;
}

export interface ComplementEntreprise {
  est_bio?: boolean;
  est_ess?: boolean;
  est_rge?: boolean;
  est_uai?: boolean;
  est_siae?: boolean;
  type_siae?: string | null;
  est_avocat?: boolean;
  est_finess?: boolean;
  est_qualiopi?: boolean;
  est_association?: boolean;
  est_administration?: boolean;
  est_organisme_formation?: boolean;
  convention_collective_renseignee?: boolean;
  egapro_renseignee?: boolean;
  liste_idcc?: string[] | null;
  liste_finess_juridique?: string[] | null;
  [key: string]: unknown;
}

export interface FinancesParAnnee {
  ca?: number;
  resultat_net?: number;
  [key: string]: unknown;
}

export interface Entreprise {
  siren: string;
  nom_complet: string;
  nom_raison_sociale?: string | null;
  sigle?: string | null;
  activite_principale?: string | null;
  activite_principale_naf25?: string | null;
  section_activite_principale?: string | null;
  code_postal?: string | null;
  commune?: string | null;
  departement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  statut_prospection?: StatutNote | string;
  categorie_entreprise?: string | null;
  tranche_effectif_salarie?: string | null;
  etat_administratif?: string | null;
  nature_juridique?: string | number | null;
  date_creation?: string | null;
  date_fermeture?: string | null;
  nombre_etablissements?: number | null;
  nombre_etablissements_ouverts?: number | null;
  tva?: string[];
  siege?: Siege;
  dirigeants?: Dirigeant[];
  complements?: ComplementEntreprise;
  finances?: Record<string, FinancesParAnnee>;
  contacts: Contact[];
  notes: Note[];
  distance_km?: number | null;
  importedAt?: string;
  updatedAt?: string;
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
