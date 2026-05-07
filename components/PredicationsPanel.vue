<template>
  <section class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">📖 Prédications</h2>
        <p class="text-gray-500 text-sm mt-1">Gestion des prédications de l'église</p>
      </div>
      <div class="flex gap-2">
        <button @click="printAll" :disabled="filteredPredications.length === 0"
          class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-1 disabled:opacity-50">
          🖨️ Imprimer tout
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
        <input v-model="search" type="text" placeholder="Rechercher (titre, texte, prédicateur...)"
          class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm transition" />
      </div>
      <select v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm transition">
        <option value="">Trier par...</option>
        <option value="titre">Titre</option>
        <option value="texteBiblique">Texte biblique</option>
      </select>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-5">
      <PredicationForm :existingData="predicationToEdit" @saved="onSaved" @cancel="closeForm" />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Vide -->
    <div v-else-if="filteredPredications.length === 0" class="text-center py-10 text-gray-400">
      <svg class="mx-auto w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p>{{ search ? 'Aucune prédication trouvée' : 'Aucune prédication enregistrée' }}</p>
    </div>

    <!-- Tableau -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Texte biblique</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Culte</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prédicateur</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Résumé</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="p in paginatedPredications" :key="p.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900 max-w-[180px]">
              <p class="truncate" :title="p.titre">{{ p.titre }}</p>
            </td>
            <td class="px-4 py-3 text-blue-700 font-medium">{{ p.texteBiblique }}</td>
            <td class="px-4 py-3 text-gray-600 text-xs">
              <span v-if="p.culte">{{ formatDate(p.culte.dateCulte) }}<br/>{{ p.culte.themePrincipal }}</span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-4 py-3 text-gray-700">
              {{ p.predicateur ? p.predicateur.nom + ' ' + p.predicateur.prenom : '—' }}
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs max-w-[160px]">
              <p class="truncate" :title="stripHtml(p.resume)">{{ truncate(stripHtml(p.resume), 60) }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button @click="printSingle(p)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Imprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button @click="editPredication(p)" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition" title="Modifier">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="notifierPredication(p)" :disabled="notifying === p.id" title="Notifier les membres" class="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition disabled:opacity-50">
                  <span v-if="notifying === p.id" class="text-xs">⏳</span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </button>
                <button @click="deletePredication(p)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Supprimer">
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
      <p class="text-sm text-gray-500">Page {{ currentPage }} / {{ totalPages }} — {{ filteredPredications.length }} prédication(s)</p>
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
import PredicationForm from '~/components/PredicationForm.vue'

const showForm = ref(false)
const predications = ref([])
const isLoading = ref(true)
const search = ref('')
const sortField = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const predicationToEdit = ref(null)

const fetchPredications = async () => {
  isLoading.value = true
  try { predications.value = await $fetch('/api/predications') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}
fetchPredications()

const onSaved = () => { closeForm(); fetchPredications() }
const closeForm = () => { showForm.value = false; predicationToEdit.value = null }
const editPredication = (p) => { predicationToEdit.value = p; showForm.value = true; window.scrollTo({ top: 0, behavior: 'smooth' }) }

const notifying = ref(null)
const notifierPredication = async (p) => {
  if (!confirm(`Notifier tous les membres pour la prédication "${p.titre}" ?`)) return
  notifying.value = p.id
  try {
    const result = await $fetch('/api/emails/notify-predication', { method: 'POST', body: { predicationId: p.id } })
    alert(`✅ Notification envoyée à ${result.envoyes} membre(s) !`)
  } catch (e) { alert(`❌ ${e.data?.message || e.message}`) }
  finally { notifying.value = null }
}

const deletePredication = async (p) => {
  if (!confirm(`Supprimer la prédication "${p.titre}" ?`)) return
  try { await $fetch(`/api/predications/${p.id}`, { method: 'DELETE' }); fetchPredications() }
  catch (e) { alert('Erreur lors de la suppression') }
}

const filteredPredications = computed(() => {
  let r = predications.value
  if (search.value) {
    const t = search.value.toLowerCase()
    r = r.filter(p =>
      p.titre?.toLowerCase().includes(t) ||
      p.texteBiblique?.toLowerCase().includes(t) ||
      p.predicateur?.nom?.toLowerCase().includes(t) ||
      p.predicateur?.prenom?.toLowerCase().includes(t) ||
      p.culte?.themePrincipal?.toLowerCase().includes(t)
    )
  }
  if (sortField.value) r = [...r].sort((a, b) => (a[sortField.value] || '').localeCompare(b[sortField.value] || ''))
  return r
})

const totalPages = computed(() => Math.ceil(filteredPredications.value.length / itemsPerPage.value) || 1)
const paginatedPredications = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage.value
  return filteredPredications.value.slice(s, s + itemsPerPage.value)
})
watch([search, sortField], () => { currentPage.value = 1 })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const stripHtml = (h) => h ? h.replace(/<[^>]*>/g, '') : ''
const truncate = (t, n) => !t ? '' : t.length > n ? t.slice(0, n) + '...' : t

const currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const openPrint = (html) => {
  const w = window.open('', '_blank')
  if (!w) { alert('Autorisez les pop-ups pour imprimer'); return }
  w.document.write(html); w.document.close()
  setTimeout(() => w.print(), 500)
}

const printSingle = (p) => {
  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${p.titre}</title>
  <style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:30px;color:#333}
  h1{color:#2563eb;border-bottom:3px solid #2563eb;padding-bottom:10px}
  .meta{background:#f8f9fa;padding:15px;border-left:4px solid #2563eb;margin:20px 0;border-radius:5px}
  .meta p{margin:5px 0}.section h2{color:#2563eb;border-bottom:1px solid #ddd;padding-bottom:5px}
  </style></head><body>
  <h1>${p.titre}</h1>
  <div class="meta">
    <p><strong>📖 Texte :</strong> ${p.texteBiblique}</p>
    <p><strong>👤 Prédicateur :</strong> ${p.predicateur ? p.predicateur.nom + ' ' + p.predicateur.prenom : '—'}</p>
    <p><strong>⛪ Culte :</strong> ${p.culte ? formatDate(p.culte.dateCulte) + ' — ' + (p.culte.themePrincipal || '') : '—'}</p>
    <p><strong>📅 Généré le :</strong> ${currentDate}</p>
  </div>
  ${p.resume ? `<div class="section"><h2>Résumé</h2>${p.resume}</div>` : ''}
  ${p.message ? `<div class="section"><h2>Message complet</h2>${p.message}</div>` : ''}
  </body></html>`)
}

const printAll = () => {
  const body = filteredPredications.value.map((p, i) => `
    <div style="margin-bottom:30px;page-break-inside:avoid">
      <div style="background:#f8f9fa;padding:12px;border-left:4px solid #2563eb;margin-bottom:10px">
        <h2 style="margin:0;color:#2563eb">${i + 1}. ${p.titre}</h2>
        <p style="margin:5px 0;color:#666;font-size:14px">
          ${p.texteBiblique} | ${p.predicateur ? p.predicateur.nom + ' ' + p.predicateur.prenom : '—'} | ${p.culte ? formatDate(p.culte.dateCulte) : '—'}
        </p>
      </div>
      ${p.resume ? `<p><strong>Résumé :</strong> ${stripHtml(p.resume)}</p>` : ''}
      <hr style="border:none;border-top:1px dashed #ccc;margin-top:20px">
    </div>`).join('')
  openPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Prédications</title>
  <style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:20px;color:#333}
  h1{color:#2563eb;text-align:center}</style></head><body>
  <h1>📖 Liste des Prédications</h1>
  <p style="text-align:center;color:#666">Généré le ${currentDate} — ${filteredPredications.value.length} prédication(s)</p>
  ${body}</body></html>`)
}
</script>
