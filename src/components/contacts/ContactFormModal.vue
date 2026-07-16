<script setup lang="ts">
import { reactive, ref } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import { useContacts } from '@/composables/useContacts';
import type { Contact, ContactInput } from '@/types/Contact';

const props = defineProps<{ siren: string; contact?: Contact | null }>();
const emit = defineEmits<{ close: []; saved: [contact: Contact] }>();

const { addContact, updateContact, loading, error } = useContacts();

const form = reactive<ContactInput>({
  nom: props.contact?.nom ?? '',
  prenom: props.contact?.prenom ?? '',
  poste: props.contact?.poste ?? '',
  email: props.contact?.email ?? '',
  telephone: props.contact?.telephone ?? '',
  notes: props.contact?.notes ?? '',
});

const validationError = ref('');

async function onSubmit() {
  validationError.value = '';
  if (!form.nom.trim()) {
    validationError.value = 'Le nom est obligatoire.';
    return;
  }

  try {
    const saved = props.contact
      ? await updateContact(props.siren, props.contact.id, form)
      : await addContact(props.siren, form);
    emit('saved', saved);
  } catch {
    // l'erreur est déjà exposée via `error`
  }
}
</script>

<template>
  <Modal :title="contact ? 'Modifier le contact' : 'Ajouter un contact'" @close="emit('close')">
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Nom *</label>
          <input
            v-model="form.nom"
            type="text"
            required
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Prénom</label>
          <input
            v-model="form.prenom"
            type="text"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Poste</label>
        <input
          v-model="form.poste"
          type="text"
          placeholder="ex. Responsable achats"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Téléphone</label>
          <input
            v-model="form.telephone"
            type="tel"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Notes sur ce contact</label>
        <textarea
          v-model="form.notes"
          rows="2"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <p v-if="validationError" class="text-xs text-red-500">{{ validationError }}</p>
      <p v-if="error" class="text-xs text-red-500">{{ error.message }}</p>
    </form>

    <template #footer>
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        @click="emit('close')"
      >
        Annuler
      </button>
      <button
        type="button"
        :disabled="loading"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        @click="onSubmit"
      >
        {{ loading ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </template>
  </Modal>
</template>
