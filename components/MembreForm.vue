<template>
  <form @submit.prevent="save" class="bg-white p-6 shadow-xl rounded-2xl mb-6 space-y-8 border border-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? 'Modifier le membre' : 'Nouveau Membre' }}</h2>
        <p class="text-gray-500 mt-1 text-sm">{{ isEdit ? 'Modifiez les informations du membre' : 'Remplissez les informations du membre' }}</p>
      </div>
      <div class="h-14 w-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
    </div>

    <!-- Photo -->
    <div class="flex flex-col md:flex-row items-center gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
      <div class="relative">
        <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl ring-4 ring-green-50">
          <img v-if="photoPreview" :src="photoPreview" alt="Photo" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <svg class="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div class="absolute -top-2 -right-2 bg-white px-2 py-1 rounded-full shadow text-xs font-semibold text-gray-600 border border-gray-200">Photo</div>
      </div>
      <div class="flex-1 space-y-3">
        <h3 class="text-base font-semibold text-gray-700">Photo du membre</h3>
        <p class="text-sm text-gray-400">Optionnelle — max 5 Mo</p>
        <div class="flex flex-wrap gap-2">
          <button type="button" @click="$refs.cameraInput.click()"
            class="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm flex items-center gap-2">
            📷 Prendre une photo
          </button>
          <button type="button" @click="$refs.fileInput.click()"
            class="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm flex items-center gap-2">
            🖼️ Galerie
          </button>
          <button v-if="photoPreview" type="button" @click="removePhoto"
            class="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm flex items-center gap-2">
            🗑️ Supprimer
          </button>
        </div>
        <p v-if="photoPreview" class="text-sm text-green-600 flex items-center gap-1">✅ Photo sélectionnée</p>
      </div>
      <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden" />
      <input ref="cameraInput" type="file" accept="image/*" capture="environment" @change="handleFileSelect" class="hidden" />
    </div>

    <!-- Informations personnelles -->
    <div>
      <h3 class="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <span class="w-1 h-5 bg-green-500 rounded-full"></span>Informations personnelles
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Nom <span class="text-red-500">*</span></label>
          <input v-model="form.nom" placeholder="Nom" required
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Prénom <span class="text-red-500">*</span></label>
          <input v-model="form.prenom" placeholder="Prénom" required
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Sexe <span class="text-red-500">*</span></label>
          <select v-model="form.sexe" required
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
            <option value="" disabled>Sélectionner...</option>
            <option value="HOMME">Homme</option>
            <option value="FEMME">Femme</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Date de naissance</label>
          <input v-model="form.dateNaissance" type="date"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Situation matrimoniale</label>
          <select v-model="form.situationMatrimoniale"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
            <option value="">— Optionnel —</option>
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Veuf(ve)">Veuf(ve)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div>
      <h3 class="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <span class="w-1 h-5 bg-blue-500 rounded-full"></span>Coordonnées
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm font-medium">+225</span>
            <input v-model="form.contact" placeholder="07 00 00 00 00" type="tel"
              class="w-full pl-14 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input v-model="form.email" placeholder="email@exemple.com" type="email"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
          <input v-model="form.adresse" placeholder="Adresse complète"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
      </div>
    </div>

    <!-- Infos église -->
    <div>
      <h3 class="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <span class="w-1 h-5 bg-purple-500 rounded-full"></span>Informations église & département
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Profession</label>
          <input v-model="form.profession" placeholder="Ex: Enseignant, Infirmier..."
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Date d'intégration à l'église</label>
          <input v-model="form.dateEntreeAleglise" type="date"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Date de baptême</label>
          <input v-model="form.dateBaptemes" type="date"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Groupe d'activité</label>
          <select v-model="form.activiteAuSeinDP"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition appearance-none">
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
          <label class="block text-sm font-medium text-gray-600 mb-1">Date d'intégration du groupe</label>
          <input v-model="form.dateEntreeDepartement" type="date"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition" />
        </div>
      </div>
    </div>

    <!-- Boutons -->
    <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
      <button type="submit" :disabled="isSaving"
        class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
        <svg v-if="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ isSaving ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Enregistrer le membre') }}
      </button>
      <button type="button" @click="$emit('cancel')"
        class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition border border-gray-200 flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Annuler
      </button>
    </div>

    <!-- Messages d'erreur/succès -->
    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">❌ {{ errorMsg }}</p>
  </form>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'

const props = defineProps({
  existingData: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => !!props.existingData?.id)
const isSaving = ref(false)
const errorMsg = ref('')

const fileInput = ref(null)
const cameraInput = ref(null)
const photoFile = ref(null)
const photoPreview = ref(null)

const form = reactive({
  nom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  contact: '',
  email: '',
  adresse: '',
  situationMatrimoniale: '',
  profession: '',
  activiteAuSeinDP: '',
  dateEntreeAleglise: '',
  dateBaptemes: '',
  dateEntreeDepartement: ''
})

// Pré-remplir si édition
watch(() => props.existingData, (data) => {
  if (data) {
    Object.keys(form).forEach(key => {
      if (data[key] !== undefined) {
        if (key.toLowerCase().includes('date') && data[key]) {
          form[key] = new Date(data[key]).toISOString().split('T')[0]
        } else {
          form[key] = data[key] || ''
        }
      }
    })
    if (data.photo) photoPreview.value = data.photo
  } else {
    Object.assign(form, {
      nom: '', prenom: '', sexe: '', dateNaissance: '', contact: '', email: '',
      adresse: '', situationMatrimoniale: '', profession: '', activiteAuSeinDP: '',
      dateEntreeAleglise: '', dateBaptemes: '', dateEntreeDepartement: ''
    })
    removePhoto()
  }
}, { immediate: true })

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { errorMsg.value = 'La photo ne doit pas dépasser 5 Mo'; return }
  if (!file.type.startsWith('image/')) { errorMsg.value = 'Fichier image invalide'; return }

  photoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { photoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const removePhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
  if (cameraInput.value) cameraInput.value.value = ''
}

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
})

const save = async () => {
  errorMsg.value = ''
  if (!form.nom || !form.prenom || !form.sexe) {
    errorMsg.value = 'Veuillez remplir tous les champs obligatoires (*)'
    return
  }

  isSaving.value = true
  try {
    const payload = { ...form }

    // Photo : si nouvelle sélection → base64, sinon conserver l'URL existante
    if (photoFile.value) {
      payload.photo = await fileToBase64(photoFile.value)
    } else if (photoPreview.value && photoPreview.value.startsWith('/media')) {
      payload.photo = photoPreview.value
    }

    if (isEdit.value) {
      await $fetch(`/api/membres/${props.existingData.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/membres', { method: 'POST', body: payload })
    }

    emit('saved')
  } catch (err) {
    errorMsg.value = err.data?.message || err.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}


</script>
