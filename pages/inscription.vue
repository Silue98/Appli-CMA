<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">

    <!-- En-tête église -->
    <div class="max-w-2xl mx-auto mb-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg mb-4">
        <span class="text-3xl">⛪</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-800">CMA DOKUI1</h1>
      <p class="text-gray-500 text-sm mt-1">Formulaire d'inscription membre</p>
    </div>

    <!-- État: chargement -->
    <div v-if="loading" class="max-w-2xl mx-auto text-center py-16">
      <div class="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-500 mt-4">Vérification en cours…</p>
    </div>

    <!-- État: inscriptions fermées -->
    <div v-else-if="!config?.estOuvert" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V7m0 0V5m0 2h2m-2 0H10"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Inscriptions fermées</h2>
        <p class="text-gray-500">{{ config?.messageFerme || 'Les inscriptions sont actuellement fermées. Revenez bientôt !' }}</p>
        <div v-if="config?.dateDebut && !config?.actif === false" class="mt-4 text-sm text-gray-400">
          Prochaine ouverture : {{ formatDate(config.dateDebut) }}
        </div>
      </div>
    </div>

    <!-- État: succès envoi -->
    <div v-else-if="submitted" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Demande envoyée !</h2>
        <p class="text-gray-500 mb-4">Votre demande d'inscription a bien été reçue. Un responsable l'examinera et vous contactera prochainement.</p>
        <p class="text-sm text-gray-400">Que Dieu vous bénisse 🙏</p>
      </div>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

        <!-- Message de bienvenue -->
        <div v-if="config?.messageOuvert" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {{ config.messageOuvert }}
        </div>

        <form @submit.prevent="soumettre" class="space-y-6">

          <!-- Photo -->
          <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex-shrink-0">
              <img v-if="photoPreview" :src="photoPreview" alt="Photo" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 text-center sm:text-left">
              <p class="text-sm font-medium text-gray-700 mb-2">Photo (optionnelle)</p>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button type="button" @click="$refs.cameraInput.click()"
                  class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                  📷 Prendre une photo
                </button>
                <button type="button" @click="$refs.fileInput.click()"
                  class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
                  🖼️ Galerie
                </button>
                <button v-if="photoPreview" type="button" @click="supprimerPhoto"
                  class="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" @change="handlePhoto" class="hidden"/>
            <input ref="cameraInput" type="file" accept="image/*" capture="environment" @change="handlePhoto" class="hidden"/>
          </div>

          <!-- Informations personnelles -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <span class="w-1 h-4 bg-green-500 rounded-full"></span>Informations personnelles
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nom <span class="text-red-500">*</span></label>
                <input v-model="form.nom" required placeholder="Votre nom"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Prénom <span class="text-red-500">*</span></label>
                <input v-model="form.prenom" required placeholder="Votre prénom"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Sexe <span class="text-red-500">*</span></label>
                <select v-model="form.sexe" required
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
                  <option value="" disabled>Sélectionner…</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date de naissance</label>
                <input v-model="form.dateNaissance" type="date"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Situation matrimoniale</label>
                <select v-model="form.situationMatrimoniale"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
                  <option value="">— Optionnel —</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Profession</label>
                <input v-model="form.profession" placeholder="Ex: Enseignant, Infirmier..."
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
            </div>
          </div>

          <!-- Coordonnées -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <span class="w-1 h-4 bg-blue-500 rounded-full"></span>Coordonnées
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center text-gray-500 text-xs font-medium">+225</span>
                  <input v-model="form.contact" type="tel" placeholder="07 00 00 00 00"
                    class="w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input v-model="form.email" type="email" placeholder="votre@email.com"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Adresse / Quartier</label>
                <input v-model="form.adresse" placeholder="Votre adresse ou quartier"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
            </div>
          </div>

          <!-- Informations église & département -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <span class="w-1 h-4 bg-purple-500 rounded-full"></span>Informations église & département
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date d'intégration à l'église</label>
                <input v-model="form.dateEntreeAleglise" type="date"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date de baptême</label>
                <input v-model="form.dateBaptemes" type="date"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Groupe d'activité</label>
                <select v-model="form.activiteAuSeinDP"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
                  <option value="">— Sélectionner —</option>
                  <option value="Département Culte">Département Culte</option>
                  <option value="Affermissement">Affermissement</option>
                  <option value="Bergers">Bergers</option>
                  <option value="Elizer">Elizer</option>
                  <option value="Ebenezer">Ebenezer</option>
                  <option value="Yaweh Sabaoth">Yaweh Sabaoth</option>
                  <option value="Sie Sie Wor WU">Sie Sie Wor WU</option>
                  <option value="OPH">OPH</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date d'intégration du groupe</label>
                <input v-model="form.dateEntreeDepartement" type="date"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"/>
              </div>
            </div>
          </div>

          <!-- Erreur -->
          <div v-if="erreur" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {{ erreur }}
          </div>

          <!-- Bouton soumettre -->
          <button type="submit" :disabled="envoi"
            class="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span v-if="envoi" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ envoi ? 'Envoi en cours…' : '✅ Soumettre ma demande' }}</span>
          </button>

          <p class="text-xs text-center text-gray-400">
            Les champs marqués <span class="text-red-500">*</span> sont obligatoires.
            Vos données sont utilisées uniquement pour la gestion de l'église.
          </p>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Désactiver le middleware auth global pour cette page
definePageMeta({ auth: false })

const config    = ref(null)
const loading   = ref(true)
const submitted = ref(false)
const envoi     = ref(false)
const erreur    = ref('')

const photoPreview = ref(null)
const photoBase64  = ref(null)

const fileInput   = ref(null)
const cameraInput = ref(null)

const form = ref({
  nom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  situationMatrimoniale: '',
  profession: '',
  contact: '',
  email: '',
  adresse: '',
  dateEntreeAleglise: '',
  dateBaptemes: '',
  activiteAuSeinDP: '',
  dateEntreeDepartement: ''
})

onMounted(async () => {
  try {
    config.value = await $fetch('/api/inscription/config')
  } catch (e) {
    config.value = { estOuvert: false, messageFerme: 'Service indisponible.' }
  } finally {
    loading.value = false
  }
})

const handlePhoto = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    erreur.value = 'La photo ne doit pas dépasser 5 Mo.'
    return
  }
  if (!file.type.startsWith('image/')) {
    erreur.value = 'Veuillez sélectionner un fichier image.'
    return
  }
  erreur.value = ''
  const reader = new FileReader()
  reader.onload = (ev) => {
    photoBase64.value  = ev.target.result
    photoPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const supprimerPhoto = () => {
  photoPreview.value = null
  photoBase64.value  = null
  if (fileInput.value)   fileInput.value.value   = ''
  if (cameraInput.value) cameraInput.value.value = ''
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : ''

const soumettre = async () => {
  erreur.value = ''
  envoi.value  = true
  try {
    await $fetch('/api/inscription', {
      method: 'POST',
      body: { ...form.value, photo: photoBase64.value }
    })
    submitted.value = true
  } catch (e) {
    erreur.value = e?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    envoi.value = false
  }
}
</script>