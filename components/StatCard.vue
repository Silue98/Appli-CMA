<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p class="text-sm text-gray-500 mb-1">{{ title }}</p>
      <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      <p v-if="change" :class="['text-xs mt-1 font-medium', changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-500' : 'text-gray-500']">
        {{ change }}
      </p>
    </div>
    <div :class="['p-3 rounded-xl', iconBg]">
      <!-- users -->
      <svg v-if="icon === 'users'" class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      <!-- calendar -->
      <svg v-else-if="icon === 'calendar'" class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <!-- book -->
      <svg v-else-if="icon === 'book'" class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <!-- announcement -->
      <svg v-else-if="icon === 'announcement'" class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
      <!-- default -->
      <svg v-else class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  change: String,
  changeType: String,
  color: { type: String, default: 'green' }
})

const iconBg = computed(() => {
  const map = { green: 'bg-green-100', blue: 'bg-blue-100', purple: 'bg-purple-100', orange: 'bg-orange-100', pink: 'bg-pink-100' }
  return map[props.color] || 'bg-green-100'
})

const iconColor = computed(() => {
  const map = { green: 'text-green-600', blue: 'text-blue-600', purple: 'text-purple-600', orange: 'text-orange-600', pink: 'text-pink-600' }
  return map[props.color] || 'text-green-600'
})
</script>
