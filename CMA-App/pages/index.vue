<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar @navigate="setSection" />

    <div class="flex-1 flex flex-col">
      <Header title="Tableau de bord de l'Église" />

      <main class="p-6 space-y-6">
        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Membres actifs" value="325" icon="users" />
          <StatCard title="Offrandes du mois" value="1.2M CFA" icon="wallet" />
          <StatCard title="Événements à venir" value="3" icon="calendar" />
        </div>

        <!-- Section dynamique -->
        <div v-if="activeSection === 'membres'">
          <MembersPanel />
        </div>

        <div v-else-if="activeSection === 'activites'">
          <p class="text-gray-600 italic">📅 Gestion des activités (à venir)</p>
        </div>

        <div v-else-if="activeSection === 'finances'">
          <p class="text-gray-600 italic">💰 Gestion des finances (à venir)</p>
        </div>

        <div v-else-if="activeSection === 'messages'">
          <p class="text-gray-600 italic">💬 Gestion des messages (à venir)</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import StatCard from '~/components/StatCard.vue'
import MembersPanel from '~/components/MembersPanel.vue'

const activeSection = ref('dashboard')

const setSection = (section) => {
  activeSection.value = section
}
</script>
