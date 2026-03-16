<template>
  <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-20">
    <h1 class="text-lg font-semibold text-gray-800">{{ title }}</h1>
    <div class="flex items-center gap-3">
      <span v-if="user" class="text-sm text-gray-500 hidden md:block">👋 {{ user.prenom }} {{ user.nom }}</span>
      <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {{ user ? user.prenom?.charAt(0) + user.nom?.charAt(0) : 'A' }}
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: String,
  user: { type: Object, default: null }
})
</script>
