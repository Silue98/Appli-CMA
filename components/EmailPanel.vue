<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">

    <!-- En-tête -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">📧 Gestion des Emails</h2>
      <p class="text-sm text-gray-500 mt-1">Envoi manuel et automatique aux membres</p>
    </div>

    <!-- Paramètres automatiques -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-4">⚙️ Paramètres d'envoi automatique</h3>

      <div class="space-y-4">

        <!-- Toggle envoi auto événement -->
        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p class="font-medium text-gray-700 text-sm">🎉 Notification automatique à la création d'événement</p>
            <p class="text-xs text-gray-400 mt-0.5">Envoie un email à tous les membres dès qu'un événement est créé</p>
          </div>
          <button @click="toggle('autoEnabled')" :disabled="saving"
            :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', settings.autoEnabled ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoEnabled ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <!-- Toggle bienvenue -->
        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p class="font-medium text-gray-700 text-sm">👋 Email de bienvenue aux nouveaux membres</p>
            <p class="text-xs text-gray-400 mt-0.5">Envoie automatiquement un email de bienvenue à chaque nouveau membre avec email</p>
          </div>
          <button @click="toggle('welcomeEnabled')" :disabled="saving"
            :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', settings.welcomeEnabled ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.welcomeEnabled ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <!-- Toggle rappel J-1 -->
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-gray-700 text-sm">⏰ Rappels J-1 événements</p>
            <p class="text-xs text-gray-400 mt-0.5">Active les rappels automatiques la veille des événements (à déclencher manuellement)</p>
          </div>
          <button @click="toggle('reminderEnabled')" :disabled="saving"
            :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', settings.reminderEnabled ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.reminderEnabled ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

      </div>

      <!-- Bouton envoyer les rappels J-1 maintenant -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">Envoyer les rappels J-1 maintenant</p>
            <p class="text-xs text-gray-400">Envoie les rappels pour tous les événements de demain</p>
          </div>
          <button @click="envoyerRappels" :disabled="sendingRappels || !settings.reminderEnabled"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm rounded-lg transition font-medium">
            {{ sendingRappels ? '⏳...' : '⏰ Envoyer rappels' }}
          </button>
        </div>
        <div v-if="rappelResult" :class="['mt-2 p-2 rounded text-xs', rappelResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
          {{ rappelResult.message }}
        </div>
      </div>
    </div>

    <!-- Formulaire envoi manuel -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-4">✉️ Envoyer un message libre</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Destinataires</label>
          <select v-model="form.cible" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="tous">Tous les membres actifs</option>
            <option value="departement">Un département spécifique</option>
          </select>
        </div>

        <div v-if="form.cible === 'departement'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Département</label>
          <select v-model="form.departementId" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">Choisir un département</option>
            <option v-for="dep in departements" :key="dep.id" :value="dep.id">{{ dep.nom }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
          <input v-model="form.sujet" type="text" placeholder="Ex: Rappel culte de dimanche"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea v-model="form.message" rows="6" placeholder="Rédigez votre message ici..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"/>
        </div>

        <button @click="envoyerEmail" :disabled="sending || !form.sujet || !form.message"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2">
          <span v-if="sending">⏳ Envoi en cours...</span>
          <span v-else>📤 Envoyer l'email</span>
        </button>

        <div v-if="sendResult" :class="['p-3 rounded-lg text-sm', sendResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
          {{ sendResult.message }}
        </div>
      </div>
    </div>

    <!-- Historique -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 class="font-semibold text-gray-800 mb-4">📋 Historique des envois</h3>

      <div v-if="logs.length === 0" class="text-center text-gray-400 py-8">
        Aucun email envoyé pour l'instant
      </div>

      <div v-else class="space-y-2">
        <div v-for="log in logs" :key="log.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ log.sujet }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              <span :class="typeBadge(log.type)" class="px-1.5 py-0.5 rounded text-xs mr-1">{{ typeLabel(log.type) }}</span>
              {{ log.destinataires }} destinataire(s) • {{ formatDate(log.createdAt) }}
            </p>
          </div>
          <span :class="['ml-3 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0', log.statut === 'ENVOYE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ log.statut === 'ENVOYE' ? '✅' : '❌' }} {{ log.statut }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const settings = ref({ autoEnabled: false, welcomeEnabled: true, reminderEnabled: true })
const saving = ref(false)
const departements = ref([])
const logs = ref([])
const sending = ref(false)
const sendResult = ref(null)
const sendingRappels = ref(false)
const rappelResult = ref(null)

const form = ref({ cible: 'tous', departementId: '', sujet: '', message: '' })

onMounted(async () => {
  await Promise.all([chargerSettings(), chargerDepartements(), chargerLogs()])
})

async function chargerSettings() {
  try { settings.value = await $fetch('/api/emails/settings') } catch (e) { console.error(e) }
}
async function chargerDepartements() {
  try { departements.value = await $fetch('/api/departements') } catch (e) { console.error(e) }
}
async function chargerLogs() {
  try { logs.value = await $fetch('/api/emails/logs') } catch (e) { console.error(e) }
}

async function toggle(key) {
  saving.value = true
  try {
    settings.value = await $fetch('/api/emails/settings', {
      method: 'POST',
      body: { [key]: !settings.value[key] }
    })
  } catch (e) { console.error(e) } finally { saving.value = false }
}

async function envoyerRappels() {
  sendingRappels.value = true
  rappelResult.value = null
  try {
    const result = await $fetch('/api/emails/send-reminders', { method: 'POST' })
    rappelResult.value = {
      success: true,
      message: result.evenements > 0
        ? `✅ Rappels envoyés pour ${result.evenements} événement(s) à ${result.envoyes} membre(s)`
        : '✅ Aucun événement demain'
    }
    await chargerLogs()
  } catch (e) {
    rappelResult.value = { success: false, message: `❌ ${e.data?.message || e.message}` }
  } finally { sendingRappels.value = false }
}

async function envoyerEmail() {
  if (!form.value.sujet || !form.value.message) return
  sending.value = true
  sendResult.value = null
  try {
    const result = await $fetch('/api/emails/send-manual', {
      method: 'POST',
      body: { cible: form.value.cible, departementId: form.value.departementId || undefined, sujet: form.value.sujet, message: form.value.message }
    })
    sendResult.value = { success: true, message: `✅ Email envoyé à ${result.envoyes} membre(s) avec succès !` }
    form.value.sujet = ''
    form.value.message = ''
    await chargerLogs()
  } catch (e) {
    sendResult.value = { success: false, message: `❌ Erreur : ${e.data?.message || e.message}` }
  } finally { sending.value = false }
}

const typeLabel = (t) => ({ MANUEL: 'Manuel', AUTO_EVENEMENT: 'Auto', NOTIF_EVENEMENT: 'Notif', BIENVENUE: 'Bienvenue', RAPPEL_J1: 'Rappel J-1' }[t] || t)
const typeBadge = (t) => ({ MANUEL: 'bg-blue-100 text-blue-700', AUTO_EVENEMENT: 'bg-purple-100 text-purple-700', NOTIF_EVENEMENT: 'bg-green-100 text-green-700', BIENVENUE: 'bg-yellow-100 text-yellow-700', RAPPEL_J1: 'bg-amber-100 text-amber-700' }[t] || 'bg-gray-100 text-gray-700')

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
