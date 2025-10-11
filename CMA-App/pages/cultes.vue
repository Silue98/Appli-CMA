<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-blue-700">⛪ Cultes</h1>

    <CulteForm @saved="refresh()" />

    <DataTable
      :headers="['Date', 'Horaire', 'Thème principal']"
      :fields="['dateCulte', 'horaire', 'themePrincipal']"
      :items="cultes"
    />
  </div>
</template>

<script setup>
import CulteForm from '~/components/CulteForm.vue'
import DataTable from '~/components/DataTable.vue'

const { data: cultes, refresh } = await useFetch('/api/cultes')
</script>
