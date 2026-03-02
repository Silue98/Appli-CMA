<template>
  <!-- Menu hamburger pour mobile -->
  <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-700 to-blue-700 text-white p-4">
    <div class="flex items-center justify-between">
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 rounded-lg hover:bg-green-600 transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            v-if="!isMobileMenuOpen" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16" 
          />
          <path 
            v-else 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
      
      <div class="text-xl font-bold flex items-center gap-2">
        ⛪ CMA DOKUI1
      </div>
      
      <div class="w-10"> <!-- Espaceur pour centrer le titre --> </div>
    </div>
    
    <!-- Menu mobile overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 mt-16"
      @click="isMobileMenuOpen = false"
    ></div>
    
    <!-- Menu mobile -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-b from-green-800 to-blue-800 text-white z-50 overflow-y-auto"
    >
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <button
              @click="navigateAndClose('dashboard')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              📊 Tableau de bord
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('membres')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.028-1.932.09-2.895.185" />
              </svg>
              👥 Membres
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('cultes')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ⛪ Cultes
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('predications')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              📖 Prédications
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('annonces')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              📢 Annonces
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('activites')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              🎯 Activités
            </button>
          </li>
          
 <li>
            <button
              @click="navigateAndClose('annonces')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              📢 Annonces
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('activites')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              🎯 Activités
            </button>
          </li>

          <li>
            <button
              @click="navigateAndClose('finances')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              💰 Finances
            </button>
          </li>
          <li>
            <button
              @click="navigateAndClose('messages')"
              class="block w-full text-left p-3 rounded-lg hover:bg-green-600 transition flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              💬 Messages
            </button>
          </li>
        </ul>
        
        <!-- Bouton de déconnexion en bas sur mobile -->
        <div class="mt-8 pt-4 border-t border-green-600">
          <button
            @click="$emit('logout')"
            class="block w-full text-left p-3 rounded-lg hover:bg-red-600 transition flex items-center gap-3 text-red-200 hover:text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  </div>

  <!-- Sidebar pour desktop -->
  <aside class="hidden lg:flex w-64 bg-gradient-to-b from-green-700 to-blue-700 text-white flex-col h-screen sticky top-0">
    <div class="p-4 text-2xl font-bold text-white flex items-center gap-2">
      ⛪ CMA DOKUI1
    </div>

    <nav class="flex-1">
      <ul class="space-y-1 p-2">
        <li>
          <button
            @click="$emit('navigate', 'dashboard')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            📊 Tableau de bord
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'membres')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.028-1.932.09-2.895.185" />
            </svg>
            👥 Membres
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'cultes')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ⛪ Cultes
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'predications')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            📖 Prédications
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'annonces')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            📢 Annonces
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'activites')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            🎯 Activités
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'finances')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💰 Finances
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'messages')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            💬 Messages
          </button>
        </li>
      </ul>
    </nav>
    
    <!-- Bouton de déconnexion en bas sur desktop -->
    <div class="p-4 border-t border-green-600">
      <button
        @click="$emit('logout')"
        class="block w-full text-left p-2 rounded hover:bg-red-600 transition flex items-center gap-3 text-red-200 hover:text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Déconnexion
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navigateAndClose = (page) => {
  emit('navigate', page)
  isMobileMenuOpen.value = false
}

const emit = defineEmits(['navigate', 'logout'])
</script>

<style scoped>
/* Animation pour le menu mobile */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Empêcher le scroll du body quand le menu est ouvert */
body.menu-open {
  overflow: hidden;
}
</style>