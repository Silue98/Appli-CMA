<template>
  <form @submit.prevent="save" class="bg-white p-4 shadow rounded-xl mb-4 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input type="date" v-model="form.dateCulte" class="input" />
      <input v-model="form.horaire" placeholder="Horaire (ex: 08h00)" class="input" />
      <input v-model="form.themePrincipal" placeholder="Thème principal" class="input" />
    </div>
    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">💾 Ajouter</button>
  </form>
</template>

<script setup>
const emit = defineEmits(['saved'])
const form = reactive({ dateCulte: '', horaire: '', themePrincipal: '' })

const save = async () => {
  await $fetch('/api/cultes', { method: 'POST', body: form })
  Object.assign(form, { dateCulte: '', horaire: '', themePrincipal: '' })
  emit('saved')
}
</script>

<style scoped>
.input {
  @apply p-2 border rounded-lg w-full focus:ring focus:ring-green-200;
}
</style>
