<script setup lang="ts">
import { computed } from 'vue';
import { getStatutOption } from '@/helpers/statut';

const props = defineProps<{ statut?: string }>();
const option = computed(() => getStatutOption(props.statut));
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
    :class="option.badgeClass"
  >
    {{ option.label }}
  </span>
</template>
