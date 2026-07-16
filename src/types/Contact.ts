export interface Contact {
  id: string;
  nom: string;
  prenom?: string;
  poste?: string;
  email?: string;
  telephone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactInput {
  nom: string;
  prenom?: string;
  poste?: string;
  email?: string;
  telephone?: string;
  notes?: string;
}
