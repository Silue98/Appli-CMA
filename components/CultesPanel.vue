<template>
  <section class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">⛪ Cultes</h2>
        <p class="text-gray-500 text-sm mt-1">Gestion des cultes de l'église</p>
      </div>
      <button @click="showForm = !showForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 self-start">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ showForm ? 'Fermer' : '➕ Nouveau culte' }}
      </button>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-3 mb-5">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="Rechercher (thème, date...)"
          class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm transition" />
      </div>
      <select v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm transition">
        <option value="">Trier par...</option>
        <option value="dateCulte">Date</option>
        <option value="themePrincipal">Thème</option>
      </select>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-5">
      <CulteForm :existingData="culteToEdit" @saved="onSaved" @cancel="closeForm" />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Vide -->
    <div v-else-if="filteredCultes.length === 0" class="text-center py-10 text-gray-400">
      <svg class="mx-auto w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>{{ search ? 'Aucun culte trouvé' : 'Aucun culte enregistré' }}</p>
    </div>

    <!-- Tableau -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Horaire</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thème principal</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prédications</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="culte in paginatedCultes" :key="culte.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900">{{ formatDate(culte.dateCulte) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ culte.horaire }}</td>
            <td class="px-4 py-3 text-gray-700">{{ culte.themePrincipal || '—' }}</td>
            <td class="px-4 py-3">
              <span v-if="culte.predications?.length" class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {{ culte.predications.length }} prédication(s)
              </span>
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button @click="editCulte(culte)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Modifier">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="notifierCulte(culte)" :disabled="notifying === culte.id" title="Notifier les membres" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition disabled:opacity-50">
                  <span v-if="notifying === culte.id" class="text-xs">⏳</span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </button>
                <button @click="deleteCulte(culte)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">Page {{ currentPage }} / {{ totalPages }}</p>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm transition">← Précédent</button>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm transition">Suivant →</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CulteForm from '~/components/CulteForm.vue'

const showForm = ref(false)
const cultes = ref([])
const isLoading = ref(true)
const search = ref('')
const sortField = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const culteToEdit = ref(null)

const fetchCultes = async () => {
  isLoading.value = true
  try { cultes.value = await $fetch('/api/cultes') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}
fetchCultes()

const onSaved = () => { closeForm(); fetchCultes() }
const closeForm = () => { showForm.value = false; culteToEdit.value = null }
const editCulte = (c) => { culteToEdit.value = c; showForm.value = true; window.scrollTo({ top: 0, behavior: 'smooth' }) }

const notifying = ref(null)
const notifierCulte = async (culte) => {
  if (!confirm(`Notifier tous les membres pour le culte du ${new Date(culte.dateCulte).toLocaleDateString('fr-FR')} ?`)) return
  notifying.value = culte.id
  try {
    const result = await $fetch('/api/emails/notify-culte', { method: 'POST', body: { culteId: culte.id } })
    alert(`✅ Notification envoyée à ${result.envoyes} membre(s) !`)
  } catch (e) { alert(`❌ ${e.data?.message || e.message}`) }
  finally { notifying.value = null }
}

const deleteCulte = async (c) => {
  if (!confirm(`Supprimer le culte du ${formatDate(c.dateCulte)} ?\nAttention : les prédications et annonces associées seront aussi supprimées.`)) return
  try {
    await $fetch(`/api/cultes/${c.id}`, { method: 'DELETE' })
    fetchCultes()
  } catch (e) { alert('Erreur lors de la suppression') }
}

const filteredCultes = computed(() => {
  let r = cultes.value
  if (search.value) {
    const t = search.value.toLowerCase()
    r = r.filter(c =>
      c.themePrincipal?.toLowerCase().includes(t) ||
      c.horaire?.toLowerCase().includes(t) ||
      formatDate(c.dateCulte).toLowerCase().includes(t)
    )
  }
  if (sortField.value === 'dateCulte') r = [...r].sort((a, b) => new Date(b.dateCulte) - new Date(a.dateCulte))
  if (sortField.value === 'themePrincipal') r = [...r].sort((a, b) => (a.themePrincipal || '').localeCompare(b.themePrincipal || ''))
  return r
})

const totalPages = computed(() => Math.ceil(filteredCultes.value.length / itemsPerPage.value) || 1)
const paginatedCultes = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage.value
  return filteredCultes.value.slice(s, s + itemsPerPage.value)
})
watch([search, sortField], () => { currentPage.value = 1 })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'
</script>
