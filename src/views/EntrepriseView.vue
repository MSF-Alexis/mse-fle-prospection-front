<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/ui/Loader.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import StatutBadge from '@/components/ui/StatutBadge.vue';
import ContactCard from '@/components/contacts/ContactCard.vue';
import ContactFormModal from '@/components/contacts/ContactFormModal.vue';
import NoteItem from '@/components/notes/NoteItem.vue';
import NoteFormModal from '@/components/notes/NoteFormModal.vue';
import { STATUT_OPTIONS } from '@/helpers/statut';
import { useEntreprise } from '@/composables/useEntreprise';
import { useContacts } from '@/composables/useContacts';
import { useNotes } from '@/composables/useNotes';
import type { Contact } from '@/types/Contact';

const route = useRoute();
const siren = route.params.siren as string;

const { entreprise, loading, error, fetchEntreprise, updateStatut } = useEntreprise();
const { deleteContact } = useContacts();
const { deleteNote } = useNotes();

const showContactModal = ref(false);
const editingContact = ref<Contact | null>(null);
const showNoteModal = ref(false);

const financeYears = computed(() => {
  const entries = Object.entries(entreprise.value?.finances ?? {});
  return entries.sort(([a], [b]) => Number(b) - Number(a));
});

const activeFlags = computed(() => {
  const complements = entreprise.value?.complements ?? {};
  const labels: Array<[string, boolean | undefined]> = [
    ['ESS', complements.est_ess],
    ['RGE', complements.est_rge],
    ['Qualiopi', complements.est_qualiopi],
    ['Organisme de formation', complements.est_organisme_formation],
    ['Association', complements.est_association],
    ['Administration', complements.est_administration],
    ['FINESS', complements.est_finess],
  ];
  return labels.filter(([, enabled]) => Boolean(enabled)).map(([label]) => label);
});

function openAddContact() {
  editingContact.value = null;
  showContactModal.value = true;
}

function openEditContact(contact: Contact) {
  editingContact.value = contact;
  showContactModal.value = true;
}

async function onContactSaved() {
  showContactModal.value = false;
  await fetchEntreprise(siren);
}

async function onDeleteContact(contactId: string) {
  if (!confirm('Supprimer ce contact ?')) return;
  await deleteContact(siren, contactId);
  await fetchEntreprise(siren);
}

async function onNoteSaved() {
  showNoteModal.value = false;
  await fetchEntreprise(siren);
}

async function onDeleteNote(noteId: string) {
  if (!confirm('Supprimer cette note ?')) return;
  await deleteNote(siren, noteId);
  await fetchEntreprise(siren);
}

async function onStatutChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  await updateStatut(siren, value);
}

