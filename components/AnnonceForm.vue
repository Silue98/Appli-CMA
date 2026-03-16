<template>
  <form @submit.prevent="save" class="bg-white p-5 shadow-sm rounded-xl border border-gray-200 space-y-6">
    <h3 class="text-base font-semibold text-gray-800">{{ isEdit ? 'Modifier l\'annonce' : 'Nouvelle annonce' }}</h3>

    <!-- Titre + Culte -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Titre <span class="text-red-500">*</span></label>
        <input v-model="form.titre" placeholder="Titre de l'annonce" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Culte associé <span class="text-red-500">*</span></label>
        <select v-model="form.culteId" required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition">
          <option value="" disabled>— Sélectionner un culte —</option>
          <option v-for="c in cultes" :key="c.id" :value="c.id">
            {{ formatDate(c.dateCulte) }} — {{ c.themePrincipal || c.horaire || 'Culte' }}
          </option>
        </select>
        <p v-if="loadingCultes" class="text-xs text-gray-400 mt-1">Chargement des cultes...</p>
      </div>
    </div>

    <!-- Compte rendu -->
    <div class="border border-blue-100 rounded-xl p-4 bg-blue-50">
      <h4 class="text-sm font-semibold text-blue-700 mb-3">📊 Compte Rendu du culte précédent</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Messager</label>
          <input v-model="form.compteRendu.messager" placeholder="Nom du messager"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white transition text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Texte biblique</label>
          <input v-model="form.compteRendu.texteBiblique" placeholder="Ex: Jean 3:16"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white transition text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Assistance totale</label>
          <input v-model.number="form.compteRendu.assistanceTotale" type="number" min="0" placeholder="Ex: 120"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white transition text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Thème</label>
          <input v-model="form.compteRendu.theme" placeholder="Thème du culte précédent"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white transition text-sm" />
        </div>
      </div>
    </div>

    <!-- Champs texte riches -->
    <div v-for="(label, key) in textFields" :key="key">
      <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
      <textarea v-model="form[key]" :placeholder="'Rédiger ' + label.toLowerCase() + '...'" rows="3"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition resize-y text-sm"></textarea>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">❌ {{ errorMsg }}</p>

    <div class="flex gap-3 pt-2">
      <button type="submit" :disabled="isSaving"
        class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60">
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
import { reactive, ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  existingData: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => !!props.existingData?.id)
const isSaving = ref(false)
const errorMsg = ref('')
const cultes = ref([])
const loadingCultes = ref(true)

const textFields = {
  infosJour: '📅 Informations du Jour',
  remerciements: '🙏 Remerciements',
  rappels: '🔔 Rappels importants',
  commentaires: '💬 Commentaires'
}

const emptyCompteRendu = () => ({ messager: '', texteBiblique: '', assistanceTotale: null, theme: '' })

const form = reactive({
  titre: '',
  culteId: '',
  infosJour: '',
  remerciements: '',
  rappels: '',
  commentaires: '',
  compteRendu: emptyCompteRendu()
})

onMounted(async () => {
  try {
    cultes.value = await $fetch('/api/cultes') || []
  } catch (e) {
    console.error('Erreur chargement cultes:', e)
  } finally {
    loadingCultes.value = false
  }
})

watch(() => props.existingData, (data) => {
  if (data) {
    form.titre = data.titre || ''
    form.culteId = data.culteId || ''
    form.infosJour = data.infosJour || ''
    form.remerciements = data.remerciements || ''
    form.rappels = data.rappels || ''
    form.commentaires = data.commentaires || ''
    form.compteRendu = data.compteRendu
      ? { ...emptyCompteRendu(), ...data.compteRendu }
      : emptyCompteRendu()
  } else {
    Object.assign(form, {
      titre: '', culteId: '', infosJour: '', remerciements: '', rappels: '', commentaires: '',
      compteRendu: emptyCompteRendu()
    })
  }
}, { immediate: true })

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const save = async () => {
  errorMsg.value = ''
  if (!form.titre || !form.culteId) {
    errorMsg.value = 'Le titre et le culte sont obligatoires'
    return
  }
  isSaving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/annonces/${props.existingData.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/annonces', { method: 'POST', body: form })
    }
    Object.assign(form, {
      titre: '', culteId: '', infosJour: '', remerciements: '', rappels: '', commentaires: '',
      compteRendu: emptyCompteRendu()
    })
    emit('saved')
  } catch (err) {
    errorMsg.value = err.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}
</script>
