# Prospection Front

Interface web (Vue 3 + Vite + TypeScript + Tailwind CSS v4) pour l'API
[`prospection-api`](../prospection-api). Permet de rechercher, filtrer et suivre les
entreprises de prospection : contacts, notes, statut, et **distance par rapport à un
point de référence**.

Construit avec [Bun](https://bun.sh) — pas besoin de Node.js.

## Fonctionnalités

- Recherche texte (nom, sigle, SIREN, commune, code postal)
- Filtres : département, code NAF (activité principale), statut de prospection
- **Filtre de distance** : distance max en km par rapport à un point de référence
  (lat/long), avec tri par proximité
- Modification du point de référence directement dans l'interface (saisie manuelle
  ou géolocalisation du navigateur)
- Pagination
- Fiche détail entreprise : coordonnées, distance au point de référence, statut de
  prospection modifiable
- Gestion des contacts (ajout / modification / suppression)
- Gestion des notes de suivi (ajout / suppression), avec statut optionnel par note

## Prérequis

- [Bun](https://bun.sh) ≥ 1.1
- L'API [`prospection-api`](../prospection-api) démarrée (par défaut sur
  `http://localhost:3000`)

## Installation

```bash
bun install
cp .env.example .env
```

Le fichier `.env` contient l'URL de l'API :

```
VITE_API_URL=http://localhost:3000/api
```

## Développement

```bash
bun run dev
```

Ouvre l'application sur [http://localhost:5173](http://localhost:5173) avec rechargement à chaud.
Assure-toi que `prospection-api` (et MongoDB) tournent en parallèle.

## Build de production + prévisualisation locale

```bash
bun run build      # génère le dossier dist/
bun run preview    # sert dist/ localement pour vérifier le build
```

`bun run preview` démarre un serveur local (par défaut sur
[http://localhost:4173](http://localhost:4173)) qui sert exactement les fichiers du
build de production — c'est ce qu'il faut utiliser pour afficher l'application "en
conditions réelles" sur l'ordinateur de l'utilisateur, sans dépendre d'un serveur
Node/Bun applicatif : le contenu de `dist/` peut aussi être ouvert avec n'importe quel
serveur de fichiers statiques (ou double-clic sur `dist/index.html` selon le
navigateur).

## Structure du projet

```
src/
├── assets/main.css        # point d'entrée Tailwind (@import "tailwindcss")
├── types/                 # types Entreprise, Contact, Note (miroir du backend)
├── services/api.ts        # wrapper fetch (VITE_API_URL)
├── composables/           # useEntreprises, useEntreprise, useContacts, useNotes, useConfig
├── helpers/statut.ts      # libellés + couleurs des statuts de prospection
├── components/
│   ├── ui/                 # Modal, Loader, EmptyState, Pagination, StatutBadge
│   ├── entreprises/         # EntrepriseCard, EntrepriseFilters (dont filtre distance)
│   ├── contacts/            # ContactCard, ContactFormModal
│   └── notes/               # NoteItem, NoteFormModal
├── views/
│   ├── HomeView.vue         # liste + recherche + filtres + pagination
│   ├── EntrepriseView.vue   # détail entreprise + contacts + notes
│   └── NotFoundView.vue
├── router/index.ts
├── App.vue
└── main.ts
```

## Utiliser le filtre de distance

1. Au chargement, le point de référence par défaut est récupéré via
   `GET /api/config` sur l'API (par défaut Paris, Hôtel de Ville :
   `48.8566, 2.3522`, configurable côté backend via les variables `REF_LAT`/`REF_LON`).
2. Dans le bloc de filtres, clique sur **"Modifier le point de référence pour le
   calcul de distance"** pour saisir une autre latitude/longitude, ou utiliser le
   bouton **"Utiliser ma position"** (géolocalisation du navigateur).
3. Renseigne une **distance max (km)** pour n'afficher que les entreprises situées
   dans ce rayon.
4. Choisis **"Proximité (point de référence)"** dans le tri pour classer les
   résultats du plus proche au plus loin.

La distance est calculée côté API (formule de Haversine) et affichée avec 2
décimales sur chaque carte entreprise et sur la fiche détail.

## Notes

- Pas de gestionnaire d'état global (Pinia) : les données sont chargées à la
  demande via des composables, comme dans le projet de référence
  ([chapeaudent-aldente](https://github.com/MSF-Alexis/chapeaudent-aldente)).
- CORS : `prospection-api` autorise déjà toutes les origines
  (`Access-Control-Allow-Origin: *`), aucune configuration supplémentaire n'est
  nécessaire en local.