onMounted(() => fetchEntreprise(siren));
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6">
    <RouterLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
      ← Retour à la liste
    </RouterLink>

    <Loader v-if="loading" label="Chargement de l'entreprise…" />

    <p v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      Impossible de charger cette entreprise ({{ error.message }}).
    </p>

    <template v-else-if="entreprise">
      <header class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-xl font-bold text-slate-900">
              {{ entreprise.nom_complet }}
              <span v-if="entreprise.sigle" class="text-base font-normal text-slate-400">
                ({{ entreprise.sigle }})
              </span>
            </h1>
            <p class="mt-1 text-sm text-slate-500">
              {{ entreprise.siege?.adresse ?? [entreprise.siege?.code_postal, entreprise.siege?.libelle_commune].filter(Boolean).join(' ') }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              SIREN {{ entreprise.siren }} · NAF {{ entreprise.activite_principale }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-2">
            <span
              v-if="typeof entreprise.distance_km === 'number'"
              class="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
            >
              📍 {{ entreprise.distance_km.toFixed(2) }} km du point de référence
            </span>
            <StatutBadge :statut="entreprise.statut_prospection as string" />
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
          <label class="text-xs font-medium text-slate-500">Statut de prospection</label>
          <select
            :value="entreprise.statut_prospection"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            @change="onStatutChange"
          >
            <option v-for="option in STATUT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </header>

      <section class="mt-6 grid gap-4 md:grid-cols-2">
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">Informations générales</h2>
          <dl class="grid grid-cols-[150px_1fr] gap-y-2 text-sm">
            <dt class="text-slate-500">Raison sociale</dt>
            <dd>{{ entreprise.nom_raison_sociale || '—' }}</dd>
            <dt class="text-slate-500">Catégorie</dt>
            <dd>{{ entreprise.categorie_entreprise || '—' }}</dd>
            <dt class="text-slate-500">Effectif</dt>
            <dd>{{ entreprise.tranche_effectif_salarie || '—' }}</dd>
            <dt class="text-slate-500">Section NAF</dt>
            <dd>{{ entreprise.section_activite_principale || '—' }}</dd>
            <dt class="text-slate-500">Nature juridique</dt>
            <dd>{{ entreprise.nature_juridique || '—' }}</dd>
            <dt class="text-slate-500">État administratif</dt>
            <dd>{{ entreprise.etat_administratif || '—' }}</dd>
            <dt class="text-slate-500">Date de création</dt>
            <dd>{{ entreprise.date_creation || '—' }}</dd>
            <dt class="text-slate-500">Date de fermeture</dt>
            <dd>{{ entreprise.date_fermeture || '—' }}</dd>
            <dt class="text-slate-500">Établissements</dt>
            <dd>
              {{ entreprise.nombre_etablissements ?? '—' }}
              <span v-if="entreprise.nombre_etablissements_ouverts !== undefined && entreprise.nombre_etablissements_ouverts !== null">
                ({{ entreprise.nombre_etablissements_ouverts }} ouverts)
              </span>
            </dd>
            <dt class="text-slate-500">TVA</dt>
            <dd>{{ entreprise.tva?.join(', ') || '—' }}</dd>
          </dl>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">Siège</h2>
          <dl class="grid grid-cols-[150px_1fr] gap-y-2 text-sm">
            <dt class="text-slate-500">Adresse</dt>
            <dd>{{ entreprise.siege?.adresse || '—' }}</dd>
            <dt class="text-slate-500">Commune</dt>
            <dd>{{ entreprise.siege?.libelle_commune || entreprise.commune || '—' }}</dd>
            <dt class="text-slate-500">Code postal</dt>
            <dd>{{ entreprise.siege?.code_postal || entreprise.code_postal || '—' }}</dd>
            <dt class="text-slate-500">Département</dt>
            <dd>{{ entreprise.siege?.departement || entreprise.departement || '—' }}</dd>
            <dt class="text-slate-500">Région</dt>
            <dd>{{ entreprise.siege?.region || '—' }}</dd>
            <dt class="text-slate-500">SIRET siège</dt>
            <dd>{{ entreprise.siege?.siret || '—' }}</dd>
            <dt class="text-slate-500">Date début activité</dt>
            <dd>{{ entreprise.siege?.date_debut_activite || '—' }}</dd>
            <dt class="text-slate-500">Nom commercial</dt>
            <dd>{{ entreprise.siege?.nom_commercial || '—' }}</dd>
          </dl>
        </article>
      </section>

      <section class="mt-6 grid gap-4 md:grid-cols-2">
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">Dirigeants</h2>
          <EmptyState v-if="!entreprise.dirigeants?.length" title="Aucun dirigeant remonté" />
          <div v-else class="flex flex-col gap-2">
            <div v-for="(dirigeant, index) in entreprise.dirigeants" :key="index" class="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
              <p class="font-medium text-slate-800">
                {{ dirigeant.denomination || [dirigeant.prenoms, dirigeant.nom].filter(Boolean).join(' ') || '—' }}
              </p>
              <p class="text-slate-500">{{ dirigeant.qualite || 'Qualité non renseignée' }}</p>
              <p class="mt-1 text-xs text-slate-400">
                {{ dirigeant.type_dirigeant || '—' }}
                <span v-if="dirigeant.annee_de_naissance">· Né(e) en {{ dirigeant.annee_de_naissance }}</span>
                <span v-if="dirigeant.siren">· SIREN {{ dirigeant.siren }}</span>
              </p>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">Indicateurs & labels</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="flag in activeFlags"
              :key="flag"
              class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {{ flag }}
            </span>
            <span v-if="activeFlags.length === 0" class="text-sm text-slate-500">Aucun indicateur spécifique remonté.</span>
          </div>

          <div class="mt-4 text-sm text-slate-600">
            <p>IDCC : {{ entreprise.complements?.liste_idcc?.join(', ') || '—' }}</p>
            <p>FINESS juridique : {{ entreprise.complements?.liste_finess_juridique?.join(', ') || '—' }}</p>
          </div>
        </article>
      </section>

      <section class="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="mb-3 text-sm font-semibold text-slate-700">Finances</h2>
        <EmptyState v-if="financeYears.length === 0" title="Aucune donnée financière remontée" />
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left text-slate-500">
                <th class="px-2 py-2 font-medium">Année</th>
                <th class="px-2 py-2 font-medium">Chiffre d'affaires</th>
                <th class="px-2 py-2 font-medium">Résultat net</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="([year, values]) in financeYears" :key="year" class="border-b border-slate-50">
                <td class="px-2 py-2 font-medium text-slate-800">{{ year }}</td>
                <td class="px-2 py-2">{{ values.ca?.toLocaleString('fr-FR') ?? '—' }}</td>
                <td class="px-2 py-2">{{ values.resultat_net?.toLocaleString('fr-FR') ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mt-6">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700">Contacts ({{ entreprise.contacts.length }})</h2>
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
            @click="openAddContact"
          >
            + Ajouter un contact
          </button>
        </div>

        <EmptyState v-if="entreprise.contacts.length === 0" title="Aucun contact enregistré" />

        <div v-else class="flex flex-col gap-2">
          <ContactCard
            v-for="contact in entreprise.contacts"
            :key="contact.id"
            :contact="contact"
            @edit="openEditContact(contact)"
            @delete="onDeleteContact(contact.id)"
          />
        </div>
      </section>

      <section class="mt-6">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700">Notes ({{ entreprise.notes.length }})</h2>
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
            @click="showNoteModal = true"
          >
            + Ajouter une note
          </button>
        </div>

        <EmptyState v-if="entreprise.notes.length === 0" title="Aucune note pour le moment" />

        <div v-else class="flex flex-col gap-2">
          <NoteItem
            v-for="note in [...entreprise.notes].reverse()"
            :key="note.id"
            :note="note"
            @delete="onDeleteNote(note.id)"
          />
        </div>
      </section>
    </template>

    <ContactFormModal
      v-if="showContactModal"
      :siren="siren"
      :contact="editingContact"
      @close="showContactModal = false"
      @saved="onContactSaved"
    />

    <NoteFormModal v-if="showNoteModal" :siren="siren" @close="showNoteModal = false" @saved="onNoteSaved" />
  </main>
</template>
