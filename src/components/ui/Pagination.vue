<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ page: number; totalPages: number }>();
const emit = defineEmits<{ change: [page: number] }>();

const pages = computed<(number | 'ellipsis')[]>(() => {
  const { page, totalPages } = props;
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const result: (number | 'ellipsis')[] = [1];
  if (page > 3) result.push('ellipsis');

  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    result.push(p);
  }

  if (page < totalPages - 2) result.push('ellipsis');
  result.push(totalPages);
  return result;
});

function goTo(p: number) {
  if (p >= 1 && p <= props.totalPages && p !== props.page) emit('change', p);
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1 py-4">
    <button
      type="button"
      class="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-600 transition hover:shadow-sm disabled:cursor-default disabled:opacity-40 disabled:shadow-none"
      :disabled="page === 1"
      @click="goTo(page - 1)"
    >
      ‹
    </button>

    <template v-for="(p, idx) in pages" :key="idx">
      <span v-if="p === 'ellipsis'" class="px-1 text-sm text-slate-400">…</span>
      <button
        v-else
        type="button"
        class="inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm transition hover:shadow-sm"
        :class="
          p === page
            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
            : 'border-slate-200 bg-white text-slate-600'
        "
        @click="goTo(p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      type="button"
      class="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-600 transition hover:shadow-sm disabled:cursor-default disabled:opacity-40 disabled:shadow-none"
      :disabled="page === totalPages"
      @click="goTo(page + 1)"
    >
      ›
    </button>
  </nav>
</template>
