<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Header title="Tableau de bord de l'Église" />

      <main class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Membres actifs" value="325" icon="users" />
        <StatCard title="Offrandes du mois" value="1.2M CFA" icon="wallet" />
        <StatCard title="Événements à venir" value="3" icon="calendar" />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import StatCard from '~/components/StatCard.vue'
</script>
