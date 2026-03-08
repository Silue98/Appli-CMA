<template>
  <form
    @submit.prevent="save"
    class="bg-white p-8 shadow-xl rounded-2xl mb-6 space-y-8 border border-gray-100"
  >
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Nouveau Membre</h2>
        <p class="text-gray-500 mt-1">Remplissez les informations du membre</p>
      </div>
      <div class="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
    </div>

    <!-- Section Photo -->
    <div class="flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
      <!-- Photo de profil -->
      <div class="relative">
        <div class="w-36 h-36 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl ring-4 ring-green-50">
          <img 
            v-if="photoPreview" 
            :src="photoPreview" 
            alt="Photo du membre"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        
        <!-- Badge "Photo" -->
        <div class="absolute -top-2 -right-2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-semibold text-gray-600 border border-gray-200">
          Photo
        </div>
      </div>

      <!-- Boutons d'action pour la photo -->
      <div class="flex-1 space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
          Photo du membre
        </h3>
        <p class="text-sm text-gray-500">Ajoutez une photo pour identifier facilement le membre (optionnel)</p>
        
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            @click="takePhoto"
            class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Prendre une photo
          </button>
          
          <button
            type="button"
            @click="chooseFromGallery"
            class="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choisir depuis la galerie
          </button>
          
          <button
            v-if="photoPreview"
            type="button"
            @click="removePhoto"
            class="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>

        <!-- Statut de la photo -->
        <div v-if="photoPreview" class="flex items-center gap-2 text-sm text-green-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Photo sélectionnée</span>
        </div>
      </div>

      <!-- Inputs cachés pour la sélection de fichiers -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <input
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <!-- Le reste du formulaire -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Informations personnelles -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3">
        <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
          Informations personnelles
        </h3>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Nom <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input 
            v-model="form.nom" 
            placeholder="Nom du membre" 
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Prénom <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input 
            v-model="form.prenom" 
            placeholder="Prénom du membre" 
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Sexe <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select v-model="form.sexe" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none appearance-none transition-all duration-200 group-hover:border-gray-300">
            <option value="" disabled class="text-gray-400">Sélectionnez le sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Date de naissance
        </label>
        <div class="relative">
          <input 
            v-model="form.dateNaissance" 
            type="date" 
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Situation Matrimoniale <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select v-model="form.situationMatrimoniale" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none appearance-none transition-all duration-200 group-hover:border-gray-300">
            <option value="" disabled class="text-gray-400">Sélectionnez votre situation Matrimoniale</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Célibataire">Célibataire</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Informations de contact -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3 mt-4">
        <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
          Informations de contact
        </h3>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Contact téléphonique
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="text-gray-500 font-medium">+225</span>
          </div>
          <input 
            v-model="form.contact" 
            placeholder="07 00 00 00 00" 
            type="tel"
            class="w-full px-4 py-3 pl-16 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Email
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input 
            v-model="form.email" 
            placeholder="email@exemple.com" 
            type="email"
            class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
        </div>
      </div>

      <div class="group md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Adresse
        </label>
        <div class="relative">
          <input 
            v-model="form.adresse" 
            placeholder="Adresse complète" 
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Informations professionnelles et activité -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3 mt-4">
        <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
          Informations professionnelles et activité
        </h3>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Profession
        </label>
        <div class="relative">
          <input 
            v-model="form.profession" 
            placeholder="Ex: Enseignant, Infirmier..." 
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Groupe d'activité <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select  v-model="form.activiteAuSeinDP" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none appearance-none transition-all duration-200 group-hover:border-gray-300">
            <option value="" disabled class="text-gray-400">Sélectionnez votre groupe d'activité</option>
            <option value="Département Culte">Département Culte</option>
            <option value="Affermissement">Affermissement</option>
            <option value="Bergers">Bergers</option>
            <option value="Elizer">Elizer</option>
            <option value="Ebenezer">Ebenezer</option>
            <option value="Yaweh Sabaoth">Yaweh Sabaoth</option>
            <option value="Sie Sie Wor WU">Sie Sie Wor WU</option>
            <option value="OPH">OPH</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group">
        <label class="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-green-600 transition-colors">
          Date d'intégration du Groupe d'activité
        </label>
        <div class="relative">
          <input 
            v-model="form.dateEntreeDepartement" 
            type="date" 
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
      <button
        type="submit"
        class="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
      >
        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Enregistrer le membre</span>
      </button>
      
      <button
        type="button"
        @click="resetForm"
        class="flex-1 px-6 py-3.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 flex items-center justify-center gap-3 group"
      >
        <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Annuler</span>
      </button>
    </div>
  </form>
</template>

<!-- <script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['saved'])

// Références pour les inputs de fichier
const fileInput = ref(null)
const cameraInput = ref(null)

// États pour la photo
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
  dateEntreeDepartement: '',  // Changé pour correspondre au schéma Prisma
  profession: '',
  activiteAuSeinDP: '',
  situationMatrimoniale: '',  // Changé pour correspondre au schéma Prisma
  photo: null
})

// Fonction pour prendre une photo avec l'appareil photo
const takePhoto = () => {
  cameraInput.value.click()
}

// Fonction pour choisir une photo depuis la galerie
const chooseFromGallery = () => {
  fileInput.value.click()
}

// Fonction pour supprimer la photo
const removePhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  form.photo = null
  // Réinitialiser les inputs de fichier
  if (fileInput.value) fileInput.value.value = ''
  if (cameraInput.value) cameraInput.value.value = ''
}

// Gestionnaire de sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5MB')
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }
    
    photoFile.value = file
    form.photo = file
    
    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const resetForm = () => {
  Object.assign(form, {
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    contact: '',
    email: '',
    adresse: '',
    dateEntreeDepartement: '',
    profession: '',
    activiteAuSeinDP: '',
    situationMatrimoniale: '',
    photo: null
  })
  removePhoto()
}

