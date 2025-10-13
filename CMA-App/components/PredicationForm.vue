<template>
  <form
    @submit.prevent="savePredication"
    class="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4"
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

    <!-- 🧾 Résumé -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
      <textarea
        v-model="form.resume"
        placeholder="Résumé court du message..."
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>
    </div>

    <!-- 📖 Message -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
      <textarea
        v-model="form.message"
        placeholder="Contenu principal ou points du message..."
        rows="5"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>
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
            {{ c.themePrincipal }} - {{ c.dateCulte }}
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

    <!-- 🧩 Bouton d’action -->
    <div class="flex justify-end mt-6">
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        💾 Enregistrer
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
onMounted(loadData)

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
    console.error('Erreur à l’enregistrement :', err)
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
