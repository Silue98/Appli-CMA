<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">📧 Gestion des Emails</h2>
      <p class="text-sm text-gray-500 mt-1">Envoi manuel et automatique aux membres</p>
    </div>

    <!-- Paramètres automatiques -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-1">⚙️ Paramètres d'envoi automatique</h3>
      <p class="text-xs text-gray-400 mb-4">Activez ou désactivez chaque déclencheur</p>

      <!-- Événements & Cultes -->
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-3">Événements & Cultes</p>
      <div class="space-y-1 divide-y divide-gray-50">

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">🎉 Notification à la création d'un événement</p><p class="text-xs text-gray-400">Email automatique à tous les membres</p></div>
          <button @click="toggle('autoEvenement')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.autoEvenement ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoEvenement ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">⛪ Notification nouveau culte</p><p class="text-xs text-gray-400">Email lors de la création d'un culte</p></div>
          <button @click="toggle('autoCulte')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.autoCulte ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoCulte ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">📅 Nouveau programme de culte</p><p class="text-xs text-gray-400">Email lors de la publication d'un programme</p></div>
          <button @click="toggle('autoProgramme')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.autoProgramme ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoProgramme ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">📖 Nouvelle prédication publiée</p><p class="text-xs text-gray-400">Email lors de l'enregistrement d'une prédication</p></div>
          <button @click="toggle('autoPredication')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.autoPredication ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoPredication ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">📢 Nouvelle annonce</p><p class="text-xs text-gray-400">Email lors de la création d'une annonce</p></div>
          <button @click="toggle('autoAnnonce')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.autoAnnonce ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.autoAnnonce ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

      </div>

      <!-- Membres -->
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Membres</p>
      <div class="space-y-1 divide-y divide-gray-50">

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">👋 Email de bienvenue nouveau membre</p><p class="text-xs text-gray-400">Email automatique à chaque nouveau membre avec email</p></div>
          <button @click="toggle('welcomeEnabled')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.welcomeEnabled ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.welcomeEnabled ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">💎 Rappel mensuel de dîme</p><p class="text-xs text-gray-400">Email aux membres n'ayant pas encore payé ce mois</p></div>
          <button @click="toggle('rappelDime')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.rappelDime ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.rappelDime ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">✅ Confirmation inscription publique</p><p class="text-xs text-gray-400">Email de confirmation au candidat lors d'une inscription</p></div>
          <button @click="toggle('confirmInscription')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.confirmInscription ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.confirmInscription ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">🙏 Notification nouvelle demande de prière</p><p class="text-xs text-gray-400">Notifie les pasteurs/admins d'une nouvelle demande</p></div>
          <button @click="toggle('notifPriere')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.notifPriere ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.notifPriere ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>

      </div>

      <!-- Rappels -->
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Rappels planifiés</p>
      <div class="divide-y divide-gray-50">
        <div class="flex items-center justify-between py-3">
          <div><p class="text-sm font-medium text-gray-700">⏰ Rappels J-1 événements</p><p class="text-xs text-gray-400">Active les rappels la veille des événements</p></div>
          <button @click="toggle('reminderEnabled')" :disabled="saving" :class="['relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors', settings.reminderEnabled ? 'bg-green-600' : 'bg-gray-300']">
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', settings.reminderEnabled ? 'translate-x-6' : 'translate-x-1']"/>
          </button>
        </div>
      </div>

    </div>

    <!-- Actions manuelles -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-1">🚀 Actions manuelles</h3>
      <p class="text-xs text-gray-400 mb-4">Déclenchez ces actions quand vous le souhaitez</p>

      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
          <div><p class="text-sm font-medium text-gray-700">⏰ Envoyer les rappels J-1</p><p class="text-xs text-gray-400">Rappels pour tous les événements de demain</p></div>
          <button @click="envoyerRappels" :disabled="loadings.rappels || !settings.reminderEnabled"
            class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs rounded-lg transition font-medium">
            {{ loadings.rappels ? '⏳...' : '▶ Envoyer' }}
          </button>
        </div>

        <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div><p class="text-sm font-medium text-gray-700">💎 Envoyer rappels dîme du mois</p><p class="text-xs text-gray-400">Rappels aux membres n'ayant pas encore payé</p></div>
          <button @click="envoyerRappelDime" :disabled="loadings.dime || !settings.rappelDime"
            class="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs rounded-lg transition font-medium">
            {{ loadings.dime ? '⏳...' : '▶ Envoyer' }}
          </button>
        </div>

        <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div><p class="text-sm font-medium text-gray-700">🎂 Envoyer vœux d'anniversaire du jour</p><p class="text-xs text-gray-400">Emails aux membres dont c'est l'anniversaire aujourd'hui</p></div>
          <button @click="envoyerAnniversaires" :disabled="loadings.anniversaires"
            class="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs rounded-lg transition font-medium">
            {{ loadings.anniversaires ? '⏳...' : '▶ Envoyer' }}
          </button>
        </div>
      </div>

      <div v-if="actionResult" :class="['mt-3 p-3 rounded-lg text-sm', actionResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
        {{ actionResult.message }}
      </div>
    </div>

    <!-- Gestion abonnements membres -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-gray-800">👥 Abonnements membres</h3>
          <p class="text-xs text-gray-400 mt-0.5">Gérez qui peut recevoir des emails</p>
        </div>
        <div class="flex gap-2">
          <button @click="toutActiver" :disabled="loadingAbonnements" class="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs rounded-lg border border-green-200 font-medium">✅ Tout activer</button>
          <button @click="toutDesactiver" :disabled="loadingAbonnements" class="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs rounded-lg border border-red-200 font-medium">🔕 Tout désactiver</button>
        </div>
      </div>

      <input v-model="searchMembre" placeholder="🔍 Rechercher un membre..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"/>

      <div class="text-xs text-gray-500 mb-2">
        {{ membresAvecEmail.filter(m => m.recevoirEmails).length }} / {{ membresAvecEmail.length }} membres abonnés
      </div>

      <div v-if="loadingAbonnements" class="text-center py-4 text-gray-400">Chargement...</div>

      <div v-else class="max-h-64 overflow-y-auto space-y-1">
        <div v-for="m in membresFiltres" :key="m.id"
          class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
          <div class="flex items-center gap-2 min-w-0">
            <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', m.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
              {{ m.prenom?.charAt(0) }}{{ m.nom?.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ m.prenom }} {{ m.nom }}</p>
              <p class="text-xs text-gray-400 truncate">{{ m.email }}</p>
            </div>
          </div>
          <button @click="toggleMembreEmail(m)"
            :class="['relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ml-3', m.recevoirEmails ? 'bg-green-500' : 'bg-gray-300']">
            <span :class="['inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform', m.recevoirEmails ? 'translate-x-4' : 'translate-x-1']"/>
          </button>
        </div>
        <div v-if="membresFiltres.length === 0" class="text-center py-4 text-gray-400 text-sm">
          Aucun membre avec email trouvé
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
          <input v-model="form.sujet" type="text" placeholder="Ex: Message du pasteur"
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
      <h3 class="font-semibold text-gray-800 mb-4">📋 Historique <span class="text-xs text-gray-400">(50 derniers)</span></h3>
      <div v-if="logs.length === 0" class="text-center text-gray-400 py-8">Aucun email envoyé pour l'instant</div>
      <div v-else class="space-y-2">
        <div v-for="log in logs" :key="log.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ log.sujet }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              <span :class="typeBadge(log.type)" class="px-1.5 py-0.5 rounded text-xs mr-1 font-medium">{{ typeLabel(log.type) }}</span>
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
import { ref, computed, onMounted } from 'vue'

