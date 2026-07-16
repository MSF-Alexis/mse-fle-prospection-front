<script setup lang="ts">
withDefaults(defineProps<{ title: string; description?: string }>(), { description: '' });
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center">
    <p class="text-sm font-medium text-slate-600">{{ title }}</p>
    <p v-if="description" class="max-w-sm text-xs text-slate-400">{{ description }}</p>
  </div>
</template>
