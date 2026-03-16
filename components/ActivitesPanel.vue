<template>
  <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">🎯 Activités des Membres</h2>
        <p class="text-gray-500 text-sm mt-1">Réunions, formations, événements des groupes</p>
      </div>
      <button @click="showForm = !showForm"
        class="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition text-sm font-medium flex items-center gap-2 self-start">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ showForm ? 'Fermer' : '➕ Nouvelle activité' }}
      </button>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-5 bg-orange-50 border border-orange-100 rounded-xl p-4">
      <h3 class="text-sm font-semibold text-orange-700 mb-3">{{ editItem ? 'Modifier l\'activité' : 'Nouvelle activité' }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Membre <span class="text-red-500">*</span></label>
          <select v-model="form.membreId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white">
            <option value="" disabled>— Sélectionner —</option>
            <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Titre <span class="text-red-500">*</span></label>
          <input v-model="form.titre" placeholder="Ex: Réunion groupe Bergers"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Date <span class="text-red-500">*</span></label>
          <input v-model="form.dateActivite" type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Lieu</label>
          <input v-model="form.lieu" placeholder="Ex: Salle de culte"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea v-model="form.description" rows="2" placeholder="Détails de l'activité..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white resize-none"></textarea>
        </div>
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600 mt-2">❌ {{ errorMsg }}</p>
      <div class="flex gap-2 mt-3">
        <button @click="saveActivite" :disabled="isSaving"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Enregistrer') }}
        </button>
        <button @click="closeForm" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" placeholder="Rechercher (titre, membre, lieu...)"
          class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
      </div>
      <select v-model="filtreMembreId"
        class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none">
        <option value="">Tous les membres</option>
        <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <!-- Vide -->
    <div v-else-if="filteredActivites.length === 0" class="text-center py-10 text-gray-400">
      <span class="text-4xl block mb-2">🎯</span>
      <p>{{ search || filtreMembreId ? 'Aucune activité trouvée' : 'Aucune activité enregistrée' }}</p>
    </div>

    <!-- Tableau -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Membre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lieu</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="a in paginatedActivites" :key="a.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(a.dateActivite) }}</td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ a.titre }}</td>
            <td class="px-4 py-3">
              <div v-if="a.membre" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-orange-700 text-xs font-bold">{{ a.membre.prenom?.charAt(0) }}{{ a.membre.nom?.charAt(0) }}</span>
                </div>
                <span class="text-gray-700 text-sm">{{ a.membre.nom }} {{ a.membre.prenom }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ a.lieu || '—' }}</td>
            <td class="px-4 py-3 text-gray-400 text-xs max-w-[200px]">
              <p class="truncate">{{ a.description || '—' }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button @click="editActivite(a)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button @click="deleteActivite(a)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">{{ filteredActivites.length }} activité(s)</p>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">← Précédent</button>
        <span class="text-sm text-gray-600 px-2">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm">Suivant →</button>
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
const activites = ref([])
const membres = ref([])
const search = ref('')
const filtreMembreId = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

const form = reactive({ membreId: '', titre: '', dateActivite: '', lieu: '', description: '' })

const fetchActivites = async () => {
  isLoading.value = true
  try {
    const params = filtreMembreId.value ? `?membreId=${filtreMembreId.value}` : ''
    activites.value = await $fetch(`/api/activites${params}`) || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(async () => {
  try { membres.value = await $fetch('/api/membres') || [] } catch (e) { console.error(e) }
  fetchActivites()
})

watch(filtreMembreId, () => { fetchActivites(); currentPage.value = 1 })

const filteredActivites = computed(() => {
  if (!search.value) return activites.value
  const t = search.value.toLowerCase()
  return activites.value.filter(a =>
    a.titre?.toLowerCase().includes(t) ||
    a.lieu?.toLowerCase().includes(t) ||
    a.membre?.nom?.toLowerCase().includes(t) ||
    a.membre?.prenom?.toLowerCase().includes(t)
  )
})

const totalPages = computed(() => Math.ceil(filteredActivites.value.length / itemsPerPage) || 1)
const paginatedActivites = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage
  return filteredActivites.value.slice(s, s + itemsPerPage)
})

const closeForm = () => { showForm.value = false; editItem.value = null; Object.assign(form, { membreId: '', titre: '', dateActivite: '', lieu: '', description: '' }) }

const editActivite = (a) => {
  editItem.value = a
  Object.assign(form, { membreId: a.membreId, titre: a.titre, dateActivite: new Date(a.dateActivite).toISOString().split('T')[0], lieu: a.lieu || '', description: a.description || '' })
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveActivite = async () => {
  errorMsg.value = ''
  if (!form.membreId || !form.titre || !form.dateActivite) { errorMsg.value = 'Membre, titre et date sont requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) {
      await $fetch(`/api/activites/${editItem.value.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/activites', { method: 'POST', body: form })
    }
    closeForm()
    fetchActivites()
  } catch (e) { errorMsg.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const deleteActivite = async (a) => {
  if (!confirm(`Supprimer l'activité "${a.titre}" ?`)) return
  try { await $fetch(`/api/activites/${a.id}`, { method: 'DELETE' }); fetchActivites() }
  catch (e) { alert('Erreur lors de la suppression') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
</script>
