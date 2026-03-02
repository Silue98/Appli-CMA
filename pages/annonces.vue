<template>
  <div class="p-6">
    <!-- 🏷️ Titre principal -->
    <h1 class="text-2xl font-bold mb-6 text-green-700">📢 Gestion des Annonces</h1>

    <!-- ✅ Bouton d’ajout -->
    <div class="flex justify-end mb-4">
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        ➕ Nouvelle annonce
      </button>
    </div>

    <!-- ✅ Formulaire d’ajout/modification -->
    <div v-if="showForm" class="mb-6 bg-gray-50 p-4 rounded-xl shadow">
      <AnnonceForm
        :existingData="selectedAnnonce"
        @saved="onSaved"
        @cancel="onCancel"
      />
    </div>

    <!-- ✅ Tableau de données -->
    <DataTable
      :headers="['Titre', 'Culte', 'Infos du jour']"
      :fields="['titre', 'culte.nom', 'infosJour']"
      :items="annonces"
      @edit="editAnnonce"
      @delete="deleteAnnonce"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '~/components/DataTable.vue'
import AnnonceForm from '~/components/AnnonceForm.vue'

/**
 * 🧩 Données
 */
const showForm = ref(false)
const selectedAnnonce = ref(null)

// 🔄 Récupération des annonces
const { data: annonces, refresh } = await useFetch('/api/annonces')

/**
 * 📌 Actions
 */
const onSaved = () => {
  showForm.value = false
  selectedAnnonce.value = null
  refresh()
}

const onCancel = () => {
  showForm.value = false
  selectedAnnonce.value = null
}

const editAnnonce = (item) => {
  selectedAnnonce.value = { ...item }
  showForm.value = true
}

const deleteAnnonce = async (item) => {
  if (confirm(`Voulez-vous vraiment supprimer l’annonce : "${item.titre}" ?`)) {
    await $fetch(`/api/annonces/${item.id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>

<style scoped>
/* Petite animation d’apparition du formulaire */
form {
  transition: all 0.3s ease;
}
</style>
