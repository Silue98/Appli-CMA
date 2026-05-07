<template>
  <!-- Mobile top bar -->
  <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-700 to-blue-700 text-white p-4">
    <div class="flex items-center justify-between">
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 rounded-lg hover:bg-green-600 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <span class="font-bold">⛪ CMA DOKUI1</span>
      <div class="w-10"></div>
    </div>
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40 mt-16" @click="isMobileMenuOpen = false"></div>
    <div v-if="isMobileMenuOpen" class="fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-b from-green-800 to-blue-900 z-50 overflow-y-auto">
      <nav class="p-4">
        <div v-for="group in menuGroups" :key="group.label" class="mb-4">
          <p class="text-xs font-semibold text-green-300 uppercase tracking-wider px-2 mb-1">{{ group.label }}</p>
          <ul class="space-y-0.5">
            <li v-for="item in group.items.filter(i => peutVoir(i.roles))" :key="item.section">
              <button @click="navigateAndClose(item.section)"
                :class="['w-full text-left p-2.5 rounded-lg transition flex items-center gap-3 text-sm', activeSection === item.section ? 'bg-white/25 font-semibold' : 'hover:bg-white/10']">
                <span class="w-5 text-center">{{ item.icon }}</span>{{ item.label }}
              </button>
            </li>
          </ul>
        </div>
        <div class="mt-4 pt-4 border-t border-green-600">
          <div v-if="user" class="px-2 py-2 mb-2 text-sm text-green-200">{{ user.prenom }} {{ user.nom }} — {{ user.role }}</div>
          <button @click="handleLogout" class="w-full text-left p-2.5 rounded-lg hover:bg-red-600 transition flex items-center gap-3 text-red-200 hover:text-white text-sm">
            🚪 Déconnexion
          </button>
        </div>
      </nav>
    </div>
  </div>

  <!-- Desktop sidebar -->
  <aside class="hidden lg:flex w-60 bg-gradient-to-b from-green-700 to-blue-800 text-white flex-col h-screen sticky top-0 overflow-hidden">
    <div class="p-4 border-b border-green-600/50">
      <p class="text-lg font-bold">⛪ CMA DOKUI1</p>
      <p class="text-xs text-green-200 mt-0.5">Gestion complète</p>
    </div>

    <nav class="flex-1 overflow-y-auto py-2">
      <div v-for="group in menuGroups" :key="group.label" class="mb-3">
        <p class="text-xs font-semibold text-green-300 uppercase tracking-wider px-3 mb-1">{{ group.label }}</p>
        <ul class="space-y-0.5 px-2">
          <li v-for="item in group.items.filter(i => peutVoir(i.roles))" :key="item.section">
            <button @click="$emit('navigate', item.section)"
              :class="['w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2.5 text-sm', activeSection === item.section ? 'bg-white/25 font-semibold' : 'hover:bg-white/10']">
              <span class="w-4 text-center text-base flex-shrink-0">{{ item.icon }}</span>
              <span class="truncate">{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-3 border-t border-green-600/50">
      <div v-if="user" class="mb-2 px-2 py-2 rounded-lg bg-white/10">
        <p class="text-xs text-green-200">Connecté</p>
        <p class="text-sm font-semibold truncate">{{ user.prenom }} {{ user.nom }}</p>
        <p class="text-xs text-green-300">{{ roleLabel(user.role) }}</p>
      </div>
      <button @click="handleLogout" class="w-full text-left px-3 py-2 rounded-lg hover:bg-red-600/80 transition flex items-center gap-2 text-red-200 hover:text-white text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Déconnexion
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activeSection: { type: String, default: 'dashboard' },
  user: { type: Object, default: null }
})
const emit = defineEmits(['navigate', 'logout'])
const isMobileMenuOpen = ref(false)

const menuGroups = [
  {
    label: 'Principal',
    items: [
      { section: 'dashboard',     icon: '📊', label: 'Tableau de bord',   roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','TRESORIER','LECTEUR'] },
    ]
  },
  {
    label: 'Membres & Église',
    items: [
      { section: 'membres',       icon: '👥', label: 'Membres',           roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'departements',  icon: '🏛️', label: 'Départements',     roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'actes',         icon: '✝️', label: 'Actes pastoraux',  roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
    ]
  },
  {
    label: 'Culte',
    items: [
      { section: 'cultes',        icon: '⛪', label: 'Cultes',            roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'predications',  icon: '📖', label: 'Prédications',     roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'programmes',    icon: '📅', label: 'Programmes',       roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
      { section: 'impression',    icon: '🖨️', label: 'Impression',      roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
      { section: 'annonces',      icon: '📢', label: 'Annonces',         roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'presences',     icon: '✅', label: 'Présences',        roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
    ]
  },
  {
    label: 'Événements',
    items: [
      { section: 'evenements',    icon: '🎉', label: 'Événements',       roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
    ]
  },
  {
    label: 'Finances',
    items: [
      { section: 'finances',      icon: '💰', label: 'Finances',         roles: ['SUPER_ADMIN','ADMIN','PASTEUR','TRESORIER'] },
      { section: 'dimes',         icon: '💎', label: 'Dîmes',           roles: ['SUPER_ADMIN','ADMIN','PASTEUR','TRESORIER'] },
      { section: 'budgets',       icon: '📊', label: 'Budgets',         roles: ['SUPER_ADMIN','ADMIN','PASTEUR','TRESORIER'] },
    ]
  },
  {
    label: 'Pastorale',
    items: [
      { section: 'cellules',      icon: '🏘️', label: 'Cellules/Zones', roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
      { section: 'pastoral',      icon: '🙏', label: 'Suivi pastoral', roles: ['SUPER_ADMIN','ADMIN','PASTEUR'] },
    ]
  },
  {
    label: 'Ressources',
    items: [
      { section: 'inventaire',    icon: '📦', label: 'Inventaire',     roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
      { section: 'benevoles',     icon: '🙋', label: 'Bénévoles',     roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE'] },
    ]
  },
  {
    label: 'Administration',
    items: [
      { section: 'activites',     icon: '🎯', label: 'Activités',       roles: ['SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','LECTEUR'] },
      { section: 'utilisateurs',  icon: '👤', label: 'Utilisateurs',    roles: ['SUPER_ADMIN','ADMIN'] },
      { section: 'inscriptions',  icon: '📝', label: 'Inscriptions',    roles: ['SUPER_ADMIN','ADMIN','SECRETAIRE'] },
    ]
  }
]

const peutVoir = (roles) => {
  const role = props.user?.role || 'LECTEUR'
  return roles.includes(role)
}

const roleLabel = (r) => ({
  SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', PASTEUR: 'Pasteur',
  SECRETAIRE: 'Secrétaire', TRESORIER: 'Trésorier', LECTEUR: 'Lecteur'
}[r] || r)

const navigateAndClose = (section) => {
  emit('navigate', section)
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  try { await $fetch('/api/auth/logout', { method: 'POST' }) } catch {}
  emit('logout')
  await navigateTo('/login')
}
</script>
