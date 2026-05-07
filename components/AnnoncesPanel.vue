<template>
  <section class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">📢 Annonces</h2>
        <p class="text-gray-500 text-sm mt-1">Gestion des annonces de l'église</p>
      </div>
      <div class="flex gap-2">
        <button @click="printAll" :disabled="filteredAnnonces.length === 0"
          class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50">
          🖨️ Tout imprimer
        </button>
        <button @click="showForm = !showForm"
          class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ showForm ? 'Fermer' : '➕ Nouvelle' }}
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-3 mb-5">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="Rechercher (titre, contenu, messager...)"
          class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-sm transition" />
      </div>
      <select v-model="statusFilter"
        class="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none text-sm transition">
        <option value="all">Tous les états</option>
        <option value="hasCompteRendu">Avec compte rendu</option>
        <option value="noCompteRendu">Sans compte rendu</option>
      </select>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-5">
      <AnnonceForm :existingData="annonceToEdit" @saved="onSaved" @cancel="closeForm" />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>

    <!-- Vide -->
    <div v-else-if="filteredAnnonces.length === 0" class="text-center py-10 text-gray-400">
      <svg class="mx-auto w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
      <p>{{ search ? 'Aucune annonce trouvée' : 'Aucune annonce enregistrée' }}</p>
    </div>

    <!-- Cards mobile -->
    <div v-else class="sm:hidden space-y-3">
      <div v-for="a in paginatedAnnonces" :key="a.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-semibold text-gray-800">{{ a.titre }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">
              Culte : {{ a.culte ? formatDate(a.culte.dateCulte) : '#' + a.culteId }}
            </p>
          </div>
          <span v-if="a.compteRendu" class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">CR ✓</span>
        </div>
        <p v-if="a.infosJour" class="text-sm text-gray-600 truncate">{{ truncate(stripHtml(a.infosJour), 60) }}</p>
        <div class="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
          <button @click="printSingle(a)" class="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></button>
          <button @click="editAnnonce(a)" class="p-1.5 bg-green-50 text-green-600 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
          <button @click="deleteAnnonce(a)" class="p-1.5 bg-red-50 text-red-600 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
        </div>
      </div>
    </div>

    <!-- Tableau desktop -->
    <div v-if="!isLoading && filteredAnnonces.length > 0" class="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Culte</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Compte Rendu</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Infos du jour</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="a in paginatedAnnonces" :key="a.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900">{{ a.titre }}</td>
            <td class="px-4 py-3 text-gray-600 text-xs">
              <span v-if="a.culte">{{ formatDate(a.culte.dateCulte) }}<br/>{{ a.culte.themePrincipal }}</span>
              <span v-else class="text-gray-400">#{{ a.culteId }}</span>
            </td>
            <td class="px-4 py-3">
              <div v-if="a.compteRendu?.messager" class="text-xs">
                <p class="font-medium text-gray-700">{{ a.compteRendu.messager }}</p>
                <p v-if="a.compteRendu.assistanceTotale" class="text-gray-500">👥 {{ a.compteRendu.assistanceTotale }} pers.</p>
              </div>
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs max-w-[200px]">
              <p class="truncate">{{ truncate(stripHtml(a.infosJour), 60) }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button @click="printSingle(a)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg" title="Imprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
                <button @click="editAnnonce(a)" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg" title="Modifier">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button @click="notifierAnnonce(a)" :disabled="notifying === a.id" title="Notifier les membres" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition disabled:opacity-50">
                  <span v-if="notifying === a.id" class="text-xs">⏳</span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </button>
                <button @click="deleteAnnonce(a)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg" title="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">{{ startIndex + 1 }}–{{ Math.min(endIndex, filteredAnnonces.length) }} sur {{ filteredAnnonces.length }}</p>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm transition">← Précédent</button>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 text-sm transition">Suivant →</button>
      </div>
      <select v-model="itemsPerPage" class="px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none">
        <option :value="10">10/page</option><option :value="20">20/page</option><option :value="50">50/page</option>
      </select>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AnnonceForm from '~/components/AnnonceForm.vue'

const showForm = ref(false)
const annonces = ref([])
const isLoading = ref(true)
const search = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const annonceToEdit = ref(null)

const fetchAnnonces = async () => {
  isLoading.value = true
  try { annonces.value = await $fetch('/api/annonces') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}
fetchAnnonces()

const onSaved = () => { closeForm(); fetchAnnonces() }
const closeForm = () => { showForm.value = false; annonceToEdit.value = null }
const editAnnonce = (a) => { annonceToEdit.value = a; showForm.value = true; window.scrollTo({ top: 0, behavior: 'smooth' }) }

const notifying = ref(null)
const notifierAnnonce = async (a) => {
  if (!confirm(`Notifier tous les membres pour l'annonce "${a.titre}" ?`)) return
  notifying.value = a.id
  try {
    const result = await $fetch('/api/emails/notify-annonce', { method: 'POST', body: { annonceId: a.id } })
    if (result.success) {
      alert(`✅ Notification envoyée à ${result.envoyes} membre(s) !`)
    } else {
      alert(`ℹ️ ${result.message}`)
    }
  } catch (e) { alert(`❌ ${e.data?.message || e.message}`) }
  finally { notifying.value = null }
}

const deleteAnnonce = async (a) => {
  if (!confirm(`Supprimer l'annonce "${a.titre}" ?`)) return
  try { await $fetch(`/api/annonces/${a.id}`, { method: 'DELETE' }); fetchAnnonces() }
  catch (e) { alert('Erreur lors de la suppression') }
}

const filteredAnnonces = computed(() => {
  let r = annonces.value
  if (search.value) {
    const t = search.value.toLowerCase()
    r = r.filter(a =>
      a.titre?.toLowerCase().includes(t) ||
      a.infosJour?.toLowerCase().includes(t) ||
      a.remerciements?.toLowerCase().includes(t) ||
      a.compteRendu?.messager?.toLowerCase().includes(t) ||
      a.compteRendu?.theme?.toLowerCase().includes(t)
    )
  }
  if (statusFilter.value === 'hasCompteRendu') r = r.filter(a => a.compteRendu?.messager || a.compteRendu?.texteBiblique)
  if (statusFilter.value === 'noCompteRendu') r = r.filter(a => !a.compteRendu?.messager && !a.compteRendu?.texteBiblique)
  return r
})

const totalPages = computed(() => Math.ceil(filteredAnnonces.value.length / itemsPerPage.value) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const paginatedAnnonces = computed(() => filteredAnnonces.value.slice(startIndex.value, endIndex.value))
watch([search, statusFilter, itemsPerPage], () => { currentPage.value = 1 })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const stripHtml = (h) => h ? h.replace(/<[^>]*>/g, '') : ''
const truncate = (t, n) => !t ? '' : t.length > n ? t.slice(0, n) + '...' : t
const currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const openPrint = (html) => {
  const w = window.open('', '_blank')
  if (!w) { alert('Autorisez les pop-ups pour imprimer'); return }
  w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500)
}

const printSingle = (a) => {
  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${a.titre}</title>
  <style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:30px;color:#333}
  h1{color:#16a34a;border-bottom:3px solid #16a34a;padding-bottom:10px}
  .meta{background:#f0fdf4;padding:12px;border-left:4px solid #16a34a;border-radius:5px;margin:15px 0}
  .section{margin:20px 0}.section h2{color:#16a34a;font-size:16px;border-bottom:1px solid #ddd;padding-bottom:5px}
  </style></head><body>
  <h1>${a.titre}</h1>
  <div class="meta">
    <p><strong>Culte :</strong> ${a.culte ? formatDate(a.culte.dateCulte) + ' — ' + (a.culte.themePrincipal || '') : '#' + a.culteId}</p>
    <p><strong>Généré le :</strong> ${currentDate}</p>
  </div>
  ${a.compteRendu ? `<div class="section"><h2>📊 Compte Rendu</h2>
    ${a.compteRendu.messager ? `<p><strong>Messager :</strong> ${a.compteRendu.messager}</p>` : ''}
    ${a.compteRendu.texteBiblique ? `<p><strong>Texte biblique :</strong> ${a.compteRendu.texteBiblique}</p>` : ''}
    ${a.compteRendu.assistanceTotale ? `<p><strong>Assistance :</strong> ${a.compteRendu.assistanceTotale} personnes</p>` : ''}
    ${a.compteRendu.theme ? `<p><strong>Thème :</strong> ${a.compteRendu.theme}</p>` : ''}
  </div>` : ''}
  ${a.infosJour ? `<div class="section"><h2>📅 Informations du jour</h2>${a.infosJour}</div>` : ''}
  ${a.remerciements ? `<div class="section"><h2>🙏 Remerciements</h2>${a.remerciements}</div>` : ''}
  ${a.rappels ? `<div class="section"><h2>🔔 Rappels</h2>${a.rappels}</div>` : ''}
  ${a.commentaires ? `<div class="section"><h2>💬 Commentaires</h2>${a.commentaires}</div>` : ''}
  </body></html>`)
}

const printAll = () => {
  const body = filteredAnnonces.value.map((a, i) => `
    <div style="margin-bottom:25px;page-break-inside:avoid;border-left:4px solid #16a34a;padding-left:12px">
      <h2 style="color:#16a34a;margin-bottom:5px">${i + 1}. ${a.titre}</h2>
      <p style="color:#666;font-size:13px">Culte : ${a.culte ? formatDate(a.culte.dateCulte) : '#' + a.culteId}</p>
      ${a.compteRendu?.messager ? `<p><strong>Messager :</strong> ${a.compteRendu.messager} | <strong>Assistance :</strong> ${a.compteRendu.assistanceTotale || '—'}</p>` : ''}
      ${a.infosJour ? `<p><strong>Infos :</strong> ${truncate(stripHtml(a.infosJour), 100)}</p>` : ''}
      <hr style="border:none;border-top:1px dashed #ccc;margin-top:15px">
    </div>`).join('')
  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Annonces</title>
  <style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:20px;color:#333}h1{color:#16a34a;text-align:center}</style></head>
  <body><h1>📢 Liste des Annonces</h1>
  <p style="text-align:center;color:#666">Généré le ${currentDate} — ${filteredAnnonces.value.length} annonce(s)</p>${body}</body></html>`)
}
</script>
