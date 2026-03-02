<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-green-700">👥 Gestion des Membres</h1>

    <button
      @click="showForm = !showForm"
      class="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      ➕ Nouveau membre
    </button>

    <MembreForm v-if="showForm" @saved="refresh()" />

    <DataTable
      :headers="['Nom', 'Prénom', 'Sexe', 'Contact']"
      :fields="['nom', 'prenom', 'sexe', 'contact']"
      :items="membres"
      @delete="deleteMembre"
    />
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import MembreForm from '~/components/MembreForm.vue'

const showForm = ref(false)
const { data: membres, refresh } = await useFetch('/api/membres')

const deleteMembre = async (item) => {
  await $fetch(`/api/membres/${item.id}`, { method: 'DELETE' })
  refresh()
}
</script>
