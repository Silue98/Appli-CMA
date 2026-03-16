<template>
  <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
    <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
      <h3 class="text-sm font-semibold text-gray-700">{{ title || 'Liste des éléments' }}</h3>
      <span class="text-xs text-gray-500">{{ items?.length || 0 }} élément(s)</span>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-green-600 to-blue-700 text-white">
          <tr>
            <th v-for="header in headers" :key="header" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              {{ header }}
            </th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition-colors">
            <td v-for="field in fields" :key="field" class="px-4 py-3 text-sm text-gray-700">
              {{ resolveField(item, field) || '—' }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  v-if="showEdit"
                  @click="$emit('edit', item)"
                  class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="$emit('delete', item)"
                  class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!items || items.length === 0">
            <td :colspan="headers.length + 1" class="text-center text-gray-400 italic py-8">
              <svg class="mx-auto w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Aucune donnée à afficher
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  headers: Array,
  fields: Array,
  items: { type: Array, default: () => [] },
  title: String,
  showEdit: { type: Boolean, default: true }
})

defineEmits(['edit', 'delete'])

const resolveField = (obj, path) => {
  if (!path) return ''
  const val = path.split('.').reduce((acc, key) => (acc != null ? acc[key] : null), obj)
  if (val instanceof Date || (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/))) {
    try {
      return new Date(val).toLocaleDateString('fr-FR')
    } catch { return val }
  }
  return val ?? ''
}
</script>
