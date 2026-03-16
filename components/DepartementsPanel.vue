<template>
  <section class="w-full space-y-5">

    <!-- VUE FORMULAIRE -->
    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-800">{{ editItem ? '✏️ Modifier' : '➕ Nouveau département' }}</h2>
        <button @click="closeForm" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom <span class="text-red-500">*</span></label>
          <input v-model="form.nom" placeholder="Ex: Jeunesse" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Icône (emoji)</label>
          <input v-model="form.icone" placeholder="Ex: 🌟" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Couleur</label>
          <div class="flex gap-2">
            <input v-model="form.couleur" type="color" class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"/>
            <input v-model="form.couleur" placeholder="#16a34a" class="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"/>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select v-model="form.actif" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm">
            <option :value="true">✅ Actif</option>
            <option :value="false">⏸️ Inactif</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea v-model="form.description" rows="2" placeholder="Description du département..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm resize-none"></textarea>
        </div>
      </div>
      <div v-if="formError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ formError }}</div>
      <div class="flex gap-2 mt-5">
        <button @click="save" :disabled="isSaving" class="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Créer') }}
        </button>
        <button @click="closeForm" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <!-- VUE LISTE -->
    <div v-else>
      <!-- En-tête -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-800">🏛️ Départements & Ministères</h2>
            <p class="text-gray-500 text-sm mt-1">{{ departements.length }} département(s) actif(s)</p>
          </div>
          <button @click="ouvrirNouveauForm" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nouveau département
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Grille départements -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="d in departements" :key="d.id"
            class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
            @click="selectDepartement(d)"
            :style="{ borderLeftColor: d.couleur || '#6b7280', borderLeftWidth: '4px' }">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ d.icone || '🏛️' }}</span>
                <div>
                  <p class="font-semibold text-gray-800">{{ d.nom }}</p>
                  <p class="text-xs text-gray-400">{{ d._count?.membres || 0 }} membre(s)</p>
                </div>
              </div>
              <div class="flex gap-1">
                <button @click.stop="ouvrirEdition(d)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </div>
            </div>
            <p v-if="d.description" class="text-xs text-gray-500 line-clamp-2">{{ d.description }}</p>
            <span :class="['text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block', d.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ d.actif ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Détail département sélectionné -->
      <div v-if="departementSelectionne" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ departementSelectionne.icone || '🏛️' }}</span>
            <div>
              <h3 class="text-lg font-bold text-gray-800">{{ departementSelectionne.nom }}</h3>
              <p class="text-sm text-gray-500">{{ membresDepPanel.length }} membre(s)</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showAjoutMembre = !showAjoutMembre" class="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
              ➕ Ajouter un membre
            </button>
            <button @click="departementSelectionne = null" class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">Fermer</button>
          </div>
        </div>

        <!-- Formulaire ajout membre au département -->
        <div v-if="showAjoutMembre" class="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl">
          <div class="flex gap-3">
            <select v-model="membreAjouter" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">— Sélectionner un membre —</option>
              <option v-for="m in tousLesMembres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
            <input v-model="roleAjouter" placeholder="Rôle (ex: Responsable)" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none"/>
            <button @click="ajouterMembre" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">Ajouter</button>
          </div>
        </div>

        <!-- Liste membres du département -->
        <div v-if="isLoadingMembres" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div v-else-if="membresDepPanel.length === 0" class="text-center py-8 text-gray-400">
          <p>Aucun membre dans ce département</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="md in membresDepPanel" :key="md.id" class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', md.membre?.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
              {{ md.membre?.prenom?.charAt(0) }}{{ md.membre?.nom?.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ md.membre?.nom }} {{ md.membre?.prenom }}</p>
              <p v-if="md.role" class="text-xs text-gray-400">{{ md.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const departements = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const formError = ref('')
const departementSelectionne = ref(null)
const membresDepPanel = ref([])
const isLoadingMembres = ref(false)
const showAjoutMembre = ref(false)
const membreAjouter = ref('')
const roleAjouter = ref('')
const tousLesMembres = ref([])

const form = reactive({ nom: '', description: '', couleur: '#3b82f6', icone: '', actif: true })

const charger = async () => {
  isLoading.value = true
  try {
    const [deps, membres] = await Promise.all([$fetch('/api/departements'), $fetch('/api/membres')])
    departements.value = deps || []
    tousLesMembres.value = membres || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)

const reset = () => Object.assign(form, { nom: '', description: '', couleur: '#3b82f6', icone: '', actif: true })
const ouvrirNouveauForm = () => { reset(); editItem.value = null; showForm.value = true }
const ouvrirEdition = (d) => { editItem.value = d; Object.assign(form, { nom: d.nom, description: d.description || '', couleur: d.couleur || '#3b82f6', icone: d.icone || '', actif: d.actif }); showForm.value = true }
const closeForm = () => { showForm.value = false; editItem.value = null; formError.value = '' }

const save = async () => {
  formError.value = ''
  if (!form.nom) { formError.value = 'Le nom est requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) await $fetch(`/api/departements/${editItem.value.id}`, { method: 'PUT', body: form })
    else await $fetch('/api/departements', { method: 'POST', body: form })
    closeForm(); charger()
  } catch (e) { formError.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const selectDepartement = async (d) => {
  departementSelectionne.value = d
  isLoadingMembres.value = true
  try { membresDepPanel.value = await $fetch(`/api/departements/${d.id}/membres`) || [] }
  catch (e) { console.error(e) }
  finally { isLoadingMembres.value = false }
}

const ajouterMembre = async () => {
  if (!membreAjouter.value) return
  try {
    await $fetch('/api/departements/membres', { method: 'POST', body: { membreId: membreAjouter.value, departementId: departementSelectionne.value.id, role: roleAjouter.value || null } })
    membreAjouter.value = ''; roleAjouter.value = ''; showAjoutMembre.value = false
    selectDepartement(departementSelectionne.value); charger()
  } catch (e) { alert(e.data?.message || 'Erreur') }
}
</script>
