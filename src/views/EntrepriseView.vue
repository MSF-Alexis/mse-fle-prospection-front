<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
  <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
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
