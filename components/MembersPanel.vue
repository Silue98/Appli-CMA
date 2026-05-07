<template>
  <section class="w-full">

    <!-- ===== VUE FORMULAIRE ===== -->
    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ isEdit ? '✏️ Modifier le membre' : '➕ Nouveau membre' }}</h2>
          <p class="text-gray-500 text-sm mt-1">Remplissez les informations ci-dessous</p>
        </div>
        <button @click="fermerFormulaire" class="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Photo -->
      <div class="flex justify-center mb-6">
        <div class="text-center">
          <div class="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mx-auto mb-2">
            <img v-if="photoPreview" :src="photoPreview" class="w-full h-full object-cover"/>
            <svg v-else class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="flex gap-2 justify-center">
            <label class="cursor-pointer px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs hover:bg-green-100">
              📷 Photo
              <input type="file" accept="image/*" class="hidden" @change="handlePhoto"/>
            </label>
            <button v-if="photoPreview" @click="supprimerPhoto" type="button"
              class="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs hover:bg-red-100">
              🗑️ Retirer
            </button>
          </div>
        </div>
      </div>

      <!-- Champs formulaire -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom <span class="text-red-500">*</span></label>
          <input v-model="form.nom" placeholder="Ex: KONAN"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Prénom <span class="text-red-500">*</span></label>
          <input v-model="form.prenom" placeholder="Ex: Aimé Fabrice"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Sexe <span class="text-red-500">*</span></label>
          <select v-model="form.sexe"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">— Choisir —</option>
            <option value="HOMME">Homme</option>
            <option value="FEMME">Femme</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date de naissance</label>
          <input v-model="form.dateNaissance" type="date"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Situation matrimoniale</label>
          <select v-model="form.situationMatrimoniale"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">— Optionnel —</option>
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Veuf(ve)">Veuf(ve)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Contact</label>
          <input v-model="form.contact" placeholder="07 00 00 00 00"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input v-model="form.email" type="email" placeholder="email@exemple.com"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
          <input v-model="form.adresse" placeholder="Quartier, commune..."
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Profession</label>
          <input v-model="form.profession" placeholder="Ex: Enseignant, Médecin..."
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Groupe / Activité au sein du DP</label>
          <select v-model="form.activiteAuSeinDP"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">— Choisir —</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date d'entrée à l'église</label>
          <input v-model="form.dateEntreeAleglise" type="date"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date de baptême</label>
          <input v-model="form.dateBaptemes" type="date"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date d'entrée au département</label>
          <input v-model="form.dateEntreeDepartement" type="date"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="formError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        ❌ {{ formError }}
      </div>

      <!-- Boutons actions -->
      <div class="flex gap-3 mt-6 pt-5 border-t border-gray-100">
        <button @click="sauvegarderMembre" :disabled="isSaving"
          class="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isSaving ? 'Enregistrement...' : (isEdit ? '✏️ Mettre à jour' : '💾 Enregistrer') }}
        </button>
        <button @click="fermerFormulaire" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-medium">
          Annuler
        </button>
      </div>
    </div>

    <!-- ===== VUE LISTE ===== -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <!-- En-tête liste -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">👥 Membres</h2>
          <p class="text-gray-500 text-sm mt-1">Gestion des membres du département de culte</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="exportToPDF" :disabled="isExporting"
            class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm border border-red-200 disabled:opacity-50">
            📄 PDF
          </button>
          <button @click="exportToCSV"
            class="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm border border-green-200">
            📊 CSV
          </button>
          <button @click="ouvrirNouveauForm"
            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            ➕ Nouveau
          </button>
        </div>
      </div>

      <!-- Filtres et stats -->
      <div class="bg-gray-50 p-4 rounded-xl mb-5 border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="relative">
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="search" placeholder="Rechercher..." class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm"/>
          </div>
          <select v-model="sexeFilter" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">👤 Tous les sexes</option>
            <option value="HOMME">👨 Hommes</option>
            <option value="FEMME">👩 Femmes</option>
          </select>
          <select v-model="groupeFilter" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">🎯 Tous les groupes</option>
            <option value="Département Culte">Département Culte</option>
            <option value="Affermissement">Affermissement</option>
            <option value="Bergers">Bergers</option>
            <option value="Elizer">Elizer</option>
            <option value="Ebenezer">Ebenezer</option>
            <option value="Yaweh Sabaoth">Yaweh Sabaoth</option>
            <option value="Sie Sie Wor WU">Sie Sie Wor WU</option>
            <option value="OPH">OPH</option>
          </select>
          <select v-model="sortField" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm">
            <option value="">📊 Trier par...</option>
            <option value="nom">Nom (A-Z)</option>
            <option value="prenom">Prénom (A-Z)</option>
            <option value="dateInscription">Date d'inscription</option>
          </select>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <p class="text-xs text-gray-500">Total</p>
            <p class="text-xl font-bold text-gray-800">{{ filteredMembres.length }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-blue-100">
            <p class="text-xs text-gray-500">Hommes</p>
            <p class="text-xl font-bold text-blue-600">{{ filteredMembres.filter(m => m.sexe === 'HOMME').length }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-pink-100">
            <p class="text-xs text-gray-500">Femmes</p>
            <p class="text-xl font-bold text-pink-600">{{ filteredMembres.filter(m => m.sexe === 'FEMME').length }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-green-100">
            <p class="text-xs text-gray-500">Nouveaux (30j)</p>
            <p class="text-xl font-bold text-green-600">{{ nouveauxMembres }}</p>
          </div>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>

      <!-- Aucun membre -->
      <div v-else-if="filteredMembres.length === 0" class="text-center py-12">
        <svg class="mx-auto w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p class="text-gray-500 mb-4">{{ search || sexeFilter || groupeFilter ? 'Aucun membre trouvé' : 'Aucun membre enregistré' }}</p>
        <button v-if="!search && !sexeFilter && !groupeFilter" @click="ouvrirNouveauForm"
          class="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
          ➕ Ajouter le premier membre
        </button>
      </div>

      <!-- Tableau des membres -->
      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Membre</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Groupe</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Inscrit le</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">📧 Emails</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="m in paginatedMembres" :key="m.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0">
                    <img v-if="m.photo" :src="m.photo" class="w-9 h-9 rounded-full object-cover border border-gray-200"/>
                    <div v-else :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold', m.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                      {{ m.prenom?.charAt(0) }}{{ m.nom?.charAt(0) }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ m.nom }} {{ m.prenom }}</p>
                    <p class="text-xs text-gray-400">{{ m.sexe === 'HOMME' ? '👨 Homme' : '👩 Femme' }}{{ m.profession ? ' · ' + m.profession : '' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden md:table-cell">{{ m.contact || '—' }}</td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <span v-if="m.activiteAuSeinDP" class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{{ m.activiteAuSeinDP }}</span>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{{ formatDate(m.dateInscription) }}</td>
              <td class="px-4 py-3 hidden md:table-cell text-center">
                <button @click="toggleEmail(m)" :title="m.recevoirEmails ? 'Désactiver emails' : 'Activer emails'"
                  :class="['relative inline-flex h-5 w-9 items-center rounded-full transition-colors', m.recevoirEmails ? 'bg-green-500' : 'bg-gray-300']">
                  <span :class="['inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform', m.recevoirEmails ? 'translate-x-4' : 'translate-x-1']"/>
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button @click="ouvrirEdition(m)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Modifier">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="supprimerMembre(m)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <p class="text-sm text-gray-500">{{ filteredMembres.length }} membre(s)</p>
        <div class="flex items-center gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">← Précédent</button>
          <span class="text-sm text-gray-600 px-2">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">Suivant →</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const membres = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const isExporting = ref(false)
const showForm = ref(false)
const membreEnEdition = ref(null)
const formError = ref('')
const photoPreview = ref('')
const photoFile = ref(null)
const search = ref('')
const sexeFilter = ref('')
const groupeFilter = ref('')
const sortField = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

const form = reactive({
  nom: '', prenom: '', sexe: '',
  dateNaissance: '', situationMatrimoniale: '',
  contact: '', email: '', adresse: '',
  profession: '', activiteAuSeinDP: '',
  dateEntreeAleglise: '', dateBaptemes: '', dateEntreeDepartement: ''
})

const isEdit = computed(() => !!membreEnEdition.value)

const filteredMembres = computed(() => {
  let list = [...membres.value]
  if (search.value) {
    const t = search.value.toLowerCase()
    list = list.filter(m =>
      m.nom?.toLowerCase().includes(t) ||
      m.prenom?.toLowerCase().includes(t) ||
      m.contact?.includes(t)
    )
  }
  if (sexeFilter.value) list = list.filter(m => m.sexe === sexeFilter.value)
  if (groupeFilter.value) list = list.filter(m => m.activiteAuSeinDP === groupeFilter.value)
  if (sortField.value === 'nom') list.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''))
  else if (sortField.value === 'prenom') list.sort((a, b) => (a.prenom || '').localeCompare(b.prenom || ''))
  else if (sortField.value === 'dateInscription') list.sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription))
  return list
})

const nouveauxMembres = computed(() => {
  const limite = new Date(Date.now() - 30 * 86400000)
  return membres.value.filter(m => new Date(m.dateInscription) >= limite).length
})

const totalPages = computed(() => Math.ceil(filteredMembres.value.length / itemsPerPage) || 1)
const paginatedMembres = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage
  return filteredMembres.value.slice(s, s + itemsPerPage)
})

