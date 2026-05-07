<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">⚙️ Paramètres</h2>
      <p class="text-sm text-gray-500 mt-1">Configuration générale de l'application</p>
    </div>

    <!-- Configuration SMTP -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-1">📧 Configuration Email (SMTP)</h3>
      <p class="text-xs text-gray-400 mb-4">Configurez le serveur d'envoi d'emails</p>

      <div class="space-y-4">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Serveur SMTP</label>
            <input v-model="config.host" type="text" placeholder="smtp.gmail.com"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
            <p class="text-xs text-gray-400 mt-1">Gmail: smtp.gmail.com • Outlook: smtp.office365.com</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <select v-model="config.port" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option :value="587">587 (TLS - recommandé)</option>
              <option :value="465">465 (SSL)</option>
              <option :value="25">25 (SMTP classique)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email expéditeur</label>
          <input v-model="config.user" type="email" placeholder="votre@email.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe / Clé API</label>
          <div class="relative">
            <input v-model="config.pass" :type="showPass ? 'text' : 'password'" placeholder="Mot de passe ou clé d'application"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
            <button @click="showPass = !showPass" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">Pour Gmail : utilisez un <a href="https://myaccount.google.com/apppasswords" target="_blank" class="text-blue-500 underline">mot de passe d'application</a></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom expéditeur</label>
          <input v-model="config.from" type="text" placeholder="CMA DOKUI1 <votre@email.com>"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
          <p class="text-xs text-gray-400 mt-1">Format : Nom Affiché &lt;email@domaine.com&gt;</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button @click="sauvegarderConfig" :disabled="saving"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition font-medium">
            {{ saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder' }}
          </button>
          <button @click="testerEmail" :disabled="testing || !config.user"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition font-medium">
            {{ testing ? '⏳ Test en cours...' : '📤 Tester l\'envoi' }}
          </button>
        </div>

        <div v-if="configResult" :class="['p-3 rounded-lg text-sm', configResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
          {{ configResult.message }}
        </div>
      </div>
    </div>

    <!-- Informations sur les rôles -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 class="font-semibold text-gray-800 mb-1">👥 Rôles utilisateurs</h3>
      <p class="text-xs text-gray-400 mb-4">Permissions accordées par rôle</p>

      <div class="space-y-3">
        <div v-for="role in rolesInfo" :key="role.name" class="p-3 rounded-lg border border-gray-100">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg">{{ role.icon }}</span>
            <span class="font-medium text-sm text-gray-800">{{ role.name }}</span>
            <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', role.badgeClass]">{{ role.label }}</span>
          </div>
          <p class="text-xs text-gray-500 ml-7">{{ role.desc }}</p>
          <div class="flex flex-wrap gap-1 mt-2 ml-7">
            <span v-for="perm in role.perms" :key="perm" class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{{ perm }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = ref({ host: 'smtp.gmail.com', port: 587, user: '', pass: '', from: '' })
const showPass = ref(false)
const saving = ref(false)
const testing = ref(false)
const configResult = ref(null)

const rolesInfo = [
  {
    name: 'SUPER_ADMIN', icon: '👑', label: 'Super Administrateur',
    badgeClass: 'bg-red-100 text-red-700',
    desc: 'Accès total à toutes les fonctionnalités',
    perms: ['Tout voir', 'Tout modifier', 'Tout supprimer', 'Gérer utilisateurs', 'Paramètres']
  },
  {
    name: 'ADMIN', icon: '🔧', label: 'Administrateur',
    badgeClass: 'bg-orange-100 text-orange-700',
    desc: 'Gestion complète sauf certaines opérations critiques',
    perms: ['Membres', 'Finances', 'Emails', 'Utilisateurs', 'Tous les modules']
  },
  {
    name: 'PASTEUR', icon: '⛪', label: 'Pasteur',
    badgeClass: 'bg-purple-100 text-purple-700',
    desc: 'Accès pastoral et spirituel complet',
    perms: ['Membres', 'Pastoral', 'Cultes', 'Prédications', 'Finances', 'Emails']
  },
  {
    name: 'SECRETAIRE', icon: '📋', label: 'Secrétaire',
    badgeClass: 'bg-blue-100 text-blue-700',
    desc: 'Gestion administrative et organisationnelle',
    perms: ['Membres', 'Cultes', 'Annonces', 'Programmes', 'Événements', 'Présences']
  },
  {
    name: 'TRESORIER', icon: '💰', label: 'Trésorier',
    badgeClass: 'bg-green-100 text-green-700',
    desc: 'Accès aux modules financiers uniquement',
    perms: ['Finances', 'Dîmes', 'Budgets', 'Tableau de bord']
  },
  {
    name: 'LECTEUR', icon: '👁️', label: 'Lecteur',
    badgeClass: 'bg-gray-100 text-gray-700',
    desc: 'Consultation uniquement, aucune modification',
    perms: ['Voir membres', 'Voir cultes', 'Voir annonces', 'Tableau de bord']
  },
]

onMounted(async () => {
  await chargerConfig()
})

async function chargerConfig() {
  try { config.value = await $fetch('/api/emails/config') } catch (e) { console.error(e) }
}

async function sauvegarderConfig() {
  saving.value = true
  configResult.value = null
  try {
    await $fetch('/api/emails/config', { method: 'POST', body: config.value })
    configResult.value = { success: true, message: '✅ Configuration sauvegardée avec succès !' }
    await chargerConfig()
  } catch (e) {
    configResult.value = { success: false, message: `❌ ${e.data?.message || e.message}` }
  } finally { saving.value = false }
}

async function testerEmail() {
  testing.value = true
  configResult.value = null
  try {
    const result = await $fetch('/api/emails/send-manual', {
      method: 'POST',
      body: { cible: 'liste', emails: [config.value.user], sujet: '✅ Test configuration SMTP — CMA DOKUI1', message: 'Félicitations ! La configuration email fonctionne correctement.' }
    })
    configResult.value = { success: true, message: `✅ Email de test envoyé à ${config.value.user} !` }
  } catch (e) {
    configResult.value = { success: false, message: `❌ Erreur : ${e.data?.message || e.message}` }
  } finally { testing.value = false }
}
</script>
