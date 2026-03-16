<template>
  <section class="w-full space-y-5">
    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-800">{{ editItem ? '✏️ Modifier' : '➕ Ajouter un article' }}</h2>
        <button @click="closeForm" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom <span class="text-red-500">*</span></label>
          <input v-model="form.nom" placeholder="Ex: Amplificateur JBL" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Catégorie <span class="text-red-500">*</span></label>
          <select v-model="form.categorie" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm">
            <option value="SONO">🔊 Sonorisation</option>
            <option value="INSTRUMENT">🎸 Instrument</option>
            <option value="MOBILIER">🪑 Mobilier</option>
            <option value="INFORMATIQUE">💻 Informatique</option>
            <option value="VEHICULE">🚗 Véhicule</option>
            <option value="AUTRE">📦 Autre</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Quantité</label>
          <input v-model="form.quantite" type="number" min="1" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">État</label>
          <select v-model="form.etat" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm">
            <option value="BON">✅ Bon état</option>
            <option value="MOYEN">⚠️ État moyen</option>
            <option value="MAUVAIS">❌ Mauvais état</option>
            <option value="HORS_SERVICE">🚫 Hors service</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Valeur (FCFA)</label>
          <input v-model="form.valeur" type="number" placeholder="Ex: 150000" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date d'achat</label>
          <input v-model="form.dateAchat" type="date" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Localisation</label>
          <input v-model="form.localisation" placeholder="Ex: Salle principale, bureau..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Fournisseur</label>
          <input v-model="form.fournisseur" placeholder="Ex: Maison de la sono" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Numéro de série</label>
          <input v-model="form.numeroSerie" placeholder="N° de série ou référence" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <input v-model="form.notes" placeholder="Observations..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"/>
        </div>
      </div>
      <div v-if="formError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ formError }}</div>
      <div class="flex gap-2 mt-5">
        <button @click="save" :disabled="isSaving" class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Ajouter') }}
        </button>
        <button @click="closeForm" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">📦 Inventaire</h2>
          <p class="text-gray-500 text-sm mt-1">Matériel et ressources de l'église</p>
        </div>
        <button @click="ouvrirNouveauForm" class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Ajouter un article
        </button>
      </div>

      <!-- Stats par catégorie -->
      <div class="flex flex-wrap gap-2 mb-5">
        <button @click="filtreCategorie = ''" :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition border', filtreCategorie === '' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']">
          📦 Tout ({{ inventaire.length }})
        </button>
        <button v-for="cat in categories" :key="cat.val" @click="filtreCategorie = cat.val"
          :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition border', filtreCategorie === cat.val ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']">
          {{ cat.icon }} {{ cat.label }} ({{ inventaire.filter(i => i.categorie === cat.val).length }})
        </button>
      </div>

      <!-- Valeur totale -->
      <div class="bg-red-50 border border-red-100 rounded-xl p-3 mb-5 flex items-center justify-between">
        <span class="text-sm text-red-700">💰 Valeur totale de l'inventaire</span>
        <span class="font-bold text-red-700">{{ formatMontant(valeurTotale) }}</span>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>

      <div v-else-if="inventaireFiltré.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">📦</span>
        <p>Aucun article enregistré</p>
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Article</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Catégorie</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Qté</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">État</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Valeur</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Localisation</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in inventaireFiltré" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800">{{ item.nom }}</p>
                <p v-if="item.numeroSerie" class="text-xs text-gray-400">N°{{ item.numeroSerie }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="text-sm">{{ catIcon(item.categorie) }}</span>
                <span class="text-xs text-gray-500 ml-1">{{ catLabel(item.categorie) }}</span>
              </td>
              <td class="px-4 py-3 text-center font-semibold text-gray-800">{{ item.quantite }}</td>
              <td class="px-4 py-3">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', etatBadge(item.etat)]">{{ etatLabel(item.etat) }}</span>
              </td>
              <td class="px-4 py-3 text-right text-gray-600 hidden lg:table-cell">{{ item.valeur ? formatMontant(item.valeur) : '—' }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{{ item.localisation || '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-1">
                  <button @click="ouvrirEdition(item)" class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="supprimer(item)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const inventaire = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const formError = ref('')
const filtreCategorie = ref('')

const form = reactive({ nom: '', categorie: 'SONO', quantite: 1, etat: 'BON', valeur: '', dateAchat: '', fournisseur: '', numeroSerie: '', localisation: '', notes: '' })

const categories = [
  { val: 'SONO', icon: '🔊', label: 'Sono' }, { val: 'INSTRUMENT', icon: '🎸', label: 'Instruments' },
  { val: 'MOBILIER', icon: '🪑', label: 'Mobilier' }, { val: 'INFORMATIQUE', icon: '💻', label: 'Informatique' },
  { val: 'VEHICULE', icon: '🚗', label: 'Véhicules' }, { val: 'AUTRE', icon: '📦', label: 'Autre' }
]

const inventaireFiltré = computed(() => filtreCategorie.value ? inventaire.value.filter(i => i.categorie === filtreCategorie.value) : inventaire.value)
const valeurTotale = computed(() => inventaire.value.reduce((s, i) => s + ((i.valeur || 0) * i.quantite), 0))

const charger = async () => {
  isLoading.value = true
  try { inventaire.value = await $fetch('/api/inventaire') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)

const reset = () => Object.assign(form, { nom: '', categorie: 'SONO', quantite: 1, etat: 'BON', valeur: '', dateAchat: '', fournisseur: '', numeroSerie: '', localisation: '', notes: '' })
const ouvrirNouveauForm = () => { reset(); editItem.value = null; showForm.value = true }
const ouvrirEdition = (i) => {
  editItem.value = i
  Object.assign(form, { nom: i.nom, categorie: i.categorie, quantite: i.quantite, etat: i.etat, valeur: i.valeur || '', dateAchat: i.dateAchat ? new Date(i.dateAchat).toISOString().split('T')[0] : '', fournisseur: i.fournisseur || '', numeroSerie: i.numeroSerie || '', localisation: i.localisation || '', notes: i.notes || '' })
  showForm.value = true
}
const closeForm = () => { showForm.value = false; editItem.value = null; formError.value = '' }

const save = async () => {
  formError.value = ''
  if (!form.nom || !form.categorie) { formError.value = 'Nom et catégorie requis'; return }
  isSaving.value = true
  try {
    if (editItem.value) await $fetch(`/api/inventaire/${editItem.value.id}`, { method: 'PUT', body: form })
    else await $fetch('/api/inventaire', { method: 'POST', body: form })
    closeForm(); charger()
  } catch (e) { formError.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const supprimer = async (i) => {
  if (!confirm(`Supprimer "${i.nom}" ?`)) return
  try { await $fetch(`/api/inventaire/${i.id}`, { method: 'DELETE' }); charger() }
  catch (e) { alert('Erreur') }
}

const catIcon = (c) => ({ SONO:'🔊', INSTRUMENT:'🎸', MOBILIER:'🪑', INFORMATIQUE:'💻', VEHICULE:'🚗', AUTRE:'📦' }[c] || '📦')
const catLabel = (c) => ({ SONO:'Sono', INSTRUMENT:'Instrument', MOBILIER:'Mobilier', INFORMATIQUE:'Informatique', VEHICULE:'Véhicule', AUTRE:'Autre' }[c] || c)
const etatLabel = (e) => ({ BON:'✅ Bon', MOYEN:'⚠️ Moyen', MAUVAIS:'❌ Mauvais', HORS_SERVICE:'🚫 H.S.' }[e] || e)
const etatBadge = (e) => ({ BON:'bg-green-100 text-green-700', MOYEN:'bg-yellow-100 text-yellow-700', MAUVAIS:'bg-red-100 text-red-700', HORS_SERVICE:'bg-gray-100 text-gray-600' }[e] || 'bg-gray-100 text-gray-600')
const formatMontant = (v) => v ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA' : '—'
</script>
