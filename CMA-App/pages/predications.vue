<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-blue-700">📖 Prédications</h1>

    <PredicationForm @saved="refresh()" />

    <DataTable
      :headers="['Titre', 'Texte Biblique', 'Culte', 'Prédicateur']"
      :fields="['titre', 'texteBiblique', 'culteId', 'predicateurId']"
      :items="predications"
      @delete="deletePredication"
    />
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import PredicationForm from '~/components/PredicationForm.vue'

const { data: predications, refresh } = await useFetch('/api/predications')

const deletePredication = async (item) => {
  await $fetch(`/api/predications/${item.id}`, { method: 'DELETE' })
  refresh()
}
</script>