const save = async () => {
  try {
    // Validation simple
    if (!form.nom || !form.prenom || !form.sexe || !form.situationMatrimoniale || !form.activiteAuSeinDP) {
      alert('Veuillez remplir les champs obligatoires (*)')
      return
    }

    // Créer l'objet memberData avec les BONS NOMS (casse sensible)
    const memberData = {
      nom: form.nom,
      prenom: form.prenom,
      sexe: form.sexe,
      dateNaissance: form.dateNaissance || null,
      contact: form.contact || null,
      email: form.email || null,
      adresse: form.adresse || null,
      situationMatrimoniale: form.situationMatrimoniale || null,
      dateEntreeDepartement: form.dateEntreeDepartement || null,
      profession: form.profession || null,
      activiteAuSeinDP: form.activiteAuSeinDP || null,
      photo: null // Pour l'instant, on met null pour la photo
    }

    // Gestion de la photo - À implémenter selon votre backend
    // Option 1: Si vous devez envoyer la photo en même temps, utilisez FormData
    // Option 2: Si la photo est optionnelle, envoyez d'abord les données puis la photo
    if (photoFile.value) {
      // Ici, soit vous utilisez FormData pour tout envoyer ensemble
      // Soit vous uploadez la photo séparément après la création du membre
      console.log('Photo à uploader:', photoFile.value.name)
      
      // Exemple d'upload séparé (à adapter selon votre API)
      // const photoFormData = new FormData()
      // photoFormData.append('photo', photoFile.value)
      // photoFormData.append('membreId', response.id) // Après création du membre
      // await $fetch('/api/upload', { method: 'POST', body: photoFormData })
    }

    console.log('Données envoyées:', memberData)

    const response = await $fetch('/api/membres', { 
      method: 'POST',
      body: memberData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Réponse:', response)
    
    // Si la photo doit être envoyée après la création du membre
    if (photoFile.value && response.id) {
      // Upload de la photo avec l'ID du membre
      const photoFormData = new FormData()
      photoFormData.append('photo', photoFile.value)
      photoFormData.append('membreId', response.id)
      
      await $fetch('/api/membres/photo', { 
        method: 'POST',
        body: photoFormData
      })
      console.log('Photo uploadée avec succès')
    }
    
    resetForm()
    emit('saved')
    
    alert('Membre enregistré avec succès!')
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Une erreur est survenue lors de l\'enregistrement: ' + (error.data?.message || error.message))
  }
}
</script> -->
<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['saved'])

// Références pour les inputs de fichier
const fileInput = ref(null)
const cameraInput = ref(null)

// États pour la photo
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
  dateEntreeDepartement: '',
  profession: '',
  activiteAuSeinDP: '',
  situationMatrimoniale: '',
  photo: null
})

// Fonction pour prendre une photo avec l'appareil photo
const takePhoto = () => {
  cameraInput.value.click()
}

// Fonction pour choisir une photo depuis la galerie
const chooseFromGallery = () => {
  fileInput.value.click()
}

// Fonction pour supprimer la photo
const removePhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  form.photo = null
  // Réinitialiser les inputs de fichier
  if (fileInput.value) fileInput.value.value = ''
  if (cameraInput.value) cameraInput.value.value = ''
}

// Gestionnaire de sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5MB')
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }
    
    photoFile.value = file
    form.photo = file
    
    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const resetForm = () => {
  Object.assign(form, {
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    contact: '',
    email: '',
    adresse: '',
    dateEntreeDepartement: '',
    profession: '',
    activiteAuSeinDP: '',
    situationMatrimoniale: '',
    photo: null
  })
  removePhoto()
}

// Convertir une image en Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const save = async () => {
  try {
    // Validation des champs obligatoires
    if (!form.nom || !form.prenom || !form.sexe || !form.situationMatrimoniale || !form.activiteAuSeinDP) {
      alert('Veuillez remplir tous les champs obligatoires (*)')
      return
    }

    // Créer l'objet memberData avec les BONS NOMS (casse sensible)
    const memberData = {
      nom: form.nom,
      prenom: form.prenom,
      sexe: form.sexe, // L'API mettra en majuscule avec toUpperCase()
      dateNaissance: form.dateNaissance || null,
      contact: form.contact || null,
      email: form.email || null,
      adresse: form.adresse || null,
      situationMatrimoniale: form.situationMatrimoniale,
      dateEntreeDepartement: form.dateEntreeDepartement || null,
      profession: form.profession || null,
      activiteAuSeinDP: form.activiteAuSeinDP
    }

    // Si une photo est sélectionnée, la convertir en Base64 et l'ajouter
    if (photoFile.value) {
      const base64Photo = await fileToBase64(photoFile.value)
      memberData.photo = base64Photo
      console.log('Photo convertie en Base64')
    }

    console.log('Données envoyées:', memberData)

    // Envoyer les données en JSON
    const response = await $fetch('/api/membres', { 
      method: 'POST',
      body: memberData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Membre créé avec succès:', response)
    
    // Réinitialiser le formulaire
    resetForm()
    emit('saved')
    
    alert('Membre enregistré avec succès!')
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    
    // Gestion d'erreur plus détaillée
    let errorMessage = 'Une erreur est survenue lors de l\'enregistrement'
    if (error.data?.message) {
      errorMessage += ': ' + error.data.message
    } else if (error.message) {
      errorMessage += ': ' + error.message
    }
    
    alert(errorMessage)
  }
}
</script>

<style scoped>
/* Animation pour l'aperçu de la photo */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* Animation pour les boutons */
button {
  transition: all 0.3s ease;
}

button:active {
  transform: scale(0.95);
}
</style>