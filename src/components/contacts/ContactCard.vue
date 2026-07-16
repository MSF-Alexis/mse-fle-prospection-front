<script setup lang="ts">
import type { Contact } from '@/types/Contact';

defineProps<{ contact: Contact }>();
const emit = defineEmits<{ edit: []; delete: [] }>();
</script>

<template>
  <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-3">
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">
          {{ contact.prenom ? `${contact.prenom} ` : '' }}{{ contact.nom }}
        </p>
        <p v-if="contact.poste" class="text-xs text-slate-500">{{ contact.poste }}</p>
      </div>
      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
          title="Modifier"
          @click="emit('edit')"
        >
          ✏️
        </button>
        <button
          type="button"
          class="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          title="Supprimer"
          @click="emit('delete')"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
      <a v-if="contact.email" :href="`mailto:${contact.email}`" class="hover:text-blue-600 hover:underline">
        ✉️ {{ contact.email }}
      </a>
      <a v-if="contact.telephone" :href="`tel:${contact.telephone}`" class="hover:text-blue-600 hover:underline">
        📞 {{ contact.telephone }}
      </a>
    </div>

    <p v-if="contact.notes" class="mt-1 text-xs text-slate-500 italic">{{ contact.notes }}</p>
  </div>
</template>
