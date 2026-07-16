<script setup lang="ts">
withDefaults(defineProps<{ title: string; maxWidth?: string }>(), {
  maxWidth: 'max-w-lg',
});
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Transition name="fade">
    <div
      class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4"
      @click.self="emit('close')"
    >
      <div
        class="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        :class="maxWidth"
      >
        <div class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
          <button
            type="button"
            class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
              />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto px-5 py-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
