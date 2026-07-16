<script setup lang="ts"></script>

<template>
  <div class="min-h-full">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-bold text-slate-900">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">P</span>
          Prospection
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm font-medium text-slate-500">
          <RouterLink to="/" class="transition hover:text-blue-600" active-class="text-blue-600">
            Entreprises
          </RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
