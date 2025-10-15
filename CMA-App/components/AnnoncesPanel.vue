<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-green-700">📢 Annonces</h1>

    <div class="mb-4">
      <button
        @click="showForm = !showForm"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        {{ showForm ? '🔒 Fermer le formulaire' : '🆕 Nouvelle annonce' }}
      </button>
    </div>

    <AnnonceForm
      v-if="showForm"
      @saved="refresh(); showForm = false"
      @close="showForm = false"
    />

    <DataTable
      :headers="[
        'Titre', 'Culte', 'Infos du jour',
        'Remerciements', 'Rappels', 'Commentaires'
      ]"
      :fields="[
        'titre', 'culteId',
        'infosJour', 'remerciements',
        'rappels', 'commentaires'
      ]"
      :items="annonces"
      @delete="deleteAnnonce"
    />
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import AnnonceForm from '~/components/AnnonceForm.vue'

const showForm = ref(false)
const { data: annonces, refresh } = await useFetch('/api/annonces')

const deleteAnnonce = async (item) => {
  await $fetch(`/api/annonces/${item.id}`, { method: 'DELETE' })
  refresh()
}
</script>
