<template>
  <form
    @submit.prevent="save"
    class="bg-white p-4 shadow rounded-xl mb-4 space-y-6 border border-gray-100"
  >
    <!-- 🏷️ Informations générales -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-700">Titre</label>
        <input
          v-model="form.titre"
          placeholder="Titre de l'annonce"
          class="input"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-700">Culte associé</label>
        <input
          v-model.number="form.culteId"
          placeholder="ID du culte"
          type="number"
          class="input"
          required
        />
      </div>
    </div>

    <!-- 📝 Champs riches -->
    <div v-for="(label, key) in textFields" :key="key">
      <label class="block text-sm font-semibold mb-1 text-gray-700">{{ label }}</label>
      <ClientOnly>
        <component
          :is="QuillEditor"
          v-if="QuillEditor"
          v-model:content="form[key]"
          content-type="html"
          theme="snow"
          :placeholder="`Rédige ${label.toLowerCase()}...`"
          class="rich-editor"
        />
        <textarea
          v-else
          v-model="form[key]"
          class="input min-h-[150px]"
          :placeholder="label"
        />
      </ClientOnly>
    </div>

    <!-- 🧾 Compte rendu -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-blue-700 mb-2">
        📝 Compte rendu du dernier culte
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="form.compteRendu.messager"
          placeholder="Messager"
          class="input"
        />
        <input
          v-model="form.compteRendu.texteBiblique"
          placeholder="Texte biblique"
          class="input"
        />
        <input
          v-model.number="form.compteRendu.assistanceTotale"
          placeholder="Assistance totale"
          type="number"
          class="input"
        />
        <input
          v-model="form.compteRendu.theme"
          placeholder="Thème du culte précédent"
          class="input"
        />
      </div>
    </div>

    <!-- 💾 Boutons -->
    <div class="flex justify-end space-x-3 mt-6">
      <button
        type="button"
        @click="emit('close')"
        class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        ❌ Fermer
      </button>

      <button
        type="submit"
        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        💾 Enregistrer
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, shallowRef, onMounted } from 'vue'

// Événements envoyés au parent
const emit = defineEmits(['saved', 'close'])

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

// Dictionnaire des champs "rich text"
const textFields = {
  infosJour: 'Informations du jour',
  remerciements: 'Remerciements',
  rappels: 'Rappels',
  commentaires: 'Commentaires'
}

// Chargement dynamique de l’éditeur Quill
const QuillEditor = shallowRef(null)

onMounted(async () => {
  if (process.client) {
    const module = await import('@vueup/vue-quill')
    QuillEditor.value = module.QuillEditor
    await import('@vueup/vue-quill/dist/vue-quill.snow.css')
  }
})

// Fonction d’enregistrement
const save = async () => {
  try {
    await $fetch('/api/annonces', {
      method: 'POST',
      body: form
    })
    alert('✅ Annonce enregistrée avec succès !')

    Object.assign(form, {
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

    emit('saved')
  } catch (err) {
    console.error('Erreur à l’enregistrement :', err)
    alert('❌ Une erreur est survenue.')
  }
}
</script>

<style scoped>
.input {
  /* @apply p-2 border border-gray-300 rounded-lg w-full focus:ring focus:ring-green-200; */
}
.rich-editor {
  /* @apply bg-white border border-gray-300 rounded-lg min-h-[150px]; */
}
</style>
