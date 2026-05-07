<template>
  <div class="min-h-screen bg-gray-100 flex">
    <Sidebar :activeSection="activeSection" :user="user" @navigate="setSection"/>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="lg:hidden bg-white shadow sticky top-16 z-30">
        <div class="px-4 py-3 flex items-center justify-between">
          <button v-if="activeSection !== 'dashboard'" @click="setSection('dashboard')" class="p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <h1 class="text-base font-bold text-gray-800 flex-1 text-center">{{ sectionTitles[activeSection] || 'CMA DOKUI1' }}</h1>
          <div v-if="activeSection !== 'dashboard'" class="w-9"></div>
        </div>
      </div>
      <Header :title="sectionTitles[activeSection] || 'Tableau de bord'" :user="user" class="hidden lg:flex"/>
      <main class="flex-1 p-4 lg:p-6 min-w-0">
        <transition name="fade" mode="out-in">
          <div v-if="activeSection === 'dashboard'" key="dashboard" class="space-y-5">
            <div class="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold mb-1">⛪ CMA DOKUI1</h2>
                  <p class="text-white/80 text-sm">{{ user ? user.prenom + ' ' + user.nom + ' — ' + roleLabel(user.role) : 'Gestion complète' }}</p>
                </div>
                <div class="text-right hidden sm:block">
                  <p class="text-3xl font-bold">{{ stats ? stats.totalMembres : '…' }}</p>
                  <p class="text-white/80 text-sm">Membres inscrits</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Membres actifs</p>
                <p class="text-2xl font-bold text-green-600">{{ stats ? stats.membresActifs : '…' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ stats ? stats.membresVisiteurs : 0 }} visiteurs</p>
              </div>
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Départements</p>
                <p class="text-2xl font-bold text-blue-600">{{ stats ? stats.totalDepartements : '…' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ stats ? stats.evenementsAVenir : 0 }} événements à venir</p>
              </div>
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Offrandes ce mois</p>
                <p class="text-xl font-bold text-orange-500">{{ stats ? formatMontant(stats.offradesMois) : '…' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ stats ? formatMontant(stats.offradeAnnee) : '' }} cette année</p>
              </div>
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Actes pastoraux</p>
                <p class="text-2xl font-bold text-purple-600">{{ stats ? stats.actesAnnee : '…' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ stats ? stats.totalPredications : 0 }} prédications</p>
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-gray-700">👥 Derniers inscrits</h3>
                  <button @click="setSection('membres')" class="text-xs text-green-600 hover:underline">Voir tous →</button>
                </div>
                <div v-if="stats && stats.derniersMembres && stats.derniersMembres.length" class="space-y-2">
                  <div v-for="m in stats.derniersMembres" :key="m.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', m.sexe === 'HOMME' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                      {{ m.prenom && m.prenom.charAt(0) }}{{ m.nom && m.nom.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ m.nom }} {{ m.prenom }}</p>
                      <p class="text-xs text-gray-400">{{ formatRelativeDate(m.dateInscription) }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="text-center text-gray-400 py-6 text-sm">{{ stats ? 'Aucun membre' : 'Chargement...' }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-gray-700">⛪ Derniers cultes</h3>
                  <button @click="setSection('cultes')" class="text-xs text-blue-600 hover:underline">Voir tous →</button>
                </div>
                <div v-if="stats && stats.derniersCultes && stats.derniersCultes.length" class="space-y-3">
                  <div v-for="c in stats.derniersCultes" :key="c.id" class="border border-gray-200 rounded-xl p-3">
                    <p class="text-xs text-blue-600 font-medium">{{ formatDate(c.dateCulte) }}</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ c.themePrincipal || 'Sans thème' }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ c._count && c._count.presences }} présences</p>
                  </div>
                </div>
                <p v-else class="text-center text-gray-400 py-6 text-sm">{{ stats ? 'Aucun culte' : 'Chargement...' }}</p>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 class="font-bold text-gray-700 mb-4">⚡ Accès rapides</h3>
              <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                <button v-for="a in actionsRapides" :key="a.section" @click="setSection(a.section)"
                  :class="['p-4 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition', a.bg]">
                  <span class="text-2xl">{{ a.icon }}</span>
                  <span class="text-xs font-medium text-white text-center leading-tight">{{ a.label }}</span>
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="activeSection === 'membres'"      key="membres">      <MembersPanel/></div>
          <div v-else-if="activeSection === 'departements'" key="departements"> <DepartementsPanel/></div>
          <div v-else-if="activeSection === 'actes'"        key="actes">        <ActesPanel/></div>
          <div v-else-if="activeSection === 'cultes'"       key="cultes">       <CultesPanel/></div>
          <div v-else-if="activeSection === 'predications'" key="predications"> <PredicationsPanel/></div>
          <div v-else-if="activeSection === 'programmes'"   key="programmes">   <ProgrammePanel/></div>
          <div v-else-if="activeSection === 'impression'"   key="impression">   <ImprimerProgramme/></div>
          <div v-else-if="activeSection === 'annonces'"     key="annonces">     <AnnoncesPanel/></div>
          <div v-else-if="activeSection === 'presences'"    key="presences">    <PresencesPanel/></div>
          <div v-else-if="activeSection === 'evenements'"   key="evenements">   <EvenementsPanel/></div>
          <div v-else-if="activeSection === 'finances'"     key="finances">     <FinancesPanel/></div>
          <div v-else-if="activeSection === 'dimes'"        key="dimes">        <DimesPanel/></div>
          <div v-else-if="activeSection === 'budgets'"      key="budgets">      <BudgetsPanel/></div>
          <div v-else-if="activeSection === 'activites'"    key="activites">    <ActivitesPanel/></div>
          <div v-else-if="activeSection === 'utilisateurs'" key="utilisateurs"> <UtilisateursPanel/></div>
          <div v-else-if="activeSection === 'cellules'"     key="cellules">     <CellulesPanel/></div>
          <div v-else-if="activeSection === 'pastoral'"     key="pastoral">     <PastoralPanel/></div>
          <div v-else-if="activeSection === 'inventaire'"   key="inventaire">   <InventairePanel/></div>
          <div v-else-if="activeSection === 'benevoles'"    key="benevoles">    <BenevolesPanel/></div>
          <div v-else-if="activeSection === 'inscriptions'" key="inscriptions"> <InscriptionPanel/></div>
          <div v-else-if="activeSection === 'emails'"        key="emails">        <EmailPanel/></div>
          <div v-else-if="activeSection === 'settings'"      key="settings">      <SettingsPanel/></div>
        </transition>
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const activeSection = ref('dashboard')
const stats = ref(null)
const user = ref(null)
const sectionTitles = {
  dashboard:'Tableau de bord', membres:'Membres', departements:'Départements',
  actes:'Actes Pastoraux', cultes:'Cultes', predications:'Prédications',
  programmes:'Programmes', impression:'Impression', annonces:'Annonces',
  presences:'Présences', evenements:'Événements', finances:'Finances',
  dimes:'Dîmes', budgets:'Budgets', activites:'Activités', utilisateurs:'Utilisateurs', inscriptions:'📝 Inscriptions'
}
const actionsRapides = [
  { section:'membres',    icon:'👥', label:'Membres',    bg:'bg-green-600' },
  { section:'presences',  icon:'✅', label:'Présences',  bg:'bg-blue-600' },
  { section:'finances',   icon:'💰', label:'Finances',   bg:'bg-orange-500' },
  { section:'evenements', icon:'🎉', label:'Événements', bg:'bg-purple-600' },
  { section:'impression', icon:'🖨️', label:'Imprimer', bg:'bg-teal-600' },
  { section:'actes',      icon:'✝️', label:'Actes',     bg:'bg-indigo-600' },
]
const setSection = (s) => { activeSection.value = s; window.scrollTo({top:0,behavior:'smooth'}); if(s==='dashboard') loadStats() }
const loadStats = async () => { try { stats.value = await $fetch('/api/stats') } catch(e){console.error(e)} }
const loadUser = async () => { try { user.value = await $fetch('/api/auth/me') } catch { await navigateTo('/login') } }
const roleLabel = (r) => ({SUPER_ADMIN:'Super Admin',ADMIN:'Admin',PASTEUR:'Pasteur',SECRETAIRE:'Secrétaire',TRESORIER:'Trésorier',LECTEUR:'Lecteur'}[r]||r)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}) : '—'
const formatRelativeDate = (d) => { if(!d) return ''; const diff=Math.floor((Date.now()-new Date(d))/86400000); if(diff===0) return "Aujourd'hui"; if(diff<30) return `Il y a ${diff}j`; return `Il y a ${Math.floor(diff/30)} mois` }
const formatMontant = (v) => v ? new Intl.NumberFormat('fr-FR').format(v)+' FCFA' : '0 FCFA'
onMounted(async () => { await loadUser(); await loadStats() })
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
