<template>
  <section class="w-full space-y-5">

    <!-- Onglets -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
      <button v-for="t in onglets" :key="t.val" @click="ongletActif = t.val"
        :class="['flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition', ongletActif === t.val ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50']">
        {{ t.icon }} {{ t.label }}
      </button>
    </div>

    <!-- ═══ VISITES PASTORALES ═══ -->
    <div v-if="ongletActif === 'visites'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">🏠 Visites Pastorales</h2>
          <p class="text-gray-500 text-sm mt-1">Suivi des visites, counseling et accompagnement</p>
        </div>
        <button @click="showVisiteForm = !showVisiteForm" class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-semibold">
          ➕ Nouvelle visite
        </button>
      </div>

      <div v-if="showVisiteForm" class="mb-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Membre <span class="text-red-500">*</span></label>
            <select v-model="visiteForm.membreId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="">— Choisir —</option>
              <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select v-model="visiteForm.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="VISITE">🏠 Visite à domicile</option>
              <option value="COUNSELING">💬 Counseling</option>
              <option value="PRIERE">🙏 Séance de prière</option>
              <option value="TELEPHONE">📞 Appel téléphonique</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Pasteur / Responsable <span class="text-red-500">*</span></label>
            <input v-model="visiteForm.pasteur" placeholder="Nom du pasteur" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Date <span class="text-red-500">*</span></label>
            <input v-model="visiteForm.date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Motif</label>
            <input v-model="visiteForm.motif" placeholder="Motif de la visite" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="visiteForm.confidentiel" class="w-4 h-4 rounded"/>
              <span class="text-sm text-gray-600">🔒 Confidentiel</span>
            </label>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea v-model="visiteForm.notes" rows="2" placeholder="Compte rendu de la visite..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Points de suivi</label>
            <textarea v-model="visiteForm.suivi" rows="2" placeholder="Actions à faire, prochaine visite..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="saveVisite" :disabled="isSaving" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60">{{ isSaving ? '...' : '💾 Enregistrer' }}</button>
          <button @click="showVisiteForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8"><div class="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600"></div></div>
      <div v-else-if="visites.length === 0" class="text-center py-8 text-gray-400"><span class="text-3xl block mb-2">🏠</span><p>Aucune visite enregistrée</p></div>
      <div v-else class="space-y-3">
        <div v-for="v in visites" :key="v.id" class="border border-gray-200 rounded-xl p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="text-sm">{{ typeVisiteIcon(v.type) }}</span>
                <span class="font-semibold text-gray-800 text-sm">{{ v.membre?.nom }} {{ v.membre?.prenom }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{{ typeVisiteLabel(v.type) }}</span>
                <span v-if="v.confidentiel" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">🔒 Confidentiel</span>
              </div>
              <div class="flex gap-3 text-xs text-gray-500 mb-1">
                <span>📅 {{ formatDate(v.date) }}</span>
                <span>👤 {{ v.pasteur }}</span>
                <span v-if="v.motif">📌 {{ v.motif }}</span>
              </div>
              <p v-if="!v.confidentiel && v.notes" class="text-xs text-gray-600 mt-1">{{ v.notes }}</p>
              <p v-if="!v.confidentiel && v.suivi" class="text-xs text-blue-600 mt-1">🔄 Suivi : {{ v.suivi }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ NOUVEAUX CONVERTIS ═══ -->
    <div v-if="ongletActif === 'convertis'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">✝️ Nouveaux Convertis</h2>
          <p class="text-gray-500 text-sm mt-1">Suivi de la progression dans la foi</p>
        </div>
        <button @click="showConvertiForm = !showConvertiForm" class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-semibold">➕ Enregistrer</button>
      </div>

      <div v-if="showConvertiForm" class="mb-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Membre <span class="text-red-500">*</span></label>
            <select v-model="convertiForm.membreId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="">— Choisir —</option>
              <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Date de conversion <span class="text-red-500">*</span></label>
            <input v-model="convertiForm.dateConversion" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Stade de formation</label>
            <select v-model="convertiForm.stadeFormation" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="NOUVEAU">🌱 Nouveau converti</option>
              <option value="CATECHISME">📚 En catéchisme</option>
              <option value="BAPTISE">💧 Baptisé</option>
              <option value="INTEGRE">✅ Intégré</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Évangélisateur</label>
            <input v-model="convertiForm.evangelisateur" placeholder="Qui a évangélisé ce membre ?" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Lieu de conversion</label>
            <input v-model="convertiForm.lieuConversion" placeholder="Ex: Culte du 15 mars, Croisade..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="saveConverti" :disabled="isSaving" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60">{{ isSaving ? '...' : '💾 Enregistrer' }}</button>
          <button @click="showConvertiForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Annuler</button>
        </div>
      </div>

      <!-- Statistiques stades -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div v-for="s in stades" :key="s.val" class="p-3 rounded-xl border border-gray-200 text-center">
          <p class="text-xl">{{ s.icon }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
          <p class="text-lg font-bold text-gray-800">{{ convertis.filter(c => c.stadeFormation === s.val).length }}</p>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8"><div class="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600"></div></div>
      <div v-else class="space-y-3">
        <div v-for="c in convertis" :key="c.id" class="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', c.membre?.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
            {{ c.membre?.prenom?.charAt(0) }}{{ c.membre?.nom?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800">{{ c.membre?.nom }} {{ c.membre?.prenom }}</p>
            <p class="text-xs text-gray-500">Converti le {{ formatDate(c.dateConversion) }}{{ c.evangelisateur ? ' · par ' + c.evangelisateur : '' }}</p>
          </div>
          <div>
            <select :value="c.stadeFormation" @change="updateStade(c.id, $event.target.value)"
              class="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-400 outline-none">
              <option value="NOUVEAU">🌱 Nouveau</option>
              <option value="CATECHISME">📚 Catéchisme</option>
              <option value="BAPTISE">💧 Baptisé</option>
              <option value="INTEGRE">✅ Intégré</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ DEMANDES DE PRIÈRE ═══ -->
    <div v-if="ongletActif === 'prieres'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">🙏 Demandes de Prière</h2>
          <p class="text-gray-500 text-sm mt-1">{{ prieres.filter(p => p.statut === 'EN_COURS').length }} en cours</p>
        </div>
        <button @click="showPriereForm = !showPriereForm" class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-semibold">➕ Nouvelle demande</button>
      </div>

      <div v-if="showPriereForm" class="mb-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Membre (optionnel)</label>
            <select v-model="priereForm.membreId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="">— Anonyme —</option>
              <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Sujet <span class="text-red-500">*</span></label>
            <input v-model="priereForm.sujet" placeholder="Ex: Guérison, travail, famille..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"/>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Détails</label>
            <textarea v-model="priereForm.details" rows="2" placeholder="Détails de la demande..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"></textarea>
          </div>
          <div class="flex items-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="priereForm.confidentiel" class="w-4 h-4 rounded"/>
              <span class="text-sm text-gray-600">🔒 Confidentiel (pasteur uniquement)</span>
            </label>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="savePriere" :disabled="isSaving" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60">{{ isSaving ? '...' : '🙏 Soumettre' }}</button>
          <button @click="showPriereForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Annuler</button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8"><div class="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600"></div></div>
      <div v-else-if="prieres.length === 0" class="text-center py-8 text-gray-400"><span class="text-3xl block mb-2">🙏</span><p>Aucune demande</p></div>
      <div v-else class="space-y-3">
        <div v-for="p in prieres" :key="p.id" :class="['border rounded-xl p-4', p.statut === 'REPONDU' ? 'border-green-200 bg-green-50/30' : 'border-gray-200']">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-800 text-sm">{{ p.sujet }}</span>
                <span v-if="p.confidentiel" class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">🔒</span>
              </div>
              <p class="text-xs text-gray-500">{{ p.membre ? p.membre.nom + ' ' + p.membre.prenom : 'Anonyme' }} · {{ formatDate(p.createdAt) }}</p>
              <p v-if="!p.confidentiel && p.details" class="text-xs text-gray-600 mt-1">{{ p.details }}</p>
            </div>
            <select :value="p.statut" @change="updateStatutPriere(p.id, $event.target.value)"
              class="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-400 outline-none flex-shrink-0">
              <option value="EN_COURS">⏳ En cours</option>
              <option value="REPONDU">✅ Répondu</option>
              <option value="ARCHIVE">📁 Archivé</option>
            </select>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const ongletActif = ref('visites')
const membres = ref([])
const visites = ref([])
const convertis = ref([])
const prieres = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const showVisiteForm = ref(false)
const showConvertiForm = ref(false)
const showPriereForm = ref(false)

const onglets = [
  { val: 'visites', icon: '🏠', label: 'Visites' },
  { val: 'convertis', icon: '✝️', label: 'Convertis' },
  { val: 'prieres', icon: '🙏', label: 'Prières' }
]

const stades = [
  { val: 'NOUVEAU', icon: '🌱', label: 'Nouveaux' },
  { val: 'CATECHISME', icon: '📚', label: 'Catéchisme' },
  { val: 'BAPTISE', icon: '💧', label: 'Baptisés' },
  { val: 'INTEGRE', icon: '✅', label: 'Intégrés' }
]

const visiteForm = reactive({ membreId: '', type: 'VISITE', pasteur: '', date: '', motif: '', notes: '', suivi: '', confidentiel: false })
const convertiForm = reactive({ membreId: '', dateConversion: '', stadeFormation: 'NOUVEAU', evangelisateur: '', lieuConversion: '', notes: '' })
const priereForm = reactive({ membreId: '', sujet: '', details: '', confidentiel: false })

const chargerMembres = async () => { try { membres.value = await $fetch('/api/membres') || [] } catch (e) { console.error(e) } }

const charger = async () => {
  isLoading.value = true
  try {
    if (ongletActif.value === 'visites') visites.value = await $fetch('/api/pastoral/visites') || []
    else if (ongletActif.value === 'convertis') convertis.value = await $fetch('/api/pastoral/convertis') || []
    else if (ongletActif.value === 'prieres') prieres.value = await $fetch('/api/pastoral/prieres') || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(async () => { await chargerMembres(); await charger() })
watch(ongletActif, charger)

const saveVisite = async () => {
  if (!visiteForm.membreId || !visiteForm.date || !visiteForm.pasteur) return
  isSaving.value = true
  try { await $fetch('/api/pastoral/visites', { method: 'POST', body: visiteForm }); showVisiteForm.value = false; charger() }
  catch (e) { alert(e.data?.message || 'Erreur') }
  finally { isSaving.value = false }
}

const saveConverti = async () => {
  if (!convertiForm.membreId || !convertiForm.dateConversion) return
  isSaving.value = true
  try { await $fetch('/api/pastoral/convertis', { method: 'POST', body: convertiForm }); showConvertiForm.value = false; charger() }
  catch (e) { alert(e.data?.message || 'Erreur') }
  finally { isSaving.value = false }
}

const updateStade = async (id, stade) => {
  try {
    const c = convertis.value.find(x => x.id === id)
    await $fetch('/api/pastoral/convertis', { method: 'POST', body: { membreId: c.membreId, dateConversion: c.dateConversion, stadeFormation: stade } })
    charger()
  } catch (e) { console.error(e) }
}

const savePriere = async () => {
  if (!priereForm.sujet) return
  isSaving.value = true
  try { await $fetch('/api/pastoral/prieres', { method: 'POST', body: priereForm }); showPriereForm.value = false; charger() }
  catch (e) { alert(e.data?.message || 'Erreur') }
  finally { isSaving.value = false }
}

const updateStatutPriere = async (id, statut) => {
  try { await $fetch(`/api/pastoral/prieres/${id}`, { method: 'PUT', body: { statut } }); charger() }
  catch (e) { console.error(e) }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'
const typeVisiteIcon = (t) => ({ VISITE:'🏠', COUNSELING:'💬', PRIERE:'🙏', TELEPHONE:'📞' }[t] || '🏠')
const typeVisiteLabel = (t) => ({ VISITE:'Visite', COUNSELING:'Counseling', PRIERE:'Prière', TELEPHONE:'Téléphone' }[t] || t)
</script>
