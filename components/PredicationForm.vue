<template>
  <form @submit.prevent="save" class="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-5">
    <h3 class="text-base font-semibold text-blue-800">{{ isEdit ? 'Modifier la prédication' : 'Nouvelle prédication' }}</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Titre <span class="text-red-500">*</span></label>
        <input v-model="form.titre" placeholder="Ex: La foi qui déplace les montagnes" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Texte biblique <span class="text-red-500">*</span></label>
        <input v-model="form.texteBiblique" placeholder="Ex: Matthieu 17:20" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Culte <span class="text-red-500">*</span></label>
        <select v-model="form.culteId" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition">
          <option value="" disabled>— Sélectionner un culte —</option>
          <option v-for="c in cultes" :key="c.id" :value="c.id">
            {{ formatDate(c.dateCulte) }} — {{ c.themePrincipal || c.horaire || 'Culte' }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Prédicateur <span class="text-red-500">*</span></label>
        <select v-model="form.predicateurId" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition">
          <option value="" disabled>— Sélectionner un prédicateur —</option>
          <option v-for="m in membres" :key="m.id" :value="m.id">
            {{ m.nom }} {{ m.prenom }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
      <textarea v-model="form.resume" placeholder="Résumé court du message..." rows="3"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition resize-y text-sm"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Message complet</label>
      <textarea v-model="form.message" placeholder="Contenu principal ou points du message..." rows="5"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white transition resize-y text-sm"></textarea>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">❌ {{ errorMsg }}</p>

    <div class="flex gap-3">
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

const props = defineProps({
  existingData: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => !!props.existingData?.id)
const isSaving = ref(false)
const errorMsg = ref('')
const cultes = ref([])
const membres = ref([])

const form = reactive({ titre: '', texteBiblique: '', resume: '', message: '', culteId: '', predicateurId: '' })

onMounted(async () => {
  try {
    const [c, m] = await Promise.all([$fetch('/api/cultes'), $fetch('/api/membres')])
    cultes.value = c || []
    membres.value = m || []
  } catch (e) { console.error(e) }
})

watch(() => props.existingData, (data) => {
  if (data) {
    form.titre = data.titre || ''
    form.texteBiblique = data.texteBiblique || ''
    form.resume = data.resume || ''
    form.message = data.message || ''
    form.culteId = data.culteId || ''
    form.predicateurId = data.predicateurId || ''
  } else {
    Object.assign(form, { titre: '', texteBiblique: '', resume: '', message: '', culteId: '', predicateurId: '' })
  }
}, { immediate: true })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

const save = async () => {
  errorMsg.value = ''
  isSaving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/predications/${props.existingData.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/predications', { method: 'POST', body: form })
    }
    Object.assign(form, { titre: '', texteBiblique: '', resume: '', message: '', culteId: '', predicateurId: '' })
    emit('saved')
  } catch (err) {
    errorMsg.value = err.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}
</script>
