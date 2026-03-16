<template>
  <section class="w-full space-y-5">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">🙋 Planning Bénévoles</h2>
          <p class="text-gray-500 text-sm mt-1">Affectations de service par dimanche</p>
        </div>
        <div class="flex gap-2">
          <input v-model="dimancheSelectionne" type="date" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 outline-none" @change="charger"/>
          <button @click="showForm = !showForm" class="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition text-sm font-semibold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Affecter
          </button>
        </div>
      </div>

      <!-- Formulaire affectation -->
      <div v-if="showForm" class="mb-5 bg-cyan-50 border border-cyan-100 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Membre <span class="text-red-500">*</span></label>
            <select v-model="form.membreId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white">
              <option value="">— Choisir —</option>
              <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Service <span class="text-red-500">*</span></label>
            <select v-model="form.service" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white">
              <option value="ACCUEIL">🤝 Accueil</option>
              <option value="SONO">🔊 Sonorisation</option>
              <option value="LOUANGE">🎵 Louange</option>
              <option value="SECURITE">🛡️ Sécurité</option>
              <option value="ENFANTS">👶 Service enfants</option>
              <option value="NETTOYAGE">🧹 Nettoyage</option>
              <option value="OFFRANDE">🙏 Collecte offrandes</option>
              <option value="AUTRE">⚙️ Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Dimanche</label>
            <input v-model="form.dimanche" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"/>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="save" :disabled="isSaving" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition disabled:opacity-60">
            {{ isSaving ? '...' : '💾 Affecter' }}
          </button>
          <button @click="showForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Annuler</button>
        </div>
      </div>

      <!-- Stats services -->
      <div class="grid grid-cols-4 md:grid-cols-8 gap-2 mb-5">
        <div v-for="s in services" :key="s.val" class="p-2 rounded-lg border border-gray-200 text-center">
          <p class="text-lg">{{ s.icon }}</p>
          <p class="text-xs text-gray-500 truncate">{{ s.label }}</p>
          <p class="text-sm font-bold text-gray-800">{{ services_count(s.val) }}</p>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>

      <div v-else-if="benevoles.length === 0" class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">🙋</span>
        <p>Aucune affectation pour ce dimanche</p>
      </div>

      <div v-else>
        <div v-for="service in servicesUtilises" :key="service" class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <span>{{ serviceIcon(service) }}</span> {{ serviceLabel(service) }}
            <span class="text-xs font-normal text-gray-400">({{ benevoles.filter(b => b.service === service).length }})</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="b in benevoles.filter(bb => bb.service === service)" :key="b.id"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', b.membre?.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                {{ b.membre?.prenom?.charAt(0) }}{{ b.membre?.nom?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ b.membre?.nom }} {{ b.membre?.prenom }}</p>
                <p v-if="b.membre?.contact" class="text-xs text-gray-400">{{ b.membre?.contact }}</p>
              </div>
              <div class="flex items-center gap-1">
                <select :value="b.statut" @change="updateStatut(b.id, $event.target.value)"
                  :class="['text-xs px-1.5 py-1 rounded border outline-none', statutClass(b.statut)]">
                  <option value="PLANIFIE">📋</option>
                  <option value="CONFIRME">✅</option>
                  <option value="ABSENT">❌</option>
                </select>
                <button @click="supprimer(b)" class="p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const benevoles = ref([])
const membres = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)

const getNextSunday = () => {
  const d = new Date(); const day = d.getDay()
  const diff = day === 0 ? 0 : 7 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

const dimancheSelectionne = ref(getNextSunday())
const form = reactive({ membreId: '', service: 'ACCUEIL', dimanche: dimancheSelectionne.value })

const services = [
  { val: 'ACCUEIL', icon: '🤝', label: 'Accueil' }, { val: 'SONO', icon: '🔊', label: 'Sono' },
  { val: 'LOUANGE', icon: '🎵', label: 'Louange' }, { val: 'SECURITE', icon: '🛡️', label: 'Sécu' },
  { val: 'ENFANTS', icon: '👶', label: 'Enfants' }, { val: 'NETTOYAGE', icon: '🧹', label: 'Nettoy.' },
  { val: 'OFFRANDE', icon: '🙏', label: 'Offrande' }, { val: 'AUTRE', icon: '⚙️', label: 'Autre' }
]

const servicesUtilises = computed(() => [...new Set(benevoles.value.map(b => b.service))])
const services_count = (s) => benevoles.value.filter(b => b.service === s).length

const charger = async () => {
  isLoading.value = true
  try { benevoles.value = await $fetch(`/api/benevoles?dimanche=${dimancheSelectionne.value}`) || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(async () => {
  try { membres.value = await $fetch('/api/membres') || [] } catch {}
  await charger()
})

const save = async () => {
  if (!form.membreId || !form.service || !form.dimanche) return
  isSaving.value = true
  try { await $fetch('/api/benevoles', { method: 'POST', body: form }); showForm.value = false; charger() }
  catch (e) { alert(e.data?.message || 'Erreur') }
  finally { isSaving.value = false }
}

const updateStatut = async (id, statut) => {
  try { await $fetch(`/api/benevoles/${id}`, { method: 'PUT', body: { statut } }); charger() }
  catch (e) { console.error(e) }
}

const supprimer = async (b) => {
  try { await $fetch(`/api/benevoles/${b.id}`, { method: 'DELETE' }); charger() }
  catch (e) { alert('Erreur') }
}

const serviceIcon = (s) => services.find(x => x.val === s)?.icon || '⚙️'
const serviceLabel = (s) => services.find(x => x.val === s)?.label || s
const statutClass = (s) => ({ PLANIFIE:'border-gray-200 bg-white text-gray-600', CONFIRME:'border-green-300 bg-green-50 text-green-700', ABSENT:'border-red-300 bg-red-50 text-red-600' }[s] || 'border-gray-200')
</script>
