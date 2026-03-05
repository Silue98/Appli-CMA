<template>
  <form
    @submit.prevent="save"
    class="bg-white p-6 shadow-lg rounded-2xl mb-6 space-y-6 border border-gray-200"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Nouveau Membre</h2>
    <p class="text-gray-600 mb-6">Remplissez les informations du membre</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Informations personnelles -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informations personnelles</h3>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nom <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.nom" 
          placeholder="Nom du membre" 
          required
          class="input-field"
        />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Prénom <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.prenom" 
          placeholder="Prénom du membre" 
          required
          class="input-field"
        />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Sexe <span class="text-red-500">*</span>
        </label>
        <select v-model="form.sexe" required class="input-field">
          <option value="" disabled>Sélectionnez le sexe</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-6">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Date de naissance
        </label>
        <input 
          v-model="form.dateNaissance" 
          type="date" 
          class="input-field"
        />
      </div>
      
<div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Situation Matrimoniale <span class="text-red-500">*</span>
        </label>
        <select v-model="form.SituationMatriMoniale" required class="input-field">
          <option value="" disabled>Sélectionnez votre situaaation Matrimoniale</option>
          <option value="Marié(e)">Marié(e)</option>
          <option value="Célibataire">Célibataire</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-6">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <!-- Informations de contact -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3 mt-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informations de contact</h3>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Contact téléphonique
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <span class="text-gray-500">+225</span>
          </div>
          <input 
            v-model="form.contact" 
            placeholder="Ex: 07 00 00 00 00" 
            type="tel"
            class="input-field pl-16"
          />
        </div>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input 
            v-model="form.email" 
            placeholder="email@exemple.com" 
            type="email"
            class="input-field pl-10"
          />
        </div>
      </div>

      <div class="relative md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Adresse
        </label>
        <input 
          v-model="form.adresse" 
          placeholder="Adresse complète" 
          class="input-field"
        />
      </div>

      <!-- Informations professionnelles et activité -->
      <div class="space-y-4 md:col-span-2 lg:col-span-3 mt-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informations professionnelles et activité</h3>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Profession
        </label>
        <input 
          v-model="form.profession" 
          placeholder="Ex: Enseignant, Infirmier..." 
          class="input-field"
        />
      </div>

      <div class="relative md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Activité au sein du département de culte
        </label>
        <input 
          v-model="form.activiteAuSeinDP" 
          placeholder="Ex: Choriste, Trésorier..." 
          class="input-field"
        />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Date d'entrée au département de culte
        </label>
        <input 
          v-model="form.DateEntreAuDepartementCulte" 
          type="date" 
          class="input-field"
        />
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
      <button
        type="submit"
        class="flex-1 px-6  bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Enregistrer le membre
      </button>
      
      <button
        type="button"
        @click="resetForm"
        class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 border  flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup>
const emit = defineEmits(['saved'])

const form = reactive({
  nom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  contact: '',
  email: '',
  adresse: '',
  DateEntreAuDepartementCulte: '',
  profession: '',
  activiteAuSeinDP: '',
  SituationMatriMoniale:''
})

const resetForm = () => {
  Object.assign(form, {
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    contact: '',
    email: '',
    adresse: '',
    DateEntreAuDepartementCulte: '',
    profession: '',
    activiteAuSeinDP: '',
    SituationMatriMoniale:''
  })
}

const save = async () => {
  try {
    // Validation simple
    if (!form.nom || !form.prenom || !form.sexe) {
      alert('Veuillez remplir les champs obligatoires (*)')
      return
    }

    // Formatage de la date si nécessaire
    const payload = {
      ...form,
      dateNaissance: form.dateNaissance || null,
      DateEntreAuDepartementCulte: form.DateEntreAuDepartementCulte || null
    }

    await $fetch('/api/membres', { 
      method: 'POST', 
      body: payload 
    })
    
    resetForm()
    emit('saved')
    
    // Feedback visuel (vous pouvez utiliser une librairie de notifications)
    console.log('Membre enregistré avec succès!')
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Une erreur est survenue lors de l\'enregistrement')
  }
}
</script>

<!-- <style scoped>
.input-field {
  @apply w-full  border  focus:ring-2  focus:border-transparent transition-all duration-200;
  /* @apply placeholder-gray-400 text-gray-700 bg-white; */
  /* @apply disabled:bg-gray-100 disabled:cursor-not-allowed; */
  /* @apply hover:border-green-400; */
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

select.input-field {
  @apply appearance-none pr-10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    gap: 1rem;
  }
  
  .input-field {
    @apply py-2.5;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  form {
    @apply bg-gray-800 border-gray-700;
  }
  
  h2, h3 {
    @apply text-gray-100;
  }
  
  p {
    @apply text-gray-300;
  }
  
  label {
    @apply text-gray-300;
  }
  
  .input-field {
    @apply bg-gray-700 border-gray-600 text-gray-100;
    @apply placeholder-gray-500;
  }
  
  .input-field:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }
}
</style> -->