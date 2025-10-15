<template>
  <div class="bg-white shadow rounded-xl overflow-hidden">
    <!-- 🧭 En-tête -->
    <div class="flex justify-between items-center p-4 border-b bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-700">📋 Liste des éléments</h3>
    </div>

    <!-- 🧾 Tableau principal -->
    <table class="min-w-full border-collapse">
      <thead class="bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="p-3 text-left text-sm font-semibold"
          >
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
          <td
            v-for="field in fields"
            :key="field"
            class="p-3 text-sm text-gray-700"
          >
            {{ resolveField(item, field) }}
          </td>

          <td class="p-3 text-right space-x-2">
            <button
              @click="$emit('edit', item)"
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ✏️
            </button>
            <button
              @click="$emit('delete', item)"
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️
            </button>
            <button
              @click="printItem(item)"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🖨️
            </button>
          </td>
        </tr>

        <tr v-if="!items.length">
          <td
            :colspan="headers.length + 1"
            class="text-center text-gray-500 italic py-4"
          >
            Aucune donnée à afficher
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// Props
const props = defineProps({
  headers: Array,
  fields: Array,
  items: Array
})

// Helper : résout les champs imbriqués (ex: 'culte.theme')
const resolveField = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc && acc[key] ? acc[key] : '', obj)
}

const jsPDFModule = ref(null)
const autoTableModule = ref(null)

// ✅ Import dynamique côté client uniquement
onMounted(async () => {
  if (typeof window !== 'undefined') {
    const jspdf = await import('jspdf')
    const autotable = await import('jspdf-autotable')
    jsPDFModule.value = jspdf
    autoTableModule.value = autotable
  }
})

// 🖨️ Fonction d'impression d'un seul enregistrement
const printItem = async (item) => {
  if (!jsPDFModule.value || !autoTableModule.value) {
    console.error('jsPDF non chargé')
    return
  }

  const { jsPDF } = jsPDFModule.value
  const doc = new jsPDF()

  // 🧭 Titre
  doc.setFontSize(18)
  doc.text('📄 Fiche détaillée', 14, 20)

  // 🧾 Corps
  const body = props.fields.map((f) => [
    f,
    resolveField(item, f) || '—'
  ])

  doc.autoTable({
    startY: 30,
    head: [['Champ', 'Valeur']],
    body,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [46, 139, 87] }
  })

  const name = resolveField(item, props.fields[0]) || 'element'
  doc.save(`${name}.pdf`)
}
</script>
