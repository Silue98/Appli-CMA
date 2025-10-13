<template>
  <section class="w-full bg-white rounded-xl shadow p-6">
    <!-- 🕊️ En-tête -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 class="text-xl font-semibold text-blue-700 flex items-center gap-2">
        ⛪ Cultes
      </h2>
      <button
        @click="showForm = !showForm"
        class="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {{ showForm ? 'Fermer' : '➕ Nouveau culte' }}
      </button>
    </div>

    <!-- 🔍 Recherche + Tri -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Rechercher un culte (thème, date...)"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option disabled value="">Trier par...</option>
        <option value="dateCulte">Date</option>
        <option value="themePrincipal">Thème</option>
      </select>
    </div>

    <!-- 🧾 Formulaire -->
    <div v-if="showForm" class="mb-4">
      <CulteForm @saved="onSaved" />
    </div>

    <!-- 📋 Tableau -->
    <div>
      <DataTable
        v-if="!isLoading"
        :headers="['Date', 'Horaire', 'Thème principal']"
        :fields="['dateCulte', 'horaire', 'themePrincipal']"
        :items="paginatedCultes"
        @delete="deleteCulte"
      />
      <p v-else class="text-gray-500 italic">Chargement des cultes...</p>
    </div>

    <!-- 📄 Pagination -->
    <div
      v-if="filteredAndSortedCultes.length > 0"
      class="flex items-center justify-between mt-6 flex-wrap gap-3"
    >
      <p class="text-sm text-gray-500">
        Page {{ currentPage }} sur {{ totalPages }}
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        >
          ⬅️ Précédent
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        >
          Suivant ➡️
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import CulteForm from '~/components/CulteForm.vue'
import DataTable from '~/components/DataTable.vue'

// États
const showForm = ref(false)
const cultes = ref([])
const isLoading = ref(true)
const search = ref('')
const sortField = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// 🔄 Charger les cultes
const fetchCultes = async () => {
  try {
    const res = await $fetch('/api/cultes')
    cultes.value = res || []
  } catch (err) {
    console.error('Erreur lors du chargement des cultes :', err)
  } finally {
    isLoading.value = false
  }
}
fetchCultes()

// ✅ Après ajout
const onSaved = () => {
  showForm.value = false
  fetchCultes()
}

// ❌ Suppression
const deleteCulte = async (item) => {
  if (!confirm(`Supprimer le culte du ${item.dateCulte} ?`)) return
  await $fetch(`/api/cultes/${item.id}`, { method: 'DELETE' })
  fetchCultes()
}

// 🔍 Filtrage et tri
const filteredAndSortedCultes = computed(() => {
  let result = cultes.value

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.themePrincipal?.toLowerCase().includes(term) ||
        c.dateCulte?.toLowerCase().includes(term) ||
        c.horaire?.toLowerCase().includes(term)
    )
  }

  if (sortField.value) {
    result = [...result].sort((a, b) =>
      (a[sortField.value] || '').localeCompare(b[sortField.value] || '')
    )
  }

  return result
})

// 🧭 Pagination
const totalPages = computed(() =>
  Math.ceil(filteredAndSortedCultes.value.length / itemsPerPage.value)
)

const paginatedCultes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAndSortedCultes.value.slice(start, start + itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>
