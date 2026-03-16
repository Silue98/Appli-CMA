<template>
  <section class="w-full space-y-5">

    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-800">{{ editItem ? '✏️ Modifier la cellule' : '➕ Nouvelle cellule' }}</h2>
        <button @click="closeForm" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom de la cellule <span class="text-red-500">*</span></label>
          <input v-model="form.nom" placeholder="Ex: Cellule Cocody Nord" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Zone</label>
          <input v-model="form.zone" placeholder="Ex: Zone Nord" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Quartier</label>
          <input v-model="form.quartier" placeholder="Ex: Cocody Angré" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Responsable</label>
          <select v-model="form.responsableId" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm">
            <option value="">— Aucun —</option>
            <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
          </select>
        </div>
      </div>
      <div v-if="formError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ formError }}</div>
      <div class="flex gap-2 mt-5">
        <button @click="save" :disabled="isSaving" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Créer') }}
        </button>
        <button @click="closeForm" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <!-- Formulaire réunion -->
    <div v-if="showReunionForm" class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
      <h3 class="text-base font-bold text-gray-800 mb-4">📅 Enregistrer une réunion — {{ celluleActive?.nom }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Date <span class="text-red-500">*</span></label>
          <input v-model="reunionForm.date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"/>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Lieu</label>
          <input v-model="reunionForm.lieu" placeholder="Chez le responsable, salle..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"/>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Thème / Sujet</label>
          <input v-model="reunionForm.theme" placeholder="Ex: La prière efficace" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"/>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Nombre de présents</label>
          <input v-model="reunionForm.presents" type="number" placeholder="Ex: 12" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"/>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-600 mb-1">Notes</label>
          <textarea v-model="reunionForm.notes" rows="2" placeholder="Compte rendu, prières..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none"></textarea>
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <button @click="saveReunion" :disabled="isSaving" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition disabled:opacity-60">
          💾 Enregistrer
        </button>
        <button @click="showReunionForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">🏘️ Cellules & Zones</h2>
          <p class="text-gray-500 text-sm mt-1">{{ cellules.length }} cellule(s) active(s)</p>
        </div>
        <button @click="ouvrirNouveauForm" class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouvelle cellule
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else-if="cellules.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">🏘️</span>
        <p>Aucune cellule créée</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="c in cellules" :key="c.id" class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-semibold text-gray-800">🏘️ {{ c.nom }}</p>
              <p v-if="c.zone || c.quartier" class="text-xs text-gray-400 mt-0.5">{{ c.zone }}{{ c.zone && c.quartier ? ' · ' : '' }}{{ c.quartier }}</p>
            </div>
            <div class="flex gap-1">
              <button @click="ouvrirEdition(c)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span>👥 {{ c._count?.membres || 0 }} membres</span>
            <span>📅 {{ c._count?.reunions || 0 }} réunions</span>
          </div>
          <p v-if="c.responsable" class="text-xs text-gray-500 mb-3">👤 {{ c.responsable.nom }} {{ c.responsable.prenom }}</p>
          <div class="flex gap-2">
            <button @click="ouvrirReunion(c)" class="flex-1 px-2 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs hover:bg-emerald-100 transition font-medium">
              + Réunion
            </button>
            <button @click="voirMembres(c)" class="flex-1 px-2 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-gray-100 transition font-medium">
              Membres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Détail membres cellule -->
    <div v-if="celluleActive && showMembres" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800">👥 Membres — {{ celluleActive.nom }}</h3>
        <div class="flex gap-2">
          <button @click="showAjoutMembre = !showAjoutMembre" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">+ Ajouter</button>
          <button @click="showMembres = false" class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">Fermer</button>
        </div>
      </div>
      <div v-if="showAjoutMembre" class="mb-4 flex gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <select v-model="membreAjouter" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none">
          <option value="">— Sélectionner un membre —</option>
          <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
        </select>
        <button @click="ajouterMembre" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">Ajouter</button>
      </div>
      <div v-if="membresCellule.length === 0" class="text-center py-6 text-gray-400 text-sm">Aucun membre dans cette cellule</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div v-for="mc in membresCellule" :key="mc.id" class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', mc.membre?.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
            {{ mc.membre?.prenom?.charAt(0) }}{{ mc.membre?.nom?.charAt(0) }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ mc.membre?.nom }} {{ mc.membre?.prenom }}</p>
            <p v-if="mc.membre?.contact" class="text-xs text-gray-400">{{ mc.membre?.contact }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const cellules = ref([])
const membres = ref([])
const membresCellule = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const formError = ref('')
const showReunionForm = ref(false)
const showMembres = ref(false)
const showAjoutMembre = ref(false)
const celluleActive = ref(null)
const membreAjouter = ref('')

const form = reactive({ nom: '', zone: '', quartier: '', responsableId: '' })
const reunionForm = reactive({ date: '', lieu: '', theme: '', presents: '', notes: '' })

const charger = async () => {
  isLoading.value = true
  try {
    const [c, m] = await Promise.all([$fetch('/api/cellules'), $fetch('/api/membres')])
    cellules.value = c || []; membres.value = m || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)

const reset = () => Object.assign(form, { nom: '', zone: '', quartier: '', responsableId: '' })
const ouvrirNouveauForm = () => { reset(); editItem.value = null; showForm.value = true }
const ouvrirEdition = (c) => { editItem.value = c; Object.assign(form, { nom: c.nom, zone: c.zone || '', quartier: c.quartier || '', responsableId: c.responsableId || '' }); showForm.value = true }
const closeForm = () => { showForm.value = false; editItem.value = null; formError.value = '' }

const save = async () => {
  formError.value = ''
  if (!form.nom) { formError.value = 'Nom requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) await $fetch(`/api/cellules/${editItem.value.id}`, { method: 'PUT', body: form })
    else await $fetch('/api/cellules', { method: 'POST', body: form })
    closeForm(); charger()
  } catch (e) { formError.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const ouvrirReunion = (c) => {
  celluleActive.value = c
  Object.assign(reunionForm, { date: new Date().toISOString().split('T')[0], lieu: '', theme: '', presents: '', notes: '' })
  showReunionForm.value = true
  showMembres.value = false
}

const saveReunion = async () => {
  if (!reunionForm.date) return
  isSaving.value = true
  try {
    await $fetch('/api/cellules/reunions', { method: 'POST', body: { ...reunionForm, celluleId: celluleActive.value.id } })
    showReunionForm.value = false; charger()
  } catch (e) { alert('Erreur') }
  finally { isSaving.value = false }
}

const voirMembres = async (c) => {
  celluleActive.value = c
  showMembres.value = true
  showReunionForm.value = false
  try { membresCellule.value = await $fetch(`/api/departements/${c.id}/membres`) || [] }
  catch { membresCellule.value = [] }
}

const ajouterMembre = async () => {
  if (!membreAjouter.value) return
  try {
    await $fetch('/api/cellules/membres', { method: 'POST', body: { membreId: membreAjouter.value, celluleId: celluleActive.value.id } })
    membreAjouter.value = ''; showAjoutMembre.value = false
    voirMembres(celluleActive.value); charger()
  } catch (e) { alert(e.data?.message || 'Erreur') }
}
</script>
