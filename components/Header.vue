<template>
  <header class="bg-white shadow p-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
    <div class="text-gray-500">👋 Bonjour, Admin</div>
  </header>
</template>

<script setup>
defineProps({
  title: String,
})
</script>
