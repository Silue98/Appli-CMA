<template>
  <form @submit.prevent="save" class="bg-white p-5 shadow-sm rounded-xl border border-gray-200 space-y-4">
    <h3 class="text-base font-semibold text-gray-800">{{ isEdit ? 'Modifier le culte' : 'Nouveau culte' }}</h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Date <span class="text-red-500">*</span></label>
        <input v-model="form.dateCulte" type="date" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Horaire <span class="text-red-500">*</span></label>
        <input v-model="form.horaire" placeholder="Ex: 08h00 / 10h00 / 12h00" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Thème principal</label>
        <input v-model="form.themePrincipal" placeholder="Thème du culte"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
      </div>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {{ errorMsg }}</p>

    <div class="flex gap-3 pt-2">
      <button type="submit" :disabled="isSaving"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60">
        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ isSaving ? 'Enregistrement...' : '💾 ' + (isEdit ? 'Mettre à jour' : 'Ajouter') }}
      </button>
      <button type="button" @click="$emit('cancel')" class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'

const props = defineProps({
  existingData: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => !!props.existingData?.id)
const isSaving = ref(false)
const errorMsg = ref('')

const form = reactive({ dateCulte: '', horaire: '', themePrincipal: '' })

watch(() => props.existingData, (data) => {
  if (data) {
    form.dateCulte = data.dateCulte ? new Date(data.dateCulte).toISOString().split('T')[0] : ''
    form.horaire = data.horaire || ''
    form.themePrincipal = data.themePrincipal || ''
  } else {
    Object.assign(form, { dateCulte: '', horaire: '', themePrincipal: '' })
  }
}, { immediate: true })

const save = async () => {
  errorMsg.value = ''
  isSaving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/cultes/${props.existingData.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/cultes', { method: 'POST', body: form })
    }
    Object.assign(form, { dateCulte: '', horaire: '', themePrincipal: '' })
    emit('saved')
  } catch (err) {
    errorMsg.value = err.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}
</script>
