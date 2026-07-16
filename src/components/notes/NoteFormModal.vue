<script setup lang="ts">
import { reactive, ref } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import { STATUT_OPTIONS } from '@/helpers/statut';
import { useNotes } from '@/composables/useNotes';
import type { Note, NoteInput } from '@/types/Note';

const props = defineProps<{ siren: string }>();
const emit = defineEmits<{ close: []; saved: [note: Note] }>();

const { addNote, loading, error } = useNotes();

const form = reactive<NoteInput>({
  auteur: '',
  contenu: '',
  statut: undefined,
});

const validationError = ref('');

async function onSubmit() {
  validationError.value = '';
  if (!form.contenu.trim()) {
    validationError.value = 'Le contenu de la note est obligatoire.';
    return;
  }

  try {
    const saved = await addNote(props.siren, form);
    emit('saved', saved);
  } catch {
    // l'erreur est déjà exposée via `error`
  }
}
</script>

<template>
  <Modal title="Ajouter une note" @close="emit('close')">
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Auteur</label>
        <input
          v-model="form.auteur"
          type="text"
          placeholder="Votre nom"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Note *</label>
        <textarea
          v-model="form.contenu"
          rows="4"
          required
          placeholder="Compte-rendu d'appel, prochaine action…"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">
          Statut associé à cette note (optionnel, n'affecte pas le statut global)
        </label>
        <select
          v-model="form.statut"
          class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option :value="undefined">Ne pas changer</option>
          <option v-for="option in STATUT_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
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
