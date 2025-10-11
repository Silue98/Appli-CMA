<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-green-700">📢 Annonces</h1>

    <AnnonceForm @saved="refresh()" />

    <DataTable
      :headers="['Titre', 'Culte', 'Infos du jour']"
      :fields="['titre', 'culteId', 'infosJour']"
      :items="annonces"
      @delete="deleteAnnonce"
    />
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import AnnonceForm from '~/components/AnnonceForm.vue'

const { data: annonces, refresh } = await useFetch('/api/annonces')

const deleteAnnonce = async (item) => {
  await $fetch(`/api/annonces/${item.id}`, { method: 'DELETE' })
  refresh()
}
</script>
