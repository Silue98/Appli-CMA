<template>
  <section class="w-full space-y-5">

    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-800">✝️ {{ editItem ? 'Modifier l\'acte' : 'Enregistrer un acte pastoral' }}</h2>
        <button @click="closeForm" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Type d'acte <span class="text-red-500">*</span></label>
          <select v-model="form.type" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm">
            <option value="MARIAGE">💍 Mariage</option>
            <option value="BAPTEME_EAU">💧 Baptême par l'eau</option>
            <option value="BAPTEME_ESPRIT">🔥 Baptême du Saint-Esprit</option>
            <option value="FUNERAILLES">🕊️ Funérailles</option>
            <option value="DEDICACE_ENFANT">🍼 Dédicace d'enfant</option>
            <option value="RECEPTION_MEMBRE">🤝 Réception de membre</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date <span class="text-red-500">*</span></label>
          <input v-model="form.date" type="date" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Officiant <span class="text-red-500">*</span></label>
          <input v-model="form.officiant" placeholder="Nom du pasteur/officiant" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Lieu</label>
          <input v-model="form.lieu" placeholder="Église, salle, cimetière..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Membre concerné</label>
          <select v-model="form.membreId" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm">
            <option value="">— Choisir —</option>
            <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Témoin</label>
          <select v-model="form.temoinId" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm">
            <option value="">— Aucun —</option>
            <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
          </select>
        </div>
        <!-- Champs mariage -->
        <div v-if="form.type === 'MARIAGE'">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom conjoint(e)</label>
          <input v-model="form.conjointNom" placeholder="Nom" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm"/>
        </div>
        <div v-if="form.type === 'MARIAGE'">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Prénom conjoint(e)</label>
          <input v-model="form.conjointPrenom" placeholder="Prénom" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm"/>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea v-model="form.notes" rows="2" placeholder="Observations, détails..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-sm resize-none"></textarea>
        </div>
      </div>
      <div v-if="formError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ formError }}</div>
      <div class="flex gap-2 mt-5">
        <button @click="save" :disabled="isSaving" class="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition disabled:opacity-60">
          {{ isSaving ? 'Enregistrement...' : '💾 Enregistrer' }}
        </button>
        <button @click="closeForm" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">Annuler</button>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">✝️ Actes Pastoraux</h2>
          <p class="text-gray-500 text-sm mt-1">Registre officiel — Mariages, Baptêmes, Funérailles...</p>
        </div>
        <button @click="ouvrirNouveauForm" class="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition text-sm font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouvel acte
        </button>
      </div>

      <!-- Stats par type -->
      <div class="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        <div v-for="t in typesActes" :key="t.val" @click="filtreType = filtreType === t.val ? '' : t.val"
          :class="['p-3 rounded-xl text-center cursor-pointer transition border', filtreType === t.val ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:bg-gray-50']">
          <p class="text-xl">{{ t.icon }}</p>
          <p class="text-xs text-gray-600 mt-1">{{ t.label }}</p>
          <p class="text-sm font-bold text-gray-800">{{ actes.filter(a => a.type === t.val).length }}</p>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>

      <div v-else-if="actesFiltres.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">✝️</span>
        <p>Aucun acte enregistré</p>
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Concerné</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Officiant</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Lieu</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="a in actesFiltres" :key="a.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-700">{{ formatDate(a.date) }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', typeBadge(a.type)]">
                  {{ typeIcon(a.type) }} {{ typeLabel(a.type) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span v-if="a.membre">{{ a.membre.nom }} {{ a.membre.prenom }}</span>
                <span v-else-if="a.type === 'MARIAGE' && a.conjointNom">{{ a.conjointNom }} & ...</span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden md:table-cell">{{ a.officiant }}</td>
              <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">{{ a.lieu || '—' }}</td>
              <td class="px-4 py-3">
                <button @click="supprimer(a)" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition float-right">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
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

const actes = ref([])
const membres = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const formError = ref('')
const filtreType = ref('')

const form = reactive({ type: 'BAPTEME_EAU', date: '', officiant: '', lieu: '', membreId: '', temoinId: '', conjointNom: '', conjointPrenom: '', notes: '' })

const typesActes = [
  { val: 'MARIAGE', icon: '💍', label: 'Mariages' },
  { val: 'BAPTEME_EAU', icon: '💧', label: 'Baptêmes eau' },
  { val: 'BAPTEME_ESPRIT', icon: '🔥', label: 'Baptêmes ES' },
  { val: 'FUNERAILLES', icon: '🕊️', label: 'Funérailles' },
  { val: 'DEDICACE_ENFANT', icon: '🍼', label: 'Dédicaces' },
  { val: 'RECEPTION_MEMBRE', icon: '🤝', label: 'Réceptions' }
]

const actesFiltres = computed(() => filtreType.value ? actes.value.filter(a => a.type === filtreType.value) : actes.value)

const charger = async () => {
  isLoading.value = true
  try {
    const [a, m] = await Promise.all([$fetch('/api/actes'), $fetch('/api/membres')])
    actes.value = a || []; membres.value = m || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)

const reset = () => Object.assign(form, { type: 'BAPTEME_EAU', date: '', officiant: '', lieu: '', membreId: '', temoinId: '', conjointNom: '', conjointPrenom: '', notes: '' })
const ouvrirNouveauForm = () => { reset(); editItem.value = null; showForm.value = true }
const closeForm = () => { showForm.value = false; editItem.value = null; formError.value = '' }

const save = async () => {
  formError.value = ''
  if (!form.type || !form.date || !form.officiant) { formError.value = 'Type, date et officiant requis'; return }
  isSaving.value = true
  try {
    await $fetch('/api/actes', { method: 'POST', body: form })
    closeForm(); charger()
  } catch (e) { formError.value = e.data?.message || 'Erreur' }
  finally { isSaving.value = false }
}

const supprimer = async (a) => {
  if (!confirm(`Supprimer cet acte ?`)) return
  try { await $fetch(`/api/actes/${a.id}`, { method: 'DELETE' }); charger() }
  catch (e) { alert('Erreur') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'
const typeIcon = (t) => ({ MARIAGE:'💍', BAPTEME_EAU:'💧', BAPTEME_ESPRIT:'🔥', FUNERAILLES:'🕊️', DEDICACE_ENFANT:'🍼', RECEPTION_MEMBRE:'🤝' }[t] || '✝️')
const typeLabel = (t) => ({ MARIAGE:'Mariage', BAPTEME_EAU:'Baptême eau', BAPTEME_ESPRIT:'Baptême ES', FUNERAILLES:'Funérailles', DEDICACE_ENFANT:'Dédicace', RECEPTION_MEMBRE:'Réception' }[t] || t)
const typeBadge = (t) => ({ MARIAGE:'bg-pink-100 text-pink-700', BAPTEME_EAU:'bg-blue-100 text-blue-700', BAPTEME_ESPRIT:'bg-orange-100 text-orange-700', FUNERAILLES:'bg-gray-100 text-gray-700', DEDICACE_ENFANT:'bg-yellow-100 text-yellow-700', RECEPTION_MEMBRE:'bg-green-100 text-green-700' }[t] || 'bg-gray-100 text-gray-700')
</script>
