<template>
  <form
    @submit.prevent="save"
    class="bg-white p-4 shadow rounded-xl mb-4 space-y-4 border border-gray-100"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.nom" placeholder="Nom du membre" class="input" />
      <input v-model="form.prenom" placeholder="Prénom du membre" class="input" />
      <select v-model="form.sexe" class="input">
        <option value="">-- Sexe --</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>
      <input v-model="form.contact" placeholder="Contact téléphonique" class="input" />
      <input v-model="form.email" placeholder="Email (optionnel)" type="email" class="input" />
      <input v-model="form.adresse" placeholder="Adresse" class="input" />
    </div>

    <button
      type="submit"
      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      💾 Enregistrer
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['saved'])

const form = reactive({
  nom: '',
  prenom: '',
  sexe: '',
  contact: '',
  email: '',
  adresse: ''
})

const save = async () => {
  await $fetch('/api/membres', { method: 'POST', body: form })
  Object.assign(form, {
    nom: '',
    prenom: '',
    sexe: '',
    contact: '',
    email: '',
    adresse: ''
  })
  emit('saved')
}
</script>

<style scoped>
/* .input {
  @apply p-2 border rounded-lg w-full focus:ring focus:ring-green-200;
} */
</style>
