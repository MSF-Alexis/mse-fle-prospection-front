export type StatutNote =
  | 'a_contacter'
  | 'en_cours'
  | 'relance'
  | 'gagne'
  | 'perdu'
  | 'sans_suite';

export interface Note {
  id: string;
  auteur?: string;
  contenu: string;
  statut?: StatutNote;
  createdAt: string;
}

export interface NoteInput {
  auteur?: string;
  contenu: string;
  statut?: StatutNote;
}