const settings = ref({
  autoEvenement: false, autoCulte: false, autoProgramme: false,
  autoPredication: false, autoAnnonce: false, welcomeEnabled: true,
  rappelDime: false, confirmInscription: true, notifPriere: false, reminderEnabled: true
})
const saving = ref(false)
const departements = ref([])
const logs = ref([])
const sending = ref(false)
const sendResult = ref(null)
const actionResult = ref(null)
const loadings = ref({ rappels: false, dime: false, anniversaires: false })
const form = ref({ cible: 'tous', departementId: '', sujet: '', message: '' })
const membresAvecEmail = ref([])
const searchMembre = ref('')
const loadingAbonnements = ref(false)

const membresFiltres = computed(() => {
  if (!searchMembre.value) return membresAvecEmail.value
  const s = searchMembre.value.toLowerCase()
  return membresAvecEmail.value.filter(m =>
    m.nom?.toLowerCase().includes(s) || m.prenom?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s)
  )
})

onMounted(async () => {
  await Promise.all([chargerSettings(), chargerDepartements(), chargerLogs(), chargerMembres()])
})

async function chargerMembres() {
  loadingAbonnements.value = true
  try {
    const data = await $fetch('/api/membres?limit=500')
    membresAvecEmail.value = (data.membres || data).filter(m => m.email)
  } catch (e) { console.error(e) } finally { loadingAbonnements.value = false }
}

async function toggleMembreEmail(m) {
  try {
    const result = await $fetch('/api/membres/toggle-email', { method: 'POST', body: { id: m.id } })
    m.recevoirEmails = result.recevoirEmails
  } catch (e) { console.error(e) }
}

