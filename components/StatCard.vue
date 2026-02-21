<template>
  <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between">
    <div>
      <h3 class="text-gray-500 text-sm">{{ title }}</h3>
      <p class="text-2xl font-semibold">{{ value }}</p>
    </div>
    <div class="text-indigo-500 text-3xl">
      <i :class="`lucide-${icon}`"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
})
</script>
