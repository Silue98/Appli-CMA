<template>
  <div class="bg-white shadow rounded-xl overflow-hidden">
    <table class="min-w-full border-collapse">
      <thead class="bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <tr>
          <th v-for="header in headers" :key="header" class="p-3 text-left text-sm font-semibold">
            {{ header }}
          </th>
          <th class="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b hover:bg-gray-50 transition"
        >
          <td v-for="field in fields" :key="field" class="p-3 text-sm text-gray-700">
            {{ item[field] }}
          </td>
          <td class="p-3 text-right space-x-2">
            <button @click="$emit('edit', item)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">✏️</button>
            <button @click="$emit('delete', item)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: Array,
  fields: Array,
  items: Array
})
defineEmits(['edit', 'delete'])
</script>
