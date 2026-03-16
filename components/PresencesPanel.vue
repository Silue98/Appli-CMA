<template>
  <section class="w-full space-y-6">
    <!-- Stats rapides -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in statsCards" :key="s.label" :class="['bg-white rounded-xl border p-4 shadow-sm', s.border]">
        <p class="text-xs text-gray-500 mb-1">{{ s.label }}</p>
        <p :class="['text-xl font-bold', s.color]">{{ s.value }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">📊 Présences aux Cultes</h2>
          <p class="text-gray-500 text-sm mt-1">Enregistrez et consultez les présences des membres</p>
        </div>
        <div class="flex gap-2">
          <button v-if="selectedCulte && membres.length > 0" @click="exportPresences"
            class="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm hover:bg-green-100 transition">
            📄 Exporter
          </button>
          <button v-if="selectedCulte && membres.length > 0" @click="saveAllPresences" :disabled="isSaving"
            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium disabled:opacity-60">
            {{ isSaving ? 'Enregistrement...' : '💾 Sauvegarder la feuille' }}
          </button>
        </div>
      </div>

      <!-- Sélecteur de culte -->
      <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
        <label class="block text-sm font-semibold text-blue-700 mb-2">📅 Sélectionner le culte</label>
        <select v-model="selectedCulteId" @change="loadPresences"
          class="w-full md:w-96 px-3 py-2.5 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none text-sm">
          <option value="">— Choisir un culte —</option>
          <option v-for="c in cultes" :key="c.id" :value="c.id">
            {{ formatDate(c.dateCulte) }} — {{ c.horaire }} — {{ c.themePrincipal || 'Sans thème' }}
          </option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Aucun culte sélectionné -->
      <div v-else-if="!selectedCulteId" class="text-center py-12 text-gray-400">
        <span class="text-4xl block mb-3">📋</span>
        <p>Sélectionnez un culte pour gérer les présences</p>
      </div>

      <!-- Feuille de présence -->
      <div v-else>
        <!-- Barre de recherche + actions rapides -->
        <div class="flex flex-col md:flex-row gap-3 mb-4">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="search" placeholder="Rechercher un membre..."
              class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div class="flex gap-2">
            <button @click="marquerTous('PRESENT')"
              class="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition font-medium">
              ✅ Tous présents
            </button>
            <button @click="marquerTous('ABSENT')"
              class="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition font-medium">
              ❌ Tous absents
            </button>
          </div>
        </div>

        <!-- Compteurs live -->
        <div class="flex gap-4 mb-4 text-sm">
          <span class="text-green-700 font-medium">✅ Présents : {{ countPresents }}</span>
          <span class="text-red-600 font-medium">❌ Absents : {{ countAbsents }}</span>
          <span class="text-yellow-600 font-medium">🔶 Excusés : {{ countExcuses }}</span>
          <span class="text-gray-500">Total : {{ filteredMembres.length }}</span>
        </div>

        <!-- Tableau présences -->
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Membre</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Groupe</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Présence</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motif (si absent)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="membre in filteredMembres" :key="membre.id"
                :class="['transition-colors', presenceMap[membre.id]?.statut === 'PRESENT' ? 'bg-green-50/30' : presenceMap[membre.id]?.statut === 'ABSENT' ? 'bg-red-50/30' : 'bg-yellow-50/30']">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <img v-if="membre.photo" :src="membre.photo" class="w-8 h-8 rounded-full object-cover" />
                      <div v-else class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-green-700 text-xs font-bold">{{ membre.prenom?.charAt(0) }}{{ membre.nom?.charAt(0) }}</span>
                      </div>
                    </div>
                    <span class="font-medium text-gray-800">{{ membre.nom }} {{ membre.prenom }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ membre.activiteAuSeinDP || '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <button v-for="opt in presenceOptions" :key="opt.value"
                      @click="setPresence(membre.id, opt.value)"
                      :class="['px-3 py-1.5 rounded-lg text-xs font-semibold transition border', presenceMap[membre.id]?.statut === opt.value ? opt.activeClass : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100']">
                      {{ opt.label }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <input v-if="presenceMap[membre.id] && presenceMap[membre.id].statut !== 'PRESENT'"
                    v-model="presenceMap[membre.id].motif"
                    placeholder="Motif..."
                    class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-300 outline-none" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Historique par membre -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-base font-bold text-gray-800 mb-4">📈 Historique des présences par membre</h3>
      <div class="flex flex-col md:flex-row gap-3 mb-4">
        <select v-model="historiqueMembreId" @change="loadHistorique"
          class="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none">
          <option value="">— Choisir un membre —</option>
          <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
        </select>
      </div>
      <div v-if="historiquePresences.length > 0" class="space-y-2">
        <div v-for="p in historiquePresences" :key="p.id" class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
          <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', p.statut === 'PRESENT' ? 'bg-green-100 text-green-700' : p.statut === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700']">
            {{ p.statut === 'PRESENT' ? '✅' : p.statut === 'ABSENT' ? '❌' : '🔶' }} {{ p.statut }}
          </span>
          <span class="text-sm text-gray-700">{{ p.culte ? formatDate(p.culte.dateCulte) + ' — ' + p.culte.horaire : '—' }}</span>
          <span v-if="p.motif" class="text-xs text-gray-400 italic">{{ p.motif }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Taux de présence : <strong>{{ tauxPresence }}%</strong>
          ({{ historiquePresences.filter(p => p.statut === 'PRESENT').length }} / {{ historiquePresences.length }} cultes)
        </p>
      </div>
      <p v-else-if="historiqueMembreId" class="text-gray-400 text-sm">Aucun historique pour ce membre.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const cultes = ref([])
const membres = ref([])
const selectedCulteId = ref('')
const selectedCulte = computed(() => cultes.value.find(c => c.id === Number(selectedCulteId.value)))
const presenceMap = reactive({})
const isLoading = ref(false)
const isSaving = ref(false)
const search = ref('')
const historiqueMembreId = ref('')
const historiquePresences = ref([])

const presenceOptions = [
  { value: 'PRESENT', label: '✅ Présent', activeClass: 'bg-green-600 text-white border-green-600' },
  { value: 'ABSENT', label: '❌ Absent', activeClass: 'bg-red-600 text-white border-red-600' },
  { value: 'EXCUSE', label: '🔶 Excusé', activeClass: 'bg-yellow-500 text-white border-yellow-500' }
]

onMounted(async () => {
  try {
    const [c, m] = await Promise.all([$fetch('/api/cultes'), $fetch('/api/membres')])
    cultes.value = c || []
    membres.value = m || []
    // Initialiser la map avec PRESENT par défaut
    membres.value.forEach(m => { presenceMap[m.id] = { statut: 'PRESENT', motif: '' } })
  } catch (e) { console.error(e) }
})

const loadPresences = async () => {
  if (!selectedCulteId.value) return
  isLoading.value = true
  try {
    const existing = await $fetch(`/api/presences?culteId=${selectedCulteId.value}`)
    // Réinitialiser
    membres.value.forEach(m => { presenceMap[m.id] = { statut: 'PRESENT', motif: '' } })
    // Appliquer les présences existantes
    existing.forEach(p => {
      presenceMap[p.membreId] = { statut: p.statut, motif: p.motif || '' }
    })
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

const setPresence = (membreId, statut) => {
  if (!presenceMap[membreId]) presenceMap[membreId] = { statut, motif: '' }
  presenceMap[membreId].statut = statut
  if (statut === 'PRESENT') presenceMap[membreId].motif = ''
}

const marquerTous = (statut) => {
  membres.value.forEach(m => {
    presenceMap[m.id] = { statut, motif: '' }
  })
}

const saveAllPresences = async () => {
  isSaving.value = true
  try {
    const presences = membres.value.map(m => ({
      membreId: m.id,
      statut: presenceMap[m.id]?.statut || 'PRESENT',
      motif: presenceMap[m.id]?.motif || null
    }))
    await $fetch('/api/presences', {
      method: 'POST',
      body: { culteId: Number(selectedCulteId.value), presences }
    })
    alert('✅ Feuille de présence sauvegardée !')
  } catch (e) { alert('Erreur lors de la sauvegarde') }
  finally { isSaving.value = false }
}

const loadHistorique = async () => {
  if (!historiqueMembreId.value) return
  try {
    historiquePresences.value = await $fetch(`/api/presences?membreId=${historiqueMembreId.value}`)
  } catch (e) { console.error(e) }
}

const filteredMembres = computed(() => {
  if (!search.value) return membres.value
  const t = search.value.toLowerCase()
  return membres.value.filter(m =>
    m.nom?.toLowerCase().includes(t) || m.prenom?.toLowerCase().includes(t) || m.activiteAuSeinDP?.toLowerCase().includes(t)
  )
})

const countPresents = computed(() => filteredMembres.value.filter(m => presenceMap[m.id]?.statut === 'PRESENT').length)
const countAbsents = computed(() => filteredMembres.value.filter(m => presenceMap[m.id]?.statut === 'ABSENT').length)
const countExcuses = computed(() => filteredMembres.value.filter(m => presenceMap[m.id]?.statut === 'EXCUSE').length)

const tauxPresence = computed(() => {
  if (!historiquePresences.value.length) return 0
  return Math.round(historiquePresences.value.filter(p => p.statut === 'PRESENT').length / historiquePresences.value.length * 100)
})

const statsCards = computed(() => [
  { label: 'Total membres', value: membres.value.length, color: 'text-gray-800', border: 'border-gray-100' },
  { label: 'Présents (ce culte)', value: selectedCulteId.value ? countPresents.value : '—', color: 'text-green-700', border: 'border-green-100' },
  { label: 'Absents (ce culte)', value: selectedCulteId.value ? countAbsents.value : '—', color: 'text-red-600', border: 'border-red-100' },
  { label: 'Taux de présence', value: selectedCulteId.value && membres.value.length ? Math.round(countPresents.value / membres.value.length * 100) + '%' : '—', color: 'text-blue-700', border: 'border-blue-100' }
])

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const exportPresences = () => {
  const c = selectedCulte.value
  const headers = ['Nom', 'Prénom', 'Groupe', 'Statut', 'Motif']
  const rows = filteredMembres.value.map(m => [
    m.nom, m.prenom, m.activiteAuSeinDP || '',
    presenceMap[m.id]?.statut || 'PRESENT',
    presenceMap[m.id]?.motif || ''
  ].map(v => `"${v}"`))
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `presences_${c?.dateCulte?.split('T')[0] || 'culte'}.csv`
  a.click()
}
</script>