const chargerMembres = async () => {
  isLoading.value = true
  try { membres.value = await $fetch('/api/membres') || [] }
  catch (e) { console.error('Erreur chargement membres:', e) }
  finally { isLoading.value = false }
}

onMounted(chargerMembres)

const resetForm = () => {
  Object.assign(form, {
    nom: '', prenom: '', sexe: '', dateNaissance: '', situationMatrimoniale: '',
    contact: '', email: '', adresse: '', profession: '', activiteAuSeinDP: '',
    dateEntreeAleglise: '', dateBaptemes: '', dateEntreeDepartement: ''
  })
  photoPreview.value = ''
  photoFile.value = null
  formError.value = ''
  membreEnEdition.value = null
}

const ouvrirNouveauForm = () => {
  resetForm()
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const ouvrirEdition = (m) => {
  membreEnEdition.value = m
  Object.assign(form, {
    nom: m.nom || '',
    prenom: m.prenom || '',
    sexe: m.sexe || '',
    dateNaissance: m.dateNaissance ? new Date(m.dateNaissance).toISOString().split('T')[0] : '',
    situationMatrimoniale: m.situationMatrimoniale || '',
    contact: m.contact || '',
    email: m.email || '',
    adresse: m.adresse || '',
    profession: m.profession || '',
    activiteAuSeinDP: m.activiteAuSeinDP || '',
    dateEntreeAleglise: m.dateEntreeAleglise ? new Date(m.dateEntreeAleglise).toISOString().split('T')[0] : '',
    dateBaptemes: m.dateBaptemes ? new Date(m.dateBaptemes).toISOString().split('T')[0] : '',
    dateEntreeDepartement: m.dateEntreeDepartement ? new Date(m.dateEntreeDepartement).toISOString().split('T')[0] : ''
  })
  photoPreview.value = m.photo || ''
  photoFile.value = null
  formError.value = ''
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fermerFormulaire = () => {
  showForm.value = false
  resetForm()
}

const handlePhoto = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { formError.value = 'La photo ne doit pas dépasser 5 Mo'; return }
  photoFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { photoPreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

const supprimerPhoto = () => { photoPreview.value = ''; photoFile.value = null }

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const r = new FileReader()
  r.onload = () => resolve(r.result)
  r.onerror = reject
  r.readAsDataURL(file)
})

const sauvegarderMembre = async () => {
  formError.value = ''
  if (!form.nom.trim() || !form.prenom.trim() || !form.sexe) {
    formError.value = 'Nom, prénom et sexe sont obligatoires'
    return
  }
  isSaving.value = true
  try {
    const payload = { ...form }
    if (photoFile.value) {
      payload.photo = await fileToBase64(photoFile.value)
    } else if (photoPreview.value?.startsWith('/media')) {
      payload.photo = photoPreview.value
    } else {
      payload.photo = null
    }
    if (isEdit.value) {
      await $fetch(`/api/membres/${membreEnEdition.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/membres', { method: 'POST', body: payload })
    }
    fermerFormulaire()
    chargerMembres()
  } catch (err) {
    formError.value = err.data?.message || err.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}

const toggleEmail = async (m) => {
  try {
    const result = await $fetch('/api/membres/toggle-email', {
      method: 'POST',
      body: { id: m.id }
    })
    m.recevoirEmails = result.recevoirEmails
  } catch (e) {
    console.error('Erreur toggle email:', e)
  }
}

const supprimerMembre = async (m) => {
  if (!confirm(`Supprimer ${m.nom} ${m.prenom} ?\nCette action est irréversible.`)) return
  try {
    await $fetch(`/api/membres/${m.id}`, { method: 'DELETE' })
    chargerMembres()
  } catch (e) {
    alert(e.data?.message || 'Erreur lors de la suppression')
  }
}

const exportToPDF = async () => {
  isExporting.value = true
  try {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('CMA DOKUI1 — Liste des Membres', 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(120)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} — ${filteredMembres.value.length} membres`, 14, 30)
    autoTable(doc, {
      head: [['Nom & Prénom', 'Sexe', 'Contact', 'Profession', 'Groupe', 'Inscrit le']],
      body: filteredMembres.value.map(m => [
        `${m.nom} ${m.prenom}`,
        m.sexe === 'HOMME' ? 'Homme' : 'Femme',
        m.contact || '—',
        m.profession || '—',
        m.activiteAuSeinDP || '—',
        formatDate(m.dateInscription)
      ]),
      startY: 36,
      headStyles: { fillColor: [22, 163, 74] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 9 }
    })
    doc.save(`membres_${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (e) {
    alert('Erreur PDF: ' + e.message)
  } finally {
    isExporting.value = false
  }
}

const exportToCSV = () => {
  const headers = ['Nom', 'Prénom', 'Sexe', 'Contact', 'Email', 'Adresse', 'Profession', 'Groupe', 'Situation', 'Date inscription']
  const rows = filteredMembres.value.map(m => [
    m.nom, m.prenom, m.sexe === 'HOMME' ? 'Homme' : 'Femme',
    m.contact, m.email, m.adresse, m.profession,
    m.activiteAuSeinDP, m.situationMatrimoniale,
    formatDate(m.dateInscription)
  ].map(v => `"${v || ''}"`))
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `membres_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'
</script>
