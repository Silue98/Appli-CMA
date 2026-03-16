<template>
  <section class="w-full space-y-5">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <!-- En-tête -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">👤 Gestion des Utilisateurs</h2>
          <p class="text-gray-500 text-sm mt-1">Gérez les accès à l'application CMA DOKUI1</p>
        </div>
        <button @click="toggleForm"
          class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium flex items-center gap-2 self-start">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          {{ showForm ? 'Fermer' : '➕ Nouvel utilisateur' }}
        </button>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm" class="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <h3 class="text-sm font-bold text-indigo-700 mb-4">{{ editItem ? '✏️ Modifier utilisateur' : '➕ Nouvel utilisateur' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nom <span class="text-red-500">*</span></label>
            <input v-model="form.nom" placeholder="Ex: Konan" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Prénom <span class="text-red-500">*</span></label>
            <input v-model="form.prenom" placeholder="Ex: Aimé" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email <span class="text-red-500">*</span></label>
            <input v-model="form.email" type="email" placeholder="email@exemple.ci" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">
              Mot de passe <span v-if="!editItem" class="text-red-500">*</span>
              <span v-else class="text-gray-400 font-normal">(laisser vide = inchangé)</span>
            </label>
            <div class="relative">
              <input v-model="form.motDePasse" :type="showPwd ? 'text' : 'password'" placeholder="••••••••"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white pr-10"/>
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showPwd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Rôle <span class="text-red-500">*</span></label>
            <select v-model="form.role" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white">
              <option value="ADMIN">🔑 Administrateur — Accès complet</option>
              <option value="SECRETAIRE">📝 Secrétaire — Gestion du culte</option>
              <option value="LECTEUR">👁️ Lecteur — Consultation seulement</option>
            </select>
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-gray-200 w-full">
              <div class="relative">
                <input type="checkbox" v-model="form.actif" class="sr-only"/>
                <div :class="['w-10 h-5 rounded-full transition', form.actif ? 'bg-green-500' : 'bg-gray-300']"></div>
                <div :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.actif ? 'translate-x-5' : '']"></div>
              </div>
              <span class="text-sm font-medium text-gray-700">Compte {{ form.actif ? 'actif' : 'désactivé' }}</span>
            </label>
          </div>
        </div>

        <!-- Description du rôle -->
        <div class="mt-3 p-3 bg-white rounded-lg border border-indigo-100 text-xs text-gray-600">
          <span v-if="form.role === 'ADMIN'">🔑 <strong>Administrateur</strong> : accès à toutes les sections + gestion des utilisateurs</span>
          <span v-else-if="form.role === 'SECRETAIRE'">📝 <strong>Secrétaire</strong> : peut gérer les membres, cultes, présences, finances et programmes</span>
          <span v-else-if="form.role === 'LECTEUR'">👁️ <strong>Lecteur</strong> : peut consulter toutes les informations mais pas modifier</span>
        </div>

        <p v-if="errorMsg" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">❌ {{ errorMsg }}</p>

        <div class="flex gap-2 mt-4">
          <button @click="save" :disabled="isSaving"
            class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            {{ isSaving ? 'Enregistrement...' : (editItem ? '✏️ Mettre à jour' : '💾 Créer l\'utilisateur') }}
          </button>
          <button @click="closeForm" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Annuler</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Liste utilisateurs -->
      <div v-else class="space-y-3">
        <div v-for="u in utilisateurs" :key="u.id"
          class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
            :class="u.role === 'ADMIN' ? 'bg-indigo-600' : u.role === 'SECRETAIRE' ? 'bg-green-600' : 'bg-gray-400'">
            {{ u.prenom?.charAt(0) }}{{ u.nom?.charAt(0) }}
          </div>

          <!-- Infos -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-semibold text-gray-800">{{ u.nom }} {{ u.prenom }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', roleBadge(u.role)]">
                {{ roleLabel(u.role) }}
              </span>
              <span v-if="!u.actif" class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Désactivé</span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5">{{ u.email }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Créé le {{ formatDate(u.createdAt) }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="editUser(u)" class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Modifier">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button @click="deleteUser(u)" class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Supprimer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="utilisateurs.length === 0" class="text-center py-10 text-gray-400">
          <span class="text-4xl block mb-2">👤</span>
          <p>Aucun utilisateur</p>
        </div>
      </div>
    </div>

    <!-- Explication des rôles -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="font-bold text-gray-700 mb-4">📋 Description des rôles</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p class="font-bold text-indigo-700 mb-2">🔑 Administrateur</p>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>✅ Toutes les sections</li>
            <li>✅ Gestion des utilisateurs</li>
            <li>✅ Suppression de données</li>
            <li>✅ Configuration</li>
          </ul>
        </div>
        <div class="p-4 bg-green-50 rounded-xl border border-green-100">
          <p class="font-bold text-green-700 mb-2">📝 Secrétaire</p>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>✅ Membres, Cultes, Présences</li>
            <li>✅ Finances, Programmes</li>
            <li>✅ Annonces, Prédications</li>
            <li>❌ Gestion des utilisateurs</li>
          </ul>
        </div>
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p class="font-bold text-gray-700 mb-2">👁️ Lecteur</p>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>✅ Consultation uniquement</li>
            <li>❌ Ajout / modification</li>
            <li>❌ Suppression</li>
            <li>❌ Export</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const utilisateurs = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const errorMsg = ref('')
const showForm = ref(false)
const showPwd = ref(false)
const editItem = ref(null)

const form = reactive({ nom: '', prenom: '', email: '', motDePasse: '', role: 'SECRETAIRE', actif: true })

const fetchUsers = async () => {
  isLoading.value = true
  try { utilisateurs.value = await $fetch('/api/utilisateurs') || [] }
  catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchUsers)

const toggleForm = () => { showForm.value = !showForm.value; if (!showForm.value) closeForm() }

const closeForm = () => {
  showForm.value = false
  editItem.value = null
  showPwd.value = false
  errorMsg.value = ''
  Object.assign(form, { nom: '', prenom: '', email: '', motDePasse: '', role: 'SECRETAIRE', actif: true })
}

const editUser = (u) => {
  editItem.value = u
  Object.assign(form, { nom: u.nom, prenom: u.prenom, email: u.email, motDePasse: '', role: u.role, actif: u.actif })
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const save = async () => {
  errorMsg.value = ''
  if (!form.nom || !form.prenom || !form.email || !form.role) {
    errorMsg.value = 'Nom, prénom, email et rôle sont obligatoires'
    return
  }
  if (!editItem.value && !form.motDePasse) {
    errorMsg.value = 'Le mot de passe est obligatoire pour un nouvel utilisateur'
    return
  }
  isSaving.value = true
  try {
    if (editItem.value) {
      await $fetch(`/api/utilisateurs/${editItem.value.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/utilisateurs', { method: 'POST', body: form })
    }
    closeForm()
    fetchUsers()
  } catch (e) {
    errorMsg.value = e.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    isSaving.value = false
  }
}

const deleteUser = async (u) => {
  if (!confirm(`Supprimer l'utilisateur ${u.nom} ${u.prenom} ?\nCette action est irréversible.`)) return
  try {
    await $fetch(`/api/utilisateurs/${u.id}`, { method: 'DELETE' })
    fetchUsers()
  } catch (e) {
    alert(e.data?.message || 'Erreur lors de la suppression')
  }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'
const roleLabel = (r) => ({ ADMIN: '🔑 Admin', SECRETAIRE: '📝 Secrétaire', LECTEUR: '👁️ Lecteur' }[r] || r)
const roleBadge = (r) => ({ ADMIN: 'bg-indigo-100 text-indigo-800', SECRETAIRE: 'bg-green-100 text-green-800', LECTEUR: 'bg-gray-100 text-gray-700' }[r] || 'bg-gray-100 text-gray-700')
</script>
