<script setup lang="ts">
import { computed } from 'vue';
import { getStatutOption } from '@/helpers/statut';
import type { Note } from '@/types/Note';

const props = defineProps<{ note: Note }>();
const emit = defineEmits<{ delete: [] }>();

const formattedDate = computed(() =>
  new Date(props.note.createdAt).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
);

const option = computed(() => (props.note.statut ? getStatutOption(props.note.statut) : null));
</script>

<template>
  <div class="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
    <div class="flex-1">
      <div class="mb-1 flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-slate-700">{{ note.auteur || 'Anonyme' }}</span>
        <span
          v-if="option"
          class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
          :class="option.badgeClass"
        >
          {{ option.label }}
        </span>
        <span class="text-[11px] text-slate-400">{{ formattedDate }}</span>
      </div>
      <p class="text-sm whitespace-pre-wrap text-slate-700">{{ note.contenu }}</p>
    </div>
    <button
      type="button"
      class="h-fit shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
      title="Supprimer"
      @click="emit('delete')"
    >
      🗑️
    </button>
  </div>
</template>
