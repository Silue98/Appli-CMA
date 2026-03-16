<template>
  <section class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">📅 Programmes des Cultes</h2>
        <p class="text-gray-500 text-sm mt-1">Gestion des programmes et affectations</p>
      </div>
      <div class="flex gap-2">
        <button @click="printAll" :disabled="filteredProgrammes.length === 0"
          class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50">
          🖨️ Tout imprimer
        </button>
        <button @click="showForm = !showForm"
          class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ showForm ? 'Fermer' : '➕ Nouveau' }}
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-3 mb-5">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="Rechercher (thème, semaine, membre...)"
          class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm transition" />
      </div>
      <select v-model="statusFilter"
        class="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm transition">
        <option value="all">Tous les statuts</option>
        <option value="PLANIFIE">Planifié</option>
        <option value="EN_COURS">En cours</option>
        <option value="TERMINE">Terminé</option>
        <option value="ANNULE">Annulé</option>
      </select>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-5">
      <ProgrammeForm :existingData="programmeToEdit" @saved="onSaved" @cancel="closeForm" />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Vide -->
    <div v-else-if="filteredProgrammes.length === 0" class="text-center py-10 text-gray-400">
      <svg class="mx-auto w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>{{ search ? 'Aucun programme trouvé' : 'Aucun programme enregistré' }}</p>
    </div>

    <!-- Tableau -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Semaine</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thème</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cantiques</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rôles assignés</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="p in paginatedProgrammes" :key="p.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{{ formatDate(p.date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ p.semaine || '—' }}</td>
            <td class="px-4 py-3 text-gray-700 max-w-[160px]">
              <p class="truncate" :title="p.theme">{{ p.theme || '—' }}</p>
            </td>
            <td class="px-4 py-3 text-gray-600 text-xs">
              <p v-if="p.cantiqueFrancais" class="truncate">🇫🇷 {{ p.cantiqueFrancais }}</p>
              <p v-if="p.cantiqueBaoule" class="truncate">🇨🇮 {{ p.cantiqueBaoule }}</p>
              <span v-if="!p.cantiqueFrancais && !p.cantiqueBaoule" class="text-gray-400">—</span>
            </td>
            <td class="px-4 py-3">
              <div v-if="p.roles?.length" class="space-y-0.5">
                <p v-for="r in p.roles.slice(0, 3)" :key="r.id" class="text-xs text-gray-600">
                  <span class="font-medium">{{ roleLabel(r.culteType, r.role) }} :</span>
                  {{ r.membre ? r.membre.nom + ' ' + r.membre.prenom : '—' }}
                </p>
                <p v-if="p.roles.length > 3" class="text-xs text-gray-400">+{{ p.roles.length - 3 }} autre(s)...</p>
              </div>
              <span v-else class="text-gray-400 text-xs">Non assigné</span>
            </td>
            <td class="px-4 py-3">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusColor(p.status)]">
                {{ statusLabel(p.status) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button @click="printSingle(p)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg" title="Imprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
                <button @click="editProgramme(p)" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg" title="Modifier">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button @click="deleteProgramme(p)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg" title="Supprimer">
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
      <p class="text-sm text-gray-500">Page {{ currentPage }} / {{ totalPages }} — {{ filteredProgrammes.length }} programme(s)</p>
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
import ProgrammeForm from '~/components/ProgrammeForm.vue'

const showForm = ref(false)
const programmes = ref([])
const isLoading = ref(true)
const search = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const programmeToEdit = ref(null)

const fetchProgrammes = async () => {
  isLoading.value = true
  try { programmes.value = await $fetch('/api/programmes') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}
fetchProgrammes()

const onSaved = () => { closeForm(); fetchProgrammes() }
const closeForm = () => { showForm.value = false; programmeToEdit.value = null }
const editProgramme = (p) => { programmeToEdit.value = p; showForm.value = true; window.scrollTo({ top: 0, behavior: 'smooth' }) }

const deleteProgramme = async (p) => {
  if (!confirm(`Supprimer le programme du ${formatDate(p.date)} ?`)) return
  try { await $fetch(`/api/programmes/${p.id}`, { method: 'DELETE' }); fetchProgrammes() }
  catch (e) { alert('Erreur lors de la suppression') }
}

const filteredProgrammes = computed(() => {
  let r = programmes.value
  if (search.value) {
    const t = search.value.toLowerCase()
    r = r.filter(p =>
      p.semaine?.toLowerCase().includes(t) ||
      p.theme?.toLowerCase().includes(t) ||
      p.cantiqueFrancais?.toLowerCase().includes(t) ||
      p.roles?.some(role => role.membre?.nom?.toLowerCase().includes(t) || role.membre?.prenom?.toLowerCase().includes(t))
    )
  }
  if (statusFilter.value !== 'all') r = r.filter(p => p.status === statusFilter.value)
  return [...r].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPages = computed(() => Math.ceil(filteredProgrammes.value.length / itemsPerPage.value) || 1)
const paginatedProgrammes = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage.value
  return filteredProgrammes.value.slice(s, s + itemsPerPage.value)
})
watch([search, statusFilter], () => { currentPage.value = 1 })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const statusLabel = (s) => ({ PLANIFIE: 'Planifié', EN_COURS: 'En cours', TERMINE: 'Terminé', ANNULE: 'Annulé' }[s] || s)
const statusColor = (s) => ({ PLANIFIE: 'bg-yellow-100 text-yellow-800', EN_COURS: 'bg-blue-100 text-blue-800', TERMINE: 'bg-green-100 text-green-800', ANNULE: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-700')

const culteTypeLabel = (ct) => ({ PREMIER: '1er Culte', DEUXIEME: '2ème Culte', TROISIEME: '3ème Culte' }[ct] || ct)
const roleLabel = (ct, role) => `${culteTypeLabel(ct)} — ${({ PRESIDENT: 'Président', ANNONCES: 'Annonces', PREDICATEUR: 'Prédicateur', LOUANGE: 'Louange' }[role] || role)}`

const openPrint = (html) => {
  const w = window.open('', '_blank')
  if (!w) { alert('Autorisez les pop-ups pour imprimer'); return }
  w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500)
}

const printSingle = (p) => {
  const rolesByType = (type) => p.roles?.filter(r => r.culteType === type) || []
  const renderRoles = (roles) => roles.length ? roles.map(r => `<p><strong>${{ PRESIDENT: 'Président', ANNONCES: 'Annonces', PREDICATEUR: 'Prédicateur', LOUANGE: 'Louange' }[r.role] || r.role} :</strong> ${r.membre ? r.membre.nom + ' ' + r.membre.prenom : '—'} ${r.heure ? '(' + r.heure + ')' : ''}</p>`).join('') : '<p style="color:#999;font-style:italic">Non assigné</p>'

  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Programme ${formatDate(p.date)}</title>
  <style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:30px;color:#333}
  h1{color:#2563eb;border-bottom:3px solid #2563eb;padding-bottom:10px}
  .section{margin:20px 0}.section h2{color:#2563eb;font-size:16px;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
  .info-box{background:#f8f9fa;padding:12px;border-left:4px solid #2563eb;border-radius:5px;margin-bottom:10px}
  </style></head><body>
  <h1>📅 Programme du ${formatDate(p.date)}</h1>
  <div class="info-box">
    <p><strong>Semaine :</strong> ${p.semaine || '—'} | <strong>Thème :</strong> ${p.theme || '—'} | <strong>Statut :</strong> ${statusLabel(p.status)}</p>
    <p><strong>Généré le :</strong> ${currentDate}</p>
  </div>
  ${p.cantiqueFrancais || p.cantiqueBaoule ? `<div class="section"><h2>🎵 Cantiques</h2>
    ${p.cantiqueFrancais ? `<p>🇫🇷 <strong>Français :</strong> ${p.cantiqueFrancais} ${p.cantiqueFrancaisRef ? '(Réf. ' + p.cantiqueFrancaisRef + ')' : ''}</p>` : ''}
    ${p.cantiqueBaoule ? `<p>🇨🇮 <strong>Baoulé :</strong> ${p.cantiqueBaoule} ${p.cantiqueBaouleRef ? '(Réf. ' + p.cantiqueBaouleRef + ')' : ''}</p>` : ''}
  </div>` : ''}
  <div class="section"><h2>🌅 Premier Culte</h2>${renderRoles(rolesByType('PREMIER'))}</div>
  <div class="section"><h2>☀️ Deuxième Culte</h2>${renderRoles(rolesByType('DEUXIEME'))}</div>
  <div class="section"><h2>🌙 Troisième Culte</h2>${renderRoles(rolesByType('TROISIEME'))}</div>
  ${p.notes ? `<div class="section"><h2>📝 Notes</h2><p>${p.notes}</p></div>` : ''}
  </body></html>`)
}

const printAll = () => {
  const body = filteredProgrammes.value.map((p, i) => `
    <div style="margin-bottom:25px;page-break-inside:avoid">
      <div style="background:#f8f9fa;padding:12px;border-left:4px solid #2563eb;border-radius:5px">
        <h2 style="margin:0;color:#2563eb">${i + 1}. ${formatDate(p.date)}</h2>
        <p style="color:#666;font-size:13px;margin:4px 0">Semaine : ${p.semaine || '—'} | Thème : ${p.theme || '—'} | Statut : ${statusLabel(p.status)}</p>
      </div>
      ${p.roles?.length ? `<div style="margin-top:8px">${p.roles.map(r => `<p style="margin:2px 0;font-size:13px"><strong>${roleLabel(r.culteType, r.role)} :</strong> ${r.membre ? r.membre.nom + ' ' + r.membre.prenom : '—'}</p>`).join('')}</div>` : ''}
      <hr style="border:none;border-top:1px dashed #ccc;margin-top:15px">
    </div>`).join('')
  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Programmes</title>
  <style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:20px;color:#333}h1{color:#2563eb;text-align:center}</style></head>
  <body><h1>📅 Programmes des Cultes</h1>
  <p style="text-align:center;color:#666">Généré le ${currentDate} — ${filteredProgrammes.value.length} programme(s)</p>${body}</body></html>`)
}
</script>
