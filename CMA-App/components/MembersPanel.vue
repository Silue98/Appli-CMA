<template>
  <section class="w-full bg-white rounded-xl shadow p-6">
    <!-- En-tête -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 class="text-xl font-semibold text-green-700 flex items-center gap-2">
        👥 Membres
      </h2>
      <button
        @click="showForm = !showForm"
        class="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        {{ showForm ? 'Fermer' : '➕ Nouveau membre' }}
      </button>
    </div>

    <!-- Filtres & Recherche -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Rechercher un membre..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <select
        v-model="sexeFilter"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="">Tous les sexes</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>

      <select
        v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option disabled value="">Trier par...</option>
        <option value="nom">Nom</option>
        <option value="prenom">Prénom</option>
      </select>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-4">
      <MembreForm @saved="onSaved" />
    </div>

    <!-- Tableau -->
    <div>
      <DataTable
        v-if="!isLoading"
        :headers="['Nom', 'Prénom', 'Sexe', 'Contact']"
        :fields="['nom', 'prenom', 'sexe', 'contact']"
        :items="filteredAndSortedMembres"
        @delete="deleteMembre"
      />
      <p v-else class="text-gray-500 italic">Chargement...</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import MembreForm from '~/components/MembreForm.vue'
import DataTable from '~/components/DataTable.vue'

const showForm = ref(false)
const membres = ref([])
const isLoading = ref(true)
const search = ref('')
const sexeFilter = ref('')
const sortField = ref('')

const fetchMembres = async () => {
  try {
    const res = await $fetch('/api/membres')
    membres.value = res || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
fetchMembres()

const onSaved = () => {
  showForm.value = false
  fetchMembres()
}

// Suppression d’un membre
const deleteMembre = async (item) => {
  if (!confirm(`Supprimer ${item.nom} ${item.prenom} ?`)) return
  await $fetch(`/api/membres/${item.id}`, { method: 'DELETE' })
  fetchMembres()
}

// 🔍 Filtrage + Tri dynamique
const filteredAndSortedMembres = computed(() => {
  let result = membres.value

  // Filtrage recherche
  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      (m) =>
        m.nom?.toLowerCase().includes(term) ||
        m.prenom?.toLowerCase().includes(term) ||
        m.contact?.toLowerCase().includes(term)
    )
  }

  // Filtrage sexe
  if (sexeFilter.value) {
    result = result.filter((m) => m.sexe === sexeFilter.value)
  }

  // Tri
  if (sortField.value) {
    result = [...result].sort((a, b) =>
      (a[sortField.value] || '').localeCompare(b[sortField.value] || '')
    )
  }

  return result
})
</script>
