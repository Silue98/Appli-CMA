<template>
  <form @submit.prevent="save" class="bg-white p-4 shadow rounded-xl mb-4 space-y-4 border border-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.titre" placeholder="Titre de la prédication" class="input" />
      <input v-model="form.texteBiblique" placeholder="Texte biblique" class="input" />
      <textarea v-model="form.resume" placeholder="Résumé (optionnel)" class="input"></textarea>
      <textarea v-model="form.message" placeholder="Message (contenu)" class="input"></textarea>

      <input v-model.number="form.culteId" placeholder="ID du culte" type="number" class="input" />
      <input v-model.number="form.predicateurId" placeholder="ID du prédicateur" type="number" class="input" />
    </div>

    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      💾 Enregistrer
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['saved'])
const form = reactive({
  titre: '',
  texteBiblique: '',
  resume: '',
  message: '',
  culteId: '',
  predicateurId: ''
})

const save = async () => {
  await $fetch('/api/predications', { method: 'POST', body: form })
  Object.assign(form, { titre: '', texteBiblique: '', resume: '', message: '', culteId: '', predicateurId: '' })
  emit('saved')
}
</script>

<style scoped>
.input {
  @apply p-2 border rounded-lg w-full focus:ring focus:ring-blue-200;
}
</style>
