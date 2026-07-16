<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Chargement…' });
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
    <svg class="h-4 w-4 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
    {{ label }}
  </div>
</template>
