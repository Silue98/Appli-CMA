<template>
  <form @submit.prevent="save" class="bg-white p-4 shadow rounded-xl mb-4 space-y-4 border border-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.titre" placeholder="Titre de l'annonce" class="input" />
      <input v-model.number="form.culteId" placeholder="ID du culte" type="number" class="input" />
      <textarea v-model="form.infosJour" placeholder="Informations du jour" class="input"></textarea>
      <textarea v-model="form.remerciements" placeholder="Remerciements" class="input"></textarea>
      <textarea v-model="form.rappels" placeholder="Rappels" class="input"></textarea>
      <textarea v-model="form.commentaires" placeholder="Commentaires" class="input"></textarea>
    </div>

    <h3 class="text-lg font-semibold text-blue-700 mt-4">📝 Compte rendu du dernier culte</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.compteRendu.messager" placeholder="Messager" class="input" />
      <input v-model="form.compteRendu.texteBiblique" placeholder="Texte biblique" class="input" />
      <input v-model.number="form.compteRendu.assistanceTotale" placeholder="Assistance totale" type="number" class="input" />
      <input v-model="form.compteRendu.theme" placeholder="Thème du culte précédent" class="input" />
    </div>

    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
      💾 Enregistrer
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['saved'])
const form = reactive({
  titre: '',
  culteId: '',
  infosJour: '',
  remerciements: '',
  rappels: '',
  commentaires: '',
  compteRendu: {
    messager: '',
    texteBiblique: '',
    assistanceTotale: null,
    theme: ''
  }
})

const save = async () => {
  await $fetch('/api/annonces', { method: 'POST', body: form })
  Object.assign(form, {
    titre: '',
    culteId: '',
    infosJour: '',
    remerciements: '',
    rappels: '',
    commentaires: '',
    compteRendu: { messager: '', texteBiblique: '', assistanceTotale: null, theme: '' }
  })
  emit('saved')
}
</script>

<style scoped>
.input {
  @apply p-2 border rounded-lg w-full focus:ring focus:ring-green-200;
}
</style>
