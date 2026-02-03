<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar (gérée par le composant Sidebar) -->
    <Sidebar @navigate="setSection" @logout="handleLogout" />

    <div class="flex-1 flex flex-col">
      <!-- Header avec bouton retour pour mobile -->
      <div class="lg:hidden bg-white shadow sticky top-0 z-30">
        <div class="px-4 py-3 flex items-center justify-between">
          <button
            v-if="activeSection !== 'dashboard'"
            @click="goBack"
            class="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <h1 class="text-lg font-bold text-gray-800 flex-1 text-center">
            {{ getSectionTitle(activeSection) }}
          </h1>
          
          <!-- Espaceur pour centrer le titre -->
          <div v-if="activeSection !== 'dashboard'" class="w-10"></div>
        </div>
      </div>

      <!-- Header principal pour desktop -->
      <Header title="Tableau de bord de l'Église" class=" lg:block" />

      <!-- Contenu principal avec largeur complète -->
      <div class="flex-1 w-full">
        <main class="p-4 lg:p-6 space-y-4 lg:space-y-6 w-full max-w-full">
          <!-- Statistiques responsive - VISIBLE IMMÉDIATEMENT -->
          <div v-if="activeSection === 'dashboard'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
            <StatCard 
              title="Membres actifs" 
              value="325" 
              icon="users" 
              change="+12%" 
              changeType="positive"
              class="h-full"
            />
            <StatCard 
              title="Offrandes du mois" 
              value="1.2M CFA" 
              icon="wallet" 
              change="+8%" 
              changeType="positive"
              class="h-full"
            />
            <StatCard 
              title="Événements à venir" 
              value="3" 
              icon="calendar" 
              change="Cette semaine"
              class="h-full"
            />
          </div>

          <!-- Quick actions pour mobile -->
          <div v-if="activeSection === 'dashboard'" class="lg:hidden bg-white rounded-xl shadow p-4">
            <h3 class="font-bold text-gray-700 mb-3">Actions rapides</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="setSection('membres')"
                class="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition flex flex-col items-center justify-center"
              >
                <svg class="w-6 h-6 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.028-1.932.09-2.895.185" />
                </svg>
                <span class="text-sm font-medium text-gray-700">Membres</span>
              </button>
              <button
                @click="setSection('cultes')"
                class="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex flex-col items-center justify-center"
              >
                <svg class="w-6 h-6 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">Cultes</span>
              </button>
            </div>
          </div>

          <!-- Dashboard welcome pour desktop - COULEUR DE FOND RESTAURÉE -->
          <div v-if="activeSection === 'dashboard'" class="hidden lg:block bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white w-full">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">Bienvenue à CMA DOKUI1</h2>
                <!-- Texte avec couleur de fond restaurée -->
                <p class="text-white/90 bg-gradient-to-r from-green-700/20 to-blue-700/20 px-4 py-2 rounded-lg inline-block">
                  Gérez efficacement votre communauté religieuse
                </p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold">325</p>
                <p class="text-white/90">Membres actifs</p>
              </div>
            </div>
          </div>

          <!-- Version alternative avec fond plus visible -->
          

          <!-- Section dynamique -->
          <transition name="fade" mode="out-in">
            <div v-if="activeSection === 'membres'" key="membres" class="w-full">
              <MembersPanel />
            </div>
            <div v-else-if="activeSection === 'cultes'" key="cultes" class="w-full">
              <CultesPanel />
            </div>
            <div v-else-if="activeSection === 'annonces'" key="annonces" class="w-full">
              <AnnoncesPanel />
            </div>
            <div v-else-if="activeSection === 'predications'" key="predications" class="w-full">
              <PredicationsPanel />
            </div>
            <div v-else-if="activeSection === 'activites'" key="activites" class="w-full">
              <div class="bg-white rounded-xl shadow p-6 w-full">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">🎯 Activités</h2>
                </div>
                <p class="text-gray-600">Gestion des activités (à venir)</p>
                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Cette section sera bientôt disponible</p>
                </div>
              </div>
            </div>
            <div v-else-if="activeSection === 'finances'" key="finances" class="w-full">
              <div class="bg-white rounded-xl shadow p-6 w-full">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-emerald-100 rounded-lg">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">💰 Finances</h2>
                </div>
                <p class="text-gray-600">Gestion des finances (à venir)</p>
                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Cette section sera bientôt disponible</p>
                </div>
              </div>
            </div>
            <div v-else-if="activeSection === 'messages'" key="messages" class="w-full">
              <div class="bg-white rounded-xl shadow p-6 w-full">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">💬 Messages</h2>
                </div>
                <p class="text-gray-600">Gestion des messages (à venir)</p>
                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Cette section sera bientôt disponible</p>
                </div>
              </div>
            </div>
            <div v-else-if="activeSection === 'dashboard'" key="dashboard" class="w-full">
              <!-- Dashboard content additionnel -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <!-- Derniers membres -->
                <div class="bg-white rounded-xl shadow p-6 w-full">
                  <h3 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.028-1.932.09-2.895.185" />
                    </svg>
                    Derniers membres inscrits
                  </h3>
                  <div class="space-y-3">
                    <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span class="text-green-600 font-medium">U{i}</span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">Membre {i}</p>
                        <p class="text-sm text-gray-500">Inscrit le 15/01/2024</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Prochains événements -->
                <div class="bg-white rounded-xl shadow p-6 w-full">
                  <h3 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Prochains événements
                  </h3>
                  <div class="space-y-3">
                    <div v-for="i in 2" :key="i" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div class="text-center">
                        <p class="text-lg font-bold text-blue-600">2{i}</p>
                        <p class="text-xs text-gray-500">Jan</p>
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">Culte du dimanche</p>
                        <p class="text-sm text-gray-500">09h00 - 12h00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Bouton flottant pour mobile - SEULEMENT quand on scroll -->
          <button
            v-if="showScrollTop && activeSection !== 'dashboard'"
            @click="scrollToTop"
            class="lg:hidden fixed bottom-6 right-6 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition z-40"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import StatCard from '~/components/StatCard.vue'
