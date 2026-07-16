<script setup lang="ts">
import { RouterLink } from 'vue-router';
import StatutBadge from '@/components/ui/StatutBadge.vue';
import type { Entreprise } from '@/types/Entreprise';

const props = defineProps<{ entreprise: Entreprise }>();
</script>

<template>
  <RouterLink
    :to="{ name: 'entreprise', params: { siren: entreprise.siren } }"
    class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="truncate text-sm font-semibold text-slate-900">{{ entreprise.nom_complet }}</h3>
        <span
          v-if="entreprise.sigle"
          class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
        >
          {{ entreprise.sigle }}
        </span>
      </div>
      <p class="mt-0.5 truncate text-xs text-slate-500">
        {{ entreprise.siege?.adresse ?? [entreprise.siege?.code_postal, entreprise.siege?.libelle_commune].filter(Boolean).join(' ') }}
      </p>
      <p class="mt-1 text-[11px] text-slate-400">
        SIREN {{ entreprise.siren }} · NAF {{ entreprise.activite_principale }}
      </p>
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
      <span
        v-if="typeof entreprise.distance_km === 'number'"
        class="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
      >
        📍 {{ entreprise.distance_km.toFixed(2) }} km
      </span>
      <span
        v-if="entreprise.contacts?.length"
        class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500"
      >
        👤 {{ entreprise.contacts.length }}
      </span>
      <span
        v-if="entreprise.notes?.length"
        class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500"
      >
        📝 {{ entreprise.notes.length }}
      </span>
      <StatutBadge :statut="entreprise.statut_prospection as string" />
    </div>
  </RouterLink>
</template>
