<template>
  <form @submit.prevent="save" class="bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-sm">
    <h3 class="text-base font-semibold text-gray-800">{{ isEdit ? 'Modifier le programme' : 'Nouveau programme' }}</h3>

    <!-- Infos générales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Date <span class="text-red-500">*</span></label>
        <input v-model="form.date" type="date" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Semaine</label>
        <input v-model="form.semaine" placeholder="Ex: S01, Semaine 1..."
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Statut</label>
        <select v-model="form.status"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition">
          <option value="PLANIFIE">Planifié</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINE">Terminé</option>
          <option value="ANNULE">Annulé</option>
        </select>
      </div>
      <div class="md:col-span-2 lg:col-span-3">
        <label class="block text-sm font-medium text-gray-600 mb-1">Thème</label>
        <input v-model="form.theme" placeholder="Thème principal du programme"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition" />
      </div>
    </div>

    <!-- Cantiques -->
    <div class="border border-yellow-100 rounded-xl p-4 bg-yellow-50">
      <h4 class="text-sm font-semibold text-yellow-700 mb-3">🎵 Cantiques</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Cantique français</label>
          <input v-model="form.cantiqueFrancais" placeholder="Titre du cantique"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none bg-white text-sm transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Référence français</label>
          <input v-model="form.cantiqueFrancaisRef" placeholder="N° ou référence"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none bg-white text-sm transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Cantique baoulé</label>
          <input v-model="form.cantiqueBaoule" placeholder="Titre du cantique"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none bg-white text-sm transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Référence baoulé</label>
          <input v-model="form.cantiqueBaouleRef" placeholder="N° ou référence"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none bg-white text-sm transition" />
        </div>
      </div>
    </div>

    <!-- Rôles par culte -->
    <div v-for="culte in culteTypes" :key="culte.value" class="border border-gray-200 rounded-xl p-4">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ culte.label }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="role in rolesDisponibles" :key="role.value">
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ role.label }}</label>
          <div class="flex gap-2">
            <select v-model="getRoleRef(culte.value, role.value).membreId"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-gray-50 text-sm transition">
              <option value="">— Non assigné —</option>
              <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
            </select>
            <input v-if="role.value === 'PRESIDENT'" v-model="getRoleRef(culte.value, role.value).heure"
              placeholder="Heure"
              class="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-gray-50 text-sm transition" />
          </div>
        </div>
      </div>
    </div>

    <!-- Planificateur + Notes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Planificateur</label>
        <select v-model="form.planificateurId"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition">
          <option value="">— Aucun —</option>
          <option v-for="m in membres" :key="m.id" :value="m.id">{{ m.nom }} {{ m.prenom }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Notes</label>
        <textarea v-model="form.notes" placeholder="Notes ou remarques..." rows="2"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition resize-none text-sm"></textarea>
      </div>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">❌ {{ errorMsg }}</p>

    <div class="flex gap-3 pt-2">
      <button type="submit" :disabled="isSaving"
        class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60">
        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ isSaving ? 'Enregistrement...' : '💾 ' + (isEdit ? 'Mettre à jour' : 'Enregistrer') }}
      </button>
      <button type="button" @click="$emit('cancel')"
        class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const props = defineProps({ existingData: { type: Object, default: null } })
const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => !!props.existingData?.id)
const isSaving = ref(false)
const errorMsg = ref('')
const membres = ref([])

const culteTypes = [
  { value: 'PREMIER', label: '🌅 Premier Culte' },
  { value: 'DEUXIEME', label: '☀️ Deuxième Culte' },
  { value: 'TROISIEME', label: '🌙 Troisième Culte' }
]

const rolesDisponibles = [
  { value: 'PRESIDENT', label: 'Président de culte' },
  { value: 'ANNONCES', label: 'Chargé des annonces' },
  { value: 'PREDICATEUR', label: 'Prédicateur' },
  { value: 'LOUANGE', label: 'Responsable louange' }
]

const form = reactive({
  date: '', semaine: '', theme: '', status: 'PLANIFIE',
  cantiqueFrancais: '', cantiqueBaoule: '', cantiqueFrancaisRef: '', cantiqueBaouleRef: '',
  notes: '', planificateurId: ''
})

// Stockage des rôles : { PREMIER_PRESIDENT: { membreId, heure }, ... }
const rolesMap = reactive({})

const getRoleRef = (culteType, role) => {
  const key = `${culteType}_${role}`
  if (!rolesMap[key]) rolesMap[key] = { membreId: '', heure: '' }
  return rolesMap[key]
}

onMounted(async () => {
  try {
    membres.value = await $fetch('/api/membres') || []
  } catch (e) { console.error(e) }
})

watch(() => props.existingData, (data) => {
  if (!data) return
  form.date = data.date ? new Date(data.date).toISOString().split('T')[0] : ''
  form.semaine = data.semaine || ''
  form.theme = data.theme || ''
  form.status = data.status || 'PLANIFIE'
  form.cantiqueFrancais = data.cantiqueFrancais || ''
  form.cantiqueBaoule = data.cantiqueBaoule || ''
  form.cantiqueFrancaisRef = data.cantiqueFrancaisRef || ''
  form.cantiqueBaouleRef = data.cantiqueBaouleRef || ''
  form.notes = data.notes || ''
  form.planificateurId = data.planificateurId || ''

  // Pré-remplir les rôles existants
  if (data.roles) {
    data.roles.forEach(r => {
      const key = `${r.culteType}_${r.role}`
      rolesMap[key] = { membreId: r.membreId || '', heure: r.heure || '' }
    })
  }
}, { immediate: true })

const save = async () => {
  errorMsg.value = ''
  if (!form.date) { errorMsg.value = 'La date est requise'; return }
  isSaving.value = true
  try {
    // Construire le tableau de rôles à partir de rolesMap
    const roles = []
    culteTypes.forEach(ct => {
      rolesDisponibles.forEach(r => {
        const ref = rolesMap[`${ct.value}_${r.value}`]
        if (ref?.membreId) {
          roles.push({
            culteType: ct.value,
            role: r.value,
            heure: ref.heure || null,
            membreId: Number(ref.membreId)
          })
        }
      })
    })

    const payload = {
      ...form,
      planificateurId: form.planificateurId ? Number(form.planificateurId) : null,
      roles
    }

    if (isEdit.value) {
      await $fetch(`/api/programmes/${props.existingData.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/programmes', { method: 'POST', body: payload })
    }
    emit('saved')
  } catch (err) {
    errorMsg.value = err.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}
</script>