import MembersPanel from '~/components/MembersPanel.vue'
import CultesPanel from '~/components/CultesPanel.vue'
import AnnoncesPanel from '~/components/AnnoncesPanel.vue'
import PredicationsPanel from '~/components/PredicationsPanel.vue'

const activeSection = ref('dashboard')
const showScrollTop = ref(false)
const scrollPosition = ref(0)

// Titres des sections pour mobile
const sectionTitles = {
  dashboard: 'Tableau de bord',
  membres: 'Membres',
  cultes: 'Cultes',
  annonces: 'Annonces',
  predications: 'Prédications',
  activites: 'Activités',
  finances: 'Finances',
  messages: 'Messages'
}

const getSectionTitle = (section) => {
  return sectionTitles[section] || 'CMA DOKUI1'
}

const setSection = (section) => {
  activeSection.value = section
  // Réinitialiser le scroll
  scrollPosition.value = 0
  showScrollTop.value = false
  // Sur mobile, on scroll en haut quand on change de section
  if (window.innerWidth < 1024) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goBack = () => {
  activeSection.value = 'dashboard'
  scrollToTop()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  showScrollTop.value = false
}

const handleLogout = () => {
  // Logique de déconnexion
  console.log('Déconnexion')
  // Redirection vers la page de login
}

// Gestion du scroll pour le bouton "retour en haut"
const handleScroll = () => {
  scrollPosition.value = window.scrollY || document.documentElement.scrollTop
  // Afficher le bouton seulement après 300px de scroll
  showScrollTop.value = scrollPosition.value > 300
}

// Gestion du responsive avec écouteur d'événement
const handleResize = () => {
  // Si on est sur mobile et qu'on scroll, ajuster le bouton
  if (window.innerWidth < 1024) {
    handleScroll()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  
  // S'assurer qu'on est en haut de la page au chargement
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Animations de transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Amélioration du touch sur mobile */
button, [role="button"] {
  -webkit-tap-highlight-color: transparent;
}

/* Empêcher le zoom sur les inputs sur iOS */
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}

/* Largeur complète pour desktop */
@media (min-width: 1024px) {
  .flex-1.w-full {
    width: 100%;
  }
  
  main {
    width: 100%;
    max-width: 100%;
  }
}

/* Header desktop avec largeur complète */
/* Header desktop avec gradient vert/bleu */
.hidden.lg\:block {
  position: sticky;
  top: 0;
  z-index: 20;
  background: linear-gradient(to right, #059669, #2563eb); /* from-green-600 to-blue-600 */
  width: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: white;
}

/* Correction pour prendre toute la largeur disponible */
.min-h-screen.flex {
  width: 100vw;
}

.flex-1.flex-col {
  width: 100%;
}
</style>