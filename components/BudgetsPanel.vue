<template>
  <section class="w-full space-y-5">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">📊 Budgets</h2>
          <p class="text-gray-500 text-sm mt-1">Planification budgétaire par département</p>
        </div>
        <div class="flex gap-2">
          <select v-model="annee" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none">
            <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
          </select>
          <button @click="showForm = !showForm" class="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition text-sm font-semibold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nouvelle ligne
          </button>
        </div>
      </div>

      <!-- Formulaire ajout ligne budget -->
      <div v-if="showForm" class="mb-5 bg-orange-50 border border-orange-100 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Département</label>
            <select v-model="form.departementId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white">
              <option value="">— Général —</option>
              <option v-for="d in departements" :key="d.id" :value="d.id">{{ d.icone }} {{ d.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Catégorie <span class="text-red-500">*</span></label>
            <input v-model="form.categorie" placeholder="Ex: Sonorisation, Transport..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Montant prévu (FCFA) <span class="text-red-500">*</span></label>
            <input v-model="form.montantPrevu" type="number" placeholder="Ex: 150000" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input v-model="form.description" placeholder="Notes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white"/>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="saveBudget" :disabled="isSaving" class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-60">
            {{ isSaving ? 'Enregistrement...' : '💾 Ajouter' }}
          </button>
          <button @click="showForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
        </div>
      </div>

      <!-- Résumé général -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p class="text-xs text-blue-600 mb-1">Budget total prévu {{ annee }}</p>
          <p class="text-xl font-bold text-blue-700">{{ formatMontant(totalPrevu) }}</p>
        </div>
        <div class="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p class="text-xs text-red-600 mb-1">Dépenses réelles {{ annee }}</p>
          <p class="text-xl font-bold text-red-600">{{ formatMontant(totalDepenses) }}</p>
        </div>
        <div :class="['border rounded-xl p-4 text-center', totalPrevu - totalDepenses >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100']">
          <p :class="['text-xs mb-1', totalPrevu - totalDepenses >= 0 ? 'text-green-600' : 'text-red-600']">Solde budgétaire</p>
          <p :class="['text-xl font-bold', totalPrevu - totalDepenses >= 0 ? 'text-green-700' : 'text-red-700']">
            {{ totalPrevu - totalDepenses >= 0 ? '+' : '' }}{{ formatMontant(totalPrevu - totalDepenses) }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>

      <!-- Tableau budgets -->
      <div v-else-if="budgets.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">📊</span>
        <p>Aucun budget défini pour {{ annee }}</p>
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Département</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Prévu</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="b in budgets" :key="b.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-800">{{ b.categorie }}</td>
              <td class="px-4 py-3 text-gray-500">
                <span v-if="b.departementId">{{ departements.find(d => d.id === b.departementId)?.icone }} {{ departements.find(d => d.id === b.departementId)?.nom }}</span>
                <span v-else class="text-gray-400">Général</span>
              </td>
              <td class="px-4 py-3 text-right font-semibold text-blue-700">{{ formatMontant(b.montantPrevu) }}</td>
              <td class="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{{ b.description || '—' }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="2" class="px-4 py-3 font-semibold text-gray-700">Total prévu</td>
              <td class="px-4 py-3 text-right font-bold text-gray-800">{{ formatMontant(totalPrevu) }}</td>
              <td class="hidden md:table-cell"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const budgets = ref([])
const departements = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const annee = ref(new Date().getFullYear())
const depensesData = ref([])

const annees = computed(() => { const a = []; for (let i = new Date().getFullYear() + 1; i >= 2020; i--) a.push(i); return a })
const totalPrevu = computed(() => budgets.value.reduce((s, b) => s + b.montantPrevu, 0))
const totalDepenses = computed(() => depensesData.value.reduce((s, d) => s + (d._sum?.montant || 0), 0))

const form = reactive({ departementId: '', categorie: '', montantPrevu: '', description: '' })

const charger = async () => {
  isLoading.value = true
  try {
    const [b, dep] = await Promise.all([$fetch(`/api/budgets?annee=${annee.value}`), $fetch('/api/departements')])
    budgets.value = b.budgets || []; depensesData.value = b.depenses || []; departements.value = dep || []
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(charger)
watch(annee, charger)

const saveBudget = async () => {
  if (!form.categorie || !form.montantPrevu) return
  isSaving.value = true
  try {
    await $fetch('/api/budgets', { method: 'POST', body: { ...form, annee: annee.value } })
    Object.assign(form, { departementId: '', categorie: '', montantPrevu: '', description: '' })
    showForm.value = false; charger()
  } catch (e) { console.error(e) }
  finally { isSaving.value = false }
}

const formatMontant = (v) => v ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA' : '0 FCFA'
</script>
