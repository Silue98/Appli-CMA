<template>
  <section class="w-full space-y-6">
    <!-- Résumé financier -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in cardsStats" :key="card.label"
        :class="['bg-white rounded-xl border p-4 shadow-sm', card.border]">
        <p class="text-xs text-gray-500 mb-1">{{ card.label }}</p>
        <p :class="['text-xl font-bold', card.color]">{{ formatMontant(card.value) }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Panel principal -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">💰 Finances & Offrandes</h2>
          <p class="text-gray-500 text-sm mt-1">Suivi des entrées et dépenses de l'église</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportFinances"
            class="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm hover:bg-green-100 transition">
            📊 Exporter CSV
          </button>
          <button @click="showForm = !showForm"
            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ showForm ? 'Fermer' : '➕ Nouvelle transaction' }}
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm" class="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">{{ editItem ? 'Modifier la transaction' : 'Nouvelle transaction' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Type <span class="text-red-500">*</span></label>
            <select v-model="form.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white">
              <option value="" disabled>— Choisir —</option>
              <option value="OFFRANDE">🙏 Offrande</option>
              <option value="DIXME">💎 Dîme</option>
              <option value="DON">🎁 Don</option>
              <option value="DEPENSE">📤 Dépense</option>
              <option value="AUTRE">📦 Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Montant (FCFA) <span class="text-red-500">*</span></label>
            <input v-model="form.montant" type="number" min="0" placeholder="Ex: 50000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input v-model="form.date" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Culte associé</label>
            <select v-model="form.culteId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white">
              <option value="">— Aucun —</option>
              <option v-for="c in cultes" :key="c.id" :value="c.id">
                {{ formatDateCourt(c.dateCulte) }} — {{ c.themePrincipal || c.horaire }}
              </option>
            </select>
          </div>
          <div class="md:col-span-2 lg:col-span-4">
            <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input v-model="form.description" placeholder="Notes ou détails supplémentaires..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white" />
          </div>
        </div>
        <p v-if="errorMsg" class="text-sm text-red-600 mt-2">❌ {{ errorMsg }}</p>
        <div class="flex gap-2 mt-3">
          <button @click="saveTransaction" :disabled="isSaving"
            class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-60">
            {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Enregistrer') }}
          </button>
          <button @click="closeForm" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col md:flex-row gap-3 mb-4">
        <select v-model="filterType" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none">
          <option value="">Tous les types</option>
          <option value="OFFRANDE">🙏 Offrandes</option>
          <option value="DIXME">💎 Dîmes</option>
          <option value="DON">🎁 Dons</option>
          <option value="DEPENSE">📤 Dépenses</option>
          <option value="AUTRE">📦 Autres</option>
        </select>
        <input v-model="filterDateDebut" type="date" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none" />
        <input v-model="filterDateFin" type="date" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none" />
        <button @click="clearFilters" class="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition">Effacer</button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>

      <!-- Vide -->
      <div v-else-if="transactions.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">💰</span>
        <p>Aucune transaction enregistrée</p>
      </div>

      <!-- Tableau -->
      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Montant</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Culte</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="t in paginatedTransactions" :key="t.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(t.date) }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', typeBadge(t.type)]">
                  {{ typeLabel(t.type) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right font-semibold" :class="t.type === 'DEPENSE' ? 'text-red-600' : 'text-green-700'">
                {{ t.type === 'DEPENSE' ? '-' : '+' }}{{ formatMontant(t.montant) }}
              </td>
              <td class="px-4 py-3 text-gray-500 max-w-[200px] truncate">{{ t.description || '—' }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">
                <span v-if="t.culte">{{ formatDateCourt(t.culte.dateCulte) }}</span>
                <span v-else>—</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button @click="editTransaction(t)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Modifier">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="deleteTransaction(t)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="2" class="px-4 py-3 text-sm font-semibold text-gray-700">Total affiché</td>
              <td class="px-4 py-3 text-right font-bold text-gray-800">{{ formatMontant(totalAffiche) }}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <p class="text-sm text-gray-500">{{ transactions.length }} transaction(s)</p>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">← Précédent</button>
          <span class="px-3 py-1.5 text-sm text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">Suivant →</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const showForm = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMsg = ref('')
const editItem = ref(null)
const transactions = ref([])
const cultes = ref([])
const statsFinances = ref(null)
const filterType = ref('')
const filterDateDebut = ref('')
const filterDateFin = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

const form = reactive({ type: '', montant: '', date: new Date().toISOString().split('T')[0], description: '', culteId: '' })

const fetchData = async () => {
  isLoading.value = true
  try {
    const params = new URLSearchParams()
    if (filterType.value) params.set('type', filterType.value)
    if (filterDateDebut.value) params.set('dateDebut', filterDateDebut.value)
    if (filterDateFin.value) params.set('dateFin', filterDateFin.value)

    const [res, s, c] = await Promise.all([
      $fetch(`/api/finances?${params}`),
      $fetch('/api/finances/stats'),
      $fetch('/api/cultes')
    ])
    transactions.value = res.transactions || []
    statsFinances.value = s
    cultes.value = c || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchData)
watch([filterType, filterDateDebut, filterDateFin], () => { fetchData(); currentPage.value = 1 })

const totalAffiche = computed(() => transactions.value.reduce((sum, t) => t.type === 'DEPENSE' ? sum - t.montant : sum + t.montant, 0))
const totalPages = computed(() => Math.ceil(transactions.value.length / itemsPerPage) || 1)
const paginatedTransactions = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage
  return transactions.value.slice(s, s + itemsPerPage)
})

const cardsStats = computed(() => {
  const s = statsFinances.value
  return [
    { label: 'Entrées ce mois', value: s?.totalMois || 0, color: 'text-green-700', border: 'border-green-100', sub: 'Offrandes + dîmes + dons' },
    { label: 'Entrées cette année', value: s?.totalAnnee || 0, color: 'text-blue-700', border: 'border-blue-100', sub: new Date().getFullYear() },
    { label: 'Offrandes (année)', value: s?.parType?.find(p => p.type === 'OFFRANDE')?._sum?.montant || 0, color: 'text-purple-700', border: 'border-purple-100', sub: 'Collectées au culte' },
    { label: 'Dépenses (année)', value: s?.parType?.find(p => p.type === 'DEPENSE')?._sum?.montant || 0, color: 'text-red-600', border: 'border-red-100', sub: 'Charges et frais' }
  ]
})

const closeForm = () => { showForm.value = false; editItem.value = null; Object.assign(form, { type: '', montant: '', date: new Date().toISOString().split('T')[0], description: '', culteId: '' }) }

const editTransaction = (t) => {
  editItem.value = t
  Object.assign(form, { type: t.type, montant: t.montant, date: new Date(t.date).toISOString().split('T')[0], description: t.description || '', culteId: t.culteId || '' })
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveTransaction = async () => {
  errorMsg.value = ''
  if (!form.type || !form.montant) { errorMsg.value = 'Type et montant requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) {
      await $fetch(`/api/finances/${editItem.value.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/finances', { method: 'POST', body: form })
    }
    closeForm()
    fetchData()
  } catch (e) { errorMsg.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const deleteTransaction = async (t) => {
  if (!confirm(`Supprimer cette transaction de ${formatMontant(t.montant)} ?`)) return
  try { await $fetch(`/api/finances/${t.id}`, { method: 'DELETE' }); fetchData() }
  catch (e) { alert('Erreur lors de la suppression') }
}

const clearFilters = () => { filterType.value = ''; filterDateDebut.value = ''; filterDateFin.value = '' }

const exportFinances = () => {
  const headers = ['Date', 'Type', 'Montant', 'Description', 'Culte']
  const rows = transactions.value.map(t => [
    formatDate(t.date), typeLabel(t.type), t.montant,
    t.description || '', t.culte ? formatDateCourt(t.culte.dateCulte) : ''
  ].map(v => `"${v}"`))
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `finances_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

const formatMontant = (v) => {
  if (!v && v !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(Math.abs(v)) + ' FCFA'
}
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const formatDateCourt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const typeLabel = (t) => ({ OFFRANDE: '🙏 Offrande', DIXME: '💎 Dîme', DON: '🎁 Don', DEPENSE: '📤 Dépense', AUTRE: '📦 Autre' }[t] || t)
const typeBadge = (t) => ({
  OFFRANDE: 'bg-green-100 text-green-800', DIXME: 'bg-purple-100 text-purple-800',
  DON: 'bg-blue-100 text-blue-800', DEPENSE: 'bg-red-100 text-red-800', AUTRE: 'bg-gray-100 text-gray-700'
}[t] || 'bg-gray-100 text-gray-700')
</script>
