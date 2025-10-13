<template>
  <section class="w-full bg-white rounded-xl shadow p-6">
    <!-- 🧭 En-tête -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 class="text-xl font-semibold text-blue-700 flex items-center gap-2">
        📖 Prédications
      </h2>
      <button
        @click="showForm = !showForm"
        class="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {{ showForm ? 'Fermer' : '➕ Nouvelle prédication' }}
      </button>
    </div>

    <!-- 🔍 Filtres & Recherche -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Rechercher une prédication..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option disabled value="">Trier par...</option>
        <option value="titre">Titre</option>
        <option value="texteBiblique">Texte biblique</option>
        <option value="culte.themePrincipal">Culte</option>
      </select>
    </div>

    <!-- 📝 Formulaire -->
    <div v-if="showForm" class="mb-4">
      <PredicationForm @saved="onSaved" />
    </div>

    <!-- 📋 Tableau -->
    <div>
      <DataTable
        v-if="!isLoading"
        :headers="['Titre', 'Texte biblique', 'Culte', 'Prédicateur']"
        :fields="['titre', 'texteBiblique', 'culte.themePrincipal', 'predicateur.nom']"
        :items="paginatedPredications"
        @delete="deletePredication"
      />
      <p v-else class="text-gray-500 italic">Chargement...</p>
    </div>

    <!-- 📄 Pagination -->
    <div
      v-if="filteredAndSortedPredications.length > 0"
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
import PredicationForm from '~/components/PredicationForm.vue'
import DataTable from '~/components/DataTable.vue'

const showForm = ref(false)
const predications = ref([])
const isLoading = ref(true)
const search = ref('')
const sortField = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Charger les prédications
const fetchPredications = async () => {
  try {
    const res = await $fetch('/api/predications?include=culte,predicateur')
    predications.value = res || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
fetchPredications()

// Rafraîchir après enregistrement
const onSaved = () => {
  showForm.value = false
  fetchPredications()
}

// Suppression
const deletePredication = async (item) => {
  if (!confirm(`Supprimer la prédication "${item.titre}" ?`)) return
  await $fetch(`/api/predications/${item.id}`, { method: 'DELETE' })
  fetchPredications()
}

// 🔍 Filtrage et tri
const filteredAndSortedPredications = computed(() => {
  let result = predications.value

  // Recherche
  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.titre?.toLowerCase().includes(term) ||
        p.texteBiblique?.toLowerCase().includes(term) ||
        p.culte?.themePrincipal?.toLowerCase().includes(term) ||
        p.predicateur?.nom?.toLowerCase().includes(term)
    )
  }

  // Tri
  if (sortField.value) {
    result = [...result].sort((a, b) =>
      (a[sortField.value] || '').localeCompare(b[sortField.value] || '')
    )
  }

  return result
})

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredAndSortedPredications.value.length / itemsPerPage.value)
)

const paginatedPredications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAndSortedPredications.value.slice(start, start + itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>
