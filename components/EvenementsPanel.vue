<template>
  <section class="w-full space-y-5">

    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-800">{{ editItem ? '✏️ Modifier l\'événement' : '➕ Nouvel événement' }}</h2>
        <button @click="closeForm" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Titre <span class="text-red-500">*</span></label>
          <input v-model="form.titre" placeholder="Ex: Retraite de prière 2026" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Type <span class="text-red-500">*</span></label>
          <select v-model="form.type" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm">
            <option value="RETRAITE">🏕️ Retraite</option>
            <option value="CONFERENCE">🎤 Conférence</option>
            <option value="CAMP">⛺ Camp</option>
            <option value="EVANGELISATION">📢 Évangélisation</option>
            <option value="MARIAGE">💍 Mariage</option>
            <option value="BAPTEME">💧 Baptême</option>
            <option value="FUNERAILLES">🕊️ Funérailles</option>
            <option value="DEDICACE">🍼 Dédicace</option>
            <option value="ANNIVERSAIRE">🎂 Anniversaire</option>
            <option value="AUTRE">📌 Autre</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select v-model="form.statut" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm">
            <option value="PLANIFIE">📋 Planifié</option>
            <option value="EN_COURS">▶️ En cours</option>
            <option value="TERMINE">✅ Terminé</option>
            <option value="ANNULE">❌ Annulé</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date de début <span class="text-red-500">*</span></label>
          <input v-model="form.dateDebut" type="datetime-local" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date de fin</label>
          <input v-model="form.dateFin" type="datetime-local" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Lieu</label>
          <input v-model="form.lieu" placeholder="Ex: Salle principale, Bouaké..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Responsable</label>
          <input v-model="form.responsable" placeholder="Nom du responsable" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Département organisateur</label>
          <select v-model="form.departementId" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm">
            <option value="">— Aucun —</option>
            <option v-for="d in departements" :key="d.id" :value="d.id">{{ d.icone }} {{ d.nom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Capacité max</label>
          <input v-model="form.capaciteMax" type="number" placeholder="Ex: 100" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Budget prévu (FCFA)</label>
          <input v-model="form.budget" type="number" placeholder="Ex: 500000" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm"/>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea v-model="form.description" rows="3" placeholder="Détails de l'événement..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-sm resize-none"></textarea>
        </div>
      </div>
      <div v-if="formError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ formError }}</div>
      <div class="flex gap-2 mt-5">
        <button @click="save" :disabled="isSaving" class="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Créer l\'événement') }}
        </button>
        <button @click="closeForm" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">🎉 Événements</h2>
          <p class="text-gray-500 text-sm mt-1">Calendrier et gestion des événements</p>
        </div>
        <button @click="ouvrirNouveauForm" class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouvel événement
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-2 mb-5">
        <button v-for="f in filtresType" :key="f.val" @click="filtreActif = f.val"
          :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition border', filtreActif === f.val ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']">
          {{ f.label }}
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>

      <div v-else-if="evenementsFiltres.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">🎉</span>
        <p>Aucun événement</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="e in evenementsFiltres" :key="e.id"
          class="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="text-base">{{ typeIcon(e.type) }}</span>
                <h3 class="font-semibold text-gray-800">{{ e.titre }}</h3>
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', statutBadge(e.statut)]">{{ statutLabel(e.statut) }}</span>
              </div>
              <div class="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                <span>📅 {{ formatDate(e.dateDebut) }}{{ e.dateFin ? ' → ' + formatDate(e.dateFin) : '' }}</span>
                <span v-if="e.lieu">📍 {{ e.lieu }}</span>
                <span v-if="e.responsable">👤 {{ e.responsable }}</span>
                <span v-if="e.departement">{{ e.departement.icone }} {{ e.departement.nom }}</span>
                <span v-if="e._count?.inscriptions">🎟️ {{ e._count.inscriptions }} inscrit(s)</span>
                <span v-if="e.budget">💰 {{ formatMontant(e.budget) }}</span>
              </div>
              <p v-if="e.description" class="text-xs text-gray-400 mt-1 line-clamp-2">{{ e.description }}</p>
            </div>
            <div class="flex gap-1">
              <button @click="notifierMembres(e)" :disabled="notifying === e.id" title="Notifier les membres" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition disabled:opacity-50">
                <span v-if="notifying === e.id">⏳</span>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </button>
              <button @click="ouvrirEdition(e)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button @click="supprimer(e)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const evenements = ref([])
const departements = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const formError = ref('')
const filtreActif = ref('')

const form = reactive({ titre: '', type: 'AUTRE', statut: 'PLANIFIE', dateDebut: '', dateFin: '', lieu: '', responsable: '', departementId: '', capaciteMax: '', budget: '', description: '' })

const filtresType = [
  { val: '', label: '🗓️ Tous' }, { val: 'RETRAITE', label: '🏕️ Retraites' },
  { val: 'CONFERENCE', label: '🎤 Conférences' }, { val: 'EVANGELISATION', label: '📢 Évangélisation' },
  { val: 'MARIAGE', label: '💍 Mariages' }, { val: 'BAPTEME', label: '💧 Baptêmes' },
  { val: 'CAMP', label: '⛺ Camps' }
]

const evenementsFiltres = computed(() => filtreActif.value ? evenements.value.filter(e => e.type === filtreActif.value) : evenements.value)

const charger = async () => {
  isLoading.value = true
  try {
    const [ev, dep] = await Promise.all([$fetch('/api/evenements'), $fetch('/api/departements')])
    evenements.value = ev || []; departements.value = dep || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)

const reset = () => Object.assign(form, { titre: '', type: 'AUTRE', statut: 'PLANIFIE', dateDebut: '', dateFin: '', lieu: '', responsable: '', departementId: '', capaciteMax: '', budget: '', description: '' })
const ouvrirNouveauForm = () => { reset(); editItem.value = null; showForm.value = true }
const ouvrirEdition = (e) => {
  editItem.value = e
  Object.assign(form, { titre: e.titre, type: e.type, statut: e.statut, dateDebut: e.dateDebut?.slice(0,16) || '', dateFin: e.dateFin?.slice(0,16) || '', lieu: e.lieu || '', responsable: e.responsable || '', departementId: e.departementId || '', capaciteMax: e.capaciteMax || '', budget: e.budget || '', description: e.description || '' })
  showForm.value = true
}
const closeForm = () => { showForm.value = false; editItem.value = null; formError.value = '' }

const save = async () => {
  formError.value = ''
  if (!form.titre || !form.dateDebut) { formError.value = 'Titre et date requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) await $fetch(`/api/evenements/${editItem.value.id}`, { method: 'PUT', body: form })
    else await $fetch('/api/evenements', { method: 'POST', body: form })
    closeForm(); charger()
  } catch (e) { formError.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const notifying = ref(null)
const notifierMembres = async (e) => {
  if (!confirm(`Envoyer une notification à tous les membres pour "${e.titre}" ?`)) return
  notifying.value = e.id
  try {
    const result = await $fetch('/api/emails/notify-event', {
      method: 'POST',
      body: { evenementId: e.id }
    })
    if (result.success) {
      alert(`✅ Notification envoyée à ${result.envoyes} membre(s) !`)
    } else {
      alert(`ℹ️ ${result.message}`)
    }
  } catch (err) {
    alert(`❌ Erreur : ${err.data?.message || err.message}`)
  } finally {
    notifying.value = null
  }
}

const supprimer = async (e) => {
  if (!confirm(`Supprimer "${e.titre}" ?`)) return
  try { await $fetch(`/api/evenements/${e.id}`, { method: 'DELETE' }); charger() }
  catch (err) { alert(err.data?.message || 'Erreur') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const formatMontant = (v) => v ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA' : '—'
const typeIcon = (t) => ({ RETRAITE:'🏕️', CONFERENCE:'🎤', CAMP:'⛺', EVANGELISATION:'📢', MARIAGE:'💍', BAPTEME:'💧', FUNERAILLES:'🕊️', DEDICACE:'🍼', ANNIVERSAIRE:'🎂', AUTRE:'📌' }[t] || '📌')
const statutLabel = (s) => ({ PLANIFIE:'Planifié', EN_COURS:'En cours', TERMINE:'Terminé', ANNULE:'Annulé' }[s] || s)
const statutBadge = (s) => ({ PLANIFIE:'bg-blue-100 text-blue-700', EN_COURS:'bg-yellow-100 text-yellow-700', TERMINE:'bg-green-100 text-green-700', ANNULE:'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700')
</script>
