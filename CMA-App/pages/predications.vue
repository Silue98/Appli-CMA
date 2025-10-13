<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-blue-700">📖 Gestion des Prédications</h1>

    <!-- Bouton d’ajout -->
    <button
      @click="showForm = !showForm"
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      {{ showForm ? '❌ Fermer' : '➕ Nouvelle prédication' }}
    </button>

    <!-- Formulaire -->
    <PredicationForm v-if="showForm" @saved="refresh()" />

    <!-- Filtres et recherche -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Rechercher..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <select
        v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
      >
        <option disabled value="">Trier par...</option>
        <option value="titre">Titre</option>
        <option value="texteBiblique">Texte biblique</option>
        <option value="culte.themePrincipal">Culte</option>
        <option value="predicateur.nom">Prédicateur</option>
      </select>
    </div>

    <!-- Tableau -->
    <DataTable
      :headers="['Titre', 'Texte biblique', 'Culte', 'Prédicateur']"
      :fields="['titre', 'texteBiblique', 'culte.themePrincipal', 'predicateur.nom']"
      :items="filteredAndSortedPredications"
      @delete="deletePredication"
    />
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import PredicationForm from '~/components/PredicationForm.vue'
import { ref, computed } from 'vue'

const showForm = ref(false)
const search = ref('')
const sortField = ref('')

const { data: predications, refresh } = await useFetch('/api/predications?include=culte,predicateur')

// Suppression
const deletePredication = async (item) => {
  if (!confirm(`Supprimer la prédication "${item.titre}" ?`)) return
  await $fetch(`/api/predications/${item.id}`, { method: 'DELETE' })
  refresh()
}

// Filtrage et tri
const filteredAndSortedPredications = computed(() => {
  let result = predications.value || []

  // 🔍 Recherche
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

  // ↕️ Tri
  if (sortField.value) {
    const fieldPath = sortField.value.split('.')
    result = [...result].sort((a, b) => {
      const aValue = fieldPath.reduce((obj, key) => obj?.[key], a) || ''
      const bValue = fieldPath.reduce((obj, key) => obj?.[key], b) || ''
      return aValue.localeCompare(bValue)
    })
  }

  return result
})
</script>
