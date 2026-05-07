<template>
  <div class="space-y-6">

    <!-- ══════════════════════════════════════════
         SECTION CONFIG : Contrôle de l'URL
    ═══════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            🔗 Lien d'inscription public
          </h2>
          <p class="text-sm text-gray-500 mt-0.5">Contrôlez l'accès au formulaire d'inscription</p>
        </div>
        <!-- Badge état -->
        <span :class="['px-3 py-1 rounded-full text-sm font-semibold', config.estOuvert ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
          {{ config.estOuvert ? '🟢 Ouvert' : '🔴 Fermé' }}
        </span>
      </div>

      <!-- URL publique -->
      <div class="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500 mb-1">URL publique d'inscription</p>
          <p class="text-sm font-mono text-blue-600 truncate">{{ urlPublique }}</p>
        </div>
        <button @click="copierURL"
          class="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition">
          {{ copie ? '✅ Copié !' : '📋 Copier' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Switch ON/OFF -->
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Activation manuelle</span>
            <button @click="toggleActif"
              :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                config.actif ? 'bg-green-500' : 'bg-gray-300']">
              <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow',
                config.actif ? 'translate-x-6' : 'translate-x-1']"/>
            </button>
          </div>
          <p class="text-xs text-gray-400">{{ config.actif ? 'Les inscriptions sont activées' : 'Les inscriptions sont désactivées' }}</p>
        </div>

        <!-- Période automatique -->
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p class="text-sm font-medium text-gray-700 mb-2">Période automatique (optionnelle)</p>
          <div class="space-y-2">
            <div>
              <label class="text-xs text-gray-500">Du</label>
              <input v-model="editConfig.dateDebut" type="datetime-local"
                class="w-full mt-0.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-green-400 outline-none"/>
            </div>
            <div>
              <label class="text-xs text-gray-500">Au</label>
              <input v-model="editConfig.dateFin" type="datetime-local"
                class="w-full mt-0.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-green-400 outline-none"/>
            </div>
          </div>
        </div>

        <!-- Message ouvert -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Message quand ouvert</label>
          <textarea v-model="editConfig.messageOuvert" rows="2"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"/>
        </div>

        <!-- Message fermé -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Message quand fermé</label>
          <textarea v-model="editConfig.messageFerme" rows="2"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"/>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="sauvegarderConfig" :disabled="sauvegarde"
          class="px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition disabled:opacity-60 flex items-center gap-2">
          <span v-if="sauvegarde" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          💾 Sauvegarder la configuration
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         SECTION DEMANDES
    ═══════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-gray-800">📋 Demandes d'inscription</h2>
          <p class="text-sm text-gray-500 mt-0.5">{{ demandes.length }} demande(s) au total</p>
        </div>
        <div class="flex gap-2">
          <button v-for="s in statutsFiltres" :key="s.val"
            @click="filtreStatut = s.val"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition',
              filtreStatut === s.val ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- Liste demandes -->
      <div v-if="loadingDemandes" class="py-8 text-center text-gray-400">Chargement…</div>

      <div v-else-if="demandesFiltrees.length === 0" class="py-8 text-center text-gray-400">
        <p class="text-2xl mb-2">📭</p>
        <p class="text-sm">Aucune demande {{ filtreStatut !== 'TOUS' ? 'avec ce statut' : '' }}</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="d in demandesFiltrees" :key="d.id"
          class="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
          <div class="flex items-start gap-3">
            <!-- Photo -->
            <div class="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border-2 border-white shadow">
              <img v-if="d.photo" :src="d.photo" alt="" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-semibold text-gray-800">{{ d.prenom }} {{ d.nom }}</p>
                <span class="text-xs text-gray-500">{{ d.sexe }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', statutClass(d.statut)]">
                  {{ statutLabel(d.statut) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                <span v-if="d.contact">📞 {{ d.contact }}</span>
                <span v-if="d.email">✉️ {{ d.email }}</span>
                <span v-if="d.adresse">📍 {{ d.adresse }}</span>
                <span v-if="d.profession">💼 {{ d.profession }}</span>
                <span v-if="d.dateBaptemes">✝️ Baptisé(e) le {{ formatDate(d.dateBaptemes) }}</span>
                <span v-if="d.activiteAuSeinDP">🏛️ Groupe : {{ d.activiteAuSeinDP }}</span>
                <span v-if="d.dateEntreeAleglise">⛪ Intégration église : {{ formatDate(d.dateEntreeAleglise) }}</span>
                <span v-if="d.dateEntreeDepartement">📅 Intégration groupe : {{ formatDate(d.dateEntreeDepartement) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">Reçue le {{ formatDate(d.createdAt) }}</p>
            </div>

            <!-- Actions -->
            <div v-if="d.statut === 'EN_ATTENTE'" class="flex gap-2 flex-shrink-0">
              <button @click="ouvrirDecision(d, 'ACCEPTE')"
                class="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition">
                ✅ Accepter
              </button>
              <button @click="ouvrirDecision(d, 'REFUSE')"
                class="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
                ❌ Refuser
              </button>
            </div>
            <div v-else class="text-xs text-gray-400 flex-shrink-0">
              Traité
            </div>
          </div>

          <!-- Notes admin si présentes -->
          <div v-if="d.notesAdmin" class="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-500 border-l-2 border-gray-300">
            Note : {{ d.notesAdmin }}
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL DÉCISION
    ═══════════════════════════════════════════ -->
    <div v-if="modal.visible" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="modal.visible = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-1">
          {{ modal.statut === 'ACCEPTE' ? '✅ Accepter la demande' : '❌ Refuser la demande' }}
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          {{ modal.demande?.prenom }} {{ modal.demande?.nom }}
          <span v-if="modal.statut === 'ACCEPTE'" class="text-green-600"> sera créé comme membre (statut VISITEUR).</span>
          <span v-else class="text-red-500"> ne sera pas admis.</span>
        </p>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-600 mb-1">Note interne (optionnelle)</label>
          <textarea v-model="modal.notes" rows="3" placeholder="Raison, remarque…"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"/>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="modal.visible = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition">
            Annuler
          </button>
          <button @click="confirmerDecision" :disabled="modal.envoi"
            :class="['px-4 py-2 text-white rounded-xl text-sm transition disabled:opacity-60 flex items-center gap-2',
              modal.statut === 'ACCEPTE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600']">
            <span v-if="modal.envoi" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            {{ modal.statut === 'ACCEPTE' ? 'Confirmer l\'acceptation' : 'Confirmer le refus' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ─── Config ────────────────────────────────────────────────────
const config = ref({ actif: false, estOuvert: false, dateDebut: null, dateFin: null, messageOuvert: '', messageFerme: '' })
const editConfig = ref({ dateDebut: '', dateFin: '', messageOuvert: '', messageFerme: '' })
const sauvegarde = ref(false)
const copie = ref(false)

const urlPublique = computed(() => {
  if (typeof window !== 'undefined') return `${window.location.origin}/inscription`
  return '/inscription'
})

const chargerConfig = async () => {
  const c = await $fetch('/api/inscription/config')
  config.value = c
  editConfig.value = {
    dateDebut:      c.dateDebut ? new Date(c.dateDebut).toISOString().slice(0,16) : '',
    dateFin:        c.dateFin   ? new Date(c.dateFin).toISOString().slice(0,16)   : '',
    messageOuvert:  c.messageOuvert || '',
    messageFerme:   c.messageFerme  || ''
  }
}

const toggleActif = async () => {
  const c = await $fetch('/api/inscription/config', {
    method: 'PUT',
    body: { actif: !config.value.actif }
  })
  config.value = c
}

const parseDateTime = (val) => {
  if (!val) return null
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : val
}

const sauvegarderConfig = async () => {
  sauvegarde.value = true
  try {
    const c = await $fetch('/api/inscription/config', {
      method: 'PUT',
      body: {
        // Envoyer null si la date saisie est invalide ou vide
        dateDebut:     parseDateTime(editConfig.value.dateDebut),
        dateFin:       parseDateTime(editConfig.value.dateFin),
        messageOuvert: editConfig.value.messageOuvert,
        messageFerme:  editConfig.value.messageFerme
      }
    })
    config.value = c
  } finally {
    sauvegarde.value = false
  }
}

const copierURL = async () => {
  await navigator.clipboard.writeText(urlPublique.value)
  copie.value = true
  setTimeout(() => copie.value = false, 2000)
}

// ─── Demandes ──────────────────────────────────────────────────
const demandes = ref([])
const loadingDemandes = ref(true)
const filtreStatut = ref('TOUS')

const statutsFiltres = [
  { val: 'TOUS',       label: 'Toutes' },
  { val: 'EN_ATTENTE', label: '⏳ En attente' },
  { val: 'ACCEPTE',    label: '✅ Acceptées' },
  { val: 'REFUSE',     label: '❌ Refusées' }
]

const demandesFiltrees = computed(() =>
  filtreStatut.value === 'TOUS'
    ? demandes.value
    : demandes.value.filter(d => d.statut === filtreStatut.value)
)

const chargerDemandes = async () => {
  loadingDemandes.value = true
  try {
    demandes.value = await $fetch('/api/demandes-inscription')
  } finally {
    loadingDemandes.value = false
  }
}

const statutLabel = (s) => ({ EN_ATTENTE: 'En attente', ACCEPTE: 'Acceptée', REFUSE: 'Refusée' }[s] || s)
const statutClass = (s) => ({
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  ACCEPTE:    'bg-green-100 text-green-700',
  REFUSE:     'bg-red-100 text-red-600'
}[s] || '')

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : ''

// ─── Modal décision ────────────────────────────────────────────
const modal = ref({ visible: false, demande: null, statut: '', notes: '', envoi: false })

const ouvrirDecision = (demande, statut) => {
  modal.value = { visible: true, demande, statut, notes: '', envoi: false }
}

const confirmerDecision = async () => {
  modal.value.envoi = true
  try {
    await $fetch(`/api/demandes-inscription/${modal.value.demande.id}`, {
      method: 'PUT',
      body: { statut: modal.value.statut, notesAdmin: modal.value.notes }
    })
    modal.value.visible = false
    await chargerDemandes()
  } finally {
    modal.value.envoi = false
  }
}

onMounted(async () => {
  await chargerConfig()
  await chargerDemandes()
})
</script>
