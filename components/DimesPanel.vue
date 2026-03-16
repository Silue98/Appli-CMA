<template>
  <section class="w-full space-y-5">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">💎 Suivi des Dîmes</h2>
          <p class="text-gray-500 text-sm mt-1">Dîmes nominatives par membre</p>
        </div>
        <div class="flex gap-2">
          <select v-model="anneeSelectionnee" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 outline-none">
            <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
          </select>
          <select v-model="moisSelectionne" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 outline-none">
            <option value="">Tous les mois</option>
            <option v-for="m in moisListe" :key="m.val" :value="m.val">{{ m.label }}</option>
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <p class="text-xs text-purple-600 mb-1">Total perçu</p>
          <p class="text-xl font-bold text-purple-700">{{ formatMontant(totalPercu) }}</p>
        </div>
        <div class="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p class="text-xs text-green-600 mb-1">Payé ce mois</p>
          <p class="text-xl font-bold text-green-700">{{ payesMois }}</p>
        </div>
        <div class="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p class="text-xs text-red-600 mb-1">En attente</p>
          <p class="text-xl font-bold text-red-600">{{ members.length - payesMois }}</p>
        </div>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p class="text-xs text-blue-600 mb-1">Taux paiement</p>
          <p class="text-xl font-bold text-blue-700">{{ members.length ? Math.round(payesMois / members.length * 100) : 0 }}%</p>
        </div>
      </div>

      <!-- Recherche -->
      <div class="relative mb-4">
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" placeholder="Rechercher un membre..." class="pl-9 w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 outline-none"/>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>

      <!-- Tableau dîmes -->
      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Membre</th>
              <th v-if="!moisSelectionne" v-for="m in moisListe" :key="m.val" class="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase">{{ m.court }}</th>
              <th v-else class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Montant</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Statut</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="m in filteredMembers" :key="m.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', m.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                    {{ m.prenom?.charAt(0) }}{{ m.nom?.charAt(0) }}
                  </div>
                  <span class="font-medium text-gray-800">{{ m.nom }} {{ m.prenom }}</span>
                </div>
              </td>
              <template v-if="!moisSelectionne">
                <td v-for="mo in moisListe" :key="mo.val" class="px-2 py-3 text-center">
                  <button @click="toggleDime(m.id, mo.val)"
                    :class="['w-7 h-7 rounded-full text-xs font-bold transition', getDime(m.id, mo.val)?.paye ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200']">
                    {{ getDime(m.id, mo.val)?.paye ? '✓' : '○' }}
                  </button>
                </td>
              </template>
              <template v-else>
                <td class="px-4 py-3 text-center">
                  <input type="number" :value="getDime(m.id, Number(moisSelectionne))?.montant || ''"
                    @change="saveDimeMontant(m.id, Number(moisSelectionne), $event.target.value)"
                    placeholder="Montant" class="w-24 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-purple-400 outline-none"/>
                </td>
              </template>
              <td class="px-4 py-3 text-center">
                <span v-if="moisSelectionne">
                  <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', getDime(m.id, Number(moisSelectionne))?.paye ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                    {{ getDime(m.id, Number(moisSelectionne))?.paye ? '✅ Payé' : '❌ En attente' }}
                  </span>
                </span>
                <span v-else class="text-xs text-gray-400">{{ dimesPayees(m.id) }}/12</span>
              </td>
              <td class="px-4 py-3 text-right">
                <button v-if="moisSelectionne" @click="toggleDime(m.id, Number(moisSelectionne))"
                  :class="['px-3 py-1 rounded-lg text-xs font-medium transition', getDime(m.id, Number(moisSelectionne))?.paye ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100']">
                  {{ getDime(m.id, Number(moisSelectionne))?.paye ? '↩️ Annuler' : '✅ Marquer payé' }}
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
import { ref, computed, onMounted, watch } from 'vue'

const members = ref([])
const dimes = ref([])
const isLoading = ref(true)
const search = ref('')
const anneeSelectionnee = ref(new Date().getFullYear())
const moisSelectionne = ref(String(new Date().getMonth() + 1))

const annees = computed(() => {
  const a = []; for (let i = new Date().getFullYear(); i >= 2020; i--) a.push(i); return a
})

const moisListe = [
  { val: 1, label: 'Janvier', court: 'Jan' }, { val: 2, label: 'Février', court: 'Fév' },
  { val: 3, label: 'Mars', court: 'Mar' }, { val: 4, label: 'Avril', court: 'Avr' },
  { val: 5, label: 'Mai', court: 'Mai' }, { val: 6, label: 'Juin', court: 'Jun' },
  { val: 7, label: 'Juillet', court: 'Jul' }, { val: 8, label: 'Août', court: 'Aoû' },
  { val: 9, label: 'Septembre', court: 'Sep' }, { val: 10, label: 'Octobre', court: 'Oct' },
  { val: 11, label: 'Novembre', court: 'Nov' }, { val: 12, label: 'Décembre', court: 'Déc' }
]

const filteredMembers = computed(() => {
  if (!search.value) return members.value
  const t = search.value.toLowerCase()
  return members.value.filter(m => m.nom?.toLowerCase().includes(t) || m.prenom?.toLowerCase().includes(t))
})

const getDime = (membreId, mois) => dimes.value.find(d => d.membreId === membreId && d.mois === mois && d.annee === anneeSelectionnee.value)
const dimesPayees = (membreId) => dimes.value.filter(d => d.membreId === membreId && d.annee === anneeSelectionnee.value && d.paye).length
const payesMois = computed(() => {
  if (!moisSelectionne.value) return 0
  return members.value.filter(m => getDime(m.id, Number(moisSelectionne.value))?.paye).length
})
const totalPercu = computed(() => dimes.value.filter(d => d.paye && d.annee === anneeSelectionnee.value).reduce((s, d) => s + (d.montant || 0), 0))

const charger = async () => {
  isLoading.value = true
  try {
    const [m, d] = await Promise.all([
      $fetch('/api/membres'),
      $fetch(`/api/dimes?annee=${anneeSelectionnee.value}`)
    ])
    members.value = m || []; dimes.value = d || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)
watch(anneeSelectionnee, charger)

const toggleDime = async (membreId, mois) => {
  const existing = getDime(membreId, mois)
  try {
    const result = await $fetch('/api/dimes', {
      method: 'POST',
      body: { membreId, mois, annee: anneeSelectionnee.value, montant: existing?.montant || 0, paye: !existing?.paye }
    })
    const idx = dimes.value.findIndex(d => d.membreId === membreId && d.mois === mois && d.annee === anneeSelectionnee.value)
    if (idx >= 0) dimes.value[idx] = result
    else dimes.value.push(result)
  } catch (e) { console.error(e) }
}

const saveDimeMontant = async (membreId, mois, montant) => {
  try {
    const result = await $fetch('/api/dimes', {
      method: 'POST',
      body: { membreId, mois, annee: anneeSelectionnee.value, montant: Number(montant), paye: getDime(membreId, mois)?.paye || false }
    })
    const idx = dimes.value.findIndex(d => d.membreId === membreId && d.mois === mois && d.annee === anneeSelectionnee.value)
    if (idx >= 0) dimes.value[idx] = result
    else dimes.value.push(result)
  } catch (e) { console.error(e) }
}

const formatMontant = (v) => v ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA' : '0 FCFA'
</script>
