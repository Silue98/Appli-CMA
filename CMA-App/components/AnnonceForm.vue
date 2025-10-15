<template>
  <form
    @submit.prevent="savePredication"
    class="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-6"
  >
    <!-- 🕊️ Titre et texte biblique -->
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          v-model="form.titre"
          type="text"
          placeholder="Ex: La foi qui déplace les montagnes"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Texte biblique</label>
        <input
          v-model="form.texteBiblique"
          type="text"
          placeholder="Ex: Matthieu 17:20"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
    </div>

    <!-- 🧾 Résumé (Rich Text) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
      <ClientOnly>
        <component
          :is="QuillEditor"
          v-if="QuillEditor"
          v-model:content="form.resume"
          content-type="html"
          theme="snow"
          placeholder="Résumé court du message..."
          class="rich-editor"
        />
        <textarea
          v-else
          v-model="form.resume"
          placeholder="Résumé court du message..."
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </ClientOnly>
    </div>

    <!-- 📖 Message (Rich Text) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
      <ClientOnly>
        <component
          :is="QuillEditor"
          v-if="QuillEditor"
          v-model:content="form.message"
          content-type="html"
          theme="snow"
          placeholder="Contenu principal ou points du message..."
          class="rich-editor"
        />
        <textarea
          v-else
          v-model="form.message"
          placeholder="Contenu principal ou points du message..."
          rows="5"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </ClientOnly>
    </div>

    <!-- 🔗 Sélections liées -->
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Culte</label>
        <select
          v-model="form.culteId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Sélectionner un culte --</option>
          <option v-for="c in cultes" :key="c.id" :value="c.id">
            {{ c.themePrincipal }} - {{ formatDate(c.dateCulte) }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Prédicateur</label>
        <select
          v-model="form.predicateurId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Sélectionner un prédicateur --</option>
          <option v-for="m in membres" :key="m.id" :value="m.id">
            {{ m.nom }} {{ m.prenom }}
          </option>
        </select>
      </div>
    </div>

    <!-- 🧩 Bouton d'action -->
    <div class="flex justify-end mt-6">
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        💾 Enregistrer la prédication
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'

// 🔹 Données du formulaire
const form = ref({
  titre: '',
  texteBiblique: '',
  resume: '',
  message: '',
  culteId: '',
  predicateurId: '',
})

// 🔹 Données liées
const cultes = ref([])
const membres = ref([])

// 🔹 Éditeur Quill
const QuillEditor = shallowRef(null)

// Chargement dynamique de l'éditeur Quill
onMounted(async () => {
  if (process.client) {
    const module = await import('@vueup/vue-quill')
    QuillEditor.value = module.QuillEditor
    await import('@vueup/vue-quill/dist/vue-quill.snow.css')
  }
})

const emit = defineEmits(['saved'])

// 🔄 Charger cultes et membres
const loadData = async () => {
  try {
    const [cultesData, membresData] = await Promise.all([
      $fetch('/api/cultes'),
      $fetch('/api/membres'),
    ])
    cultes.value = cultesData || []
    membres.value = membresData || []
  } catch (err) {
    console.error('Erreur lors du chargement des données liées :', err)
  }
}

onMounted(() => {
  loadData()
})

// 📅 Formater la date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// 💾 Enregistrer une prédication
const savePredication = async () => {
  try {
    await $fetch('/api/predications', {
      method: 'POST',
      body: form.value,
    })
    alert('✅ Prédication enregistrée avec succès !')
    emit('saved')
    resetForm()
  } catch (err) {
    console.error('Erreur à l\'enregistrement :', err)
    alert('❌ Une erreur est survenue.')
  }
}

// 🧼 Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    titre: '',
    texteBiblique: '',
    resume: '',
    message: '',
    culteId: '',
    predicateurId: '',
  }
}
</script>

<style scoped>
.rich-editor {
  /* @apply bg-white border border-gray-300 rounded-lg min-h-[150px]; */
}
</style>