async function toutActiver() {
  loadingAbonnements.value = true
  try {
    await Promise.all(
      membresAvecEmail.value.filter(m => !m.recevoirEmails).map(m =>
        $fetch('/api/membres/toggle-email', { method: 'POST', body: { id: m.id } }).then(r => { m.recevoirEmails = r.recevoirEmails })
      )
    )
  } catch (e) { console.error(e) } finally { loadingAbonnements.value = false }
}

async function toutDesactiver() {
  if (!confirm('Désactiver les emails pour tous les membres ?')) return
  loadingAbonnements.value = true
  try {
    await Promise.all(
      membresAvecEmail.value.filter(m => m.recevoirEmails).map(m =>
        $fetch('/api/membres/toggle-email', { method: 'POST', body: { id: m.id } }).then(r => { m.recevoirEmails = r.recevoirEmails })
      )
    )
  } catch (e) { console.error(e) } finally { loadingAbonnements.value = false }
}

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

async function runAction(key, url, msgFn) {
  loadings.value[key] = true
  actionResult.value = null
  try {
    const result = await $fetch(url, { method: 'POST' })
    actionResult.value = { success: true, message: msgFn(result) }
    await chargerLogs()
  } catch (e) {
    actionResult.value = { success: false, message: `❌ ${e.data?.message || e.message}` }
  } finally { loadings.value[key] = false }
}

const envoyerRappels = () => runAction('rappels', '/api/emails/send-reminders',
  r => r.evenements > 0 ? `✅ Rappels envoyés pour ${r.evenements} événement(s) à ${r.envoyes} membre(s)` : '✅ Aucun événement demain')

const envoyerRappelDime = () => runAction('dime', '/api/emails/rappel-dime',
  r => r.envoyes > 0 ? `✅ Rappels dîme envoyés à ${r.envoyes}/${r.total} membre(s)` : '✅ Tous les membres ont payé')

const envoyerAnniversaires = () => runAction('anniversaires', '/api/emails/send-anniversaires',
  r => r.envoyes > 0 ? `✅ Vœux envoyés à ${r.envoyes} membre(s)` : '✅ Aucun anniversaire aujourd\'hui')

async function envoyerEmail() {
  if (!form.value.sujet || !form.value.message) return
  sending.value = true
  sendResult.value = null
  try {
    const result = await $fetch('/api/emails/send-manual', {
      method: 'POST',
      body: { cible: form.value.cible, departementId: form.value.departementId || undefined, sujet: form.value.sujet, message: form.value.message }
    })
    sendResult.value = { success: true, message: `✅ Email envoyé à ${result.envoyes} membre(s) !` }
    form.value.sujet = ''
    form.value.message = ''
    await chargerLogs()
  } catch (e) {
    sendResult.value = { success: false, message: `❌ ${e.data?.message || e.message}` }
  } finally { sending.value = false }
}

const typeLabel = (t) => ({
  MANUEL: 'Manuel', AUTO_EVENEMENT: 'Auto Événement', NOTIF_EVENEMENT: 'Notif Événement',
  BIENVENUE: 'Bienvenue', RAPPEL_J1: 'Rappel J-1', AUTO_CULTE: 'Auto Culte',
  AUTO_ANNONCE: 'Auto Annonce', AUTO_PROGRAMME: 'Auto Programme', AUTO_PREDICATION: 'Auto Prédication',
  RAPPEL_DIME: 'Rappel Dîme', CONFIRM_INSCRIPTION: 'Confirmation', NOTIF_PRIERE: 'Prière',
  ANNIVERSAIRE: 'Anniversaire'
}[t] || t)

const typeBadge = (t) => ({
  MANUEL: 'bg-blue-100 text-blue-700', AUTO_EVENEMENT: 'bg-purple-100 text-purple-700',
  NOTIF_EVENEMENT: 'bg-green-100 text-green-700', BIENVENUE: 'bg-yellow-100 text-yellow-700',
  RAPPEL_J1: 'bg-amber-100 text-amber-700', AUTO_CULTE: 'bg-indigo-100 text-indigo-700',
  AUTO_ANNONCE: 'bg-orange-100 text-orange-700', AUTO_PROGRAMME: 'bg-violet-100 text-violet-700',
  AUTO_PREDICATION: 'bg-pink-100 text-pink-700', RAPPEL_DIME: 'bg-red-100 text-red-700',
  CONFIRM_INSCRIPTION: 'bg-teal-100 text-teal-700', NOTIF_PRIERE: 'bg-fuchsia-100 text-fuchsia-700',
  ANNIVERSAIRE: 'bg-lime-100 text-lime-700'
}[t] || 'bg-gray-100 text-gray-700')

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
