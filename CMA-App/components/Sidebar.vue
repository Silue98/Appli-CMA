<template>
  <aside class="w-64 min-h-screen bg-gradient-to-b from-green-600 to-blue-700 text-white flex flex-col shadow-lg">
    <!-- Logo / Titre -->
    <div class="p-5 text-2xl font-extrabold tracking-wide flex items-center space-x-2 border-b border-white/10">
      <span>⛪</span>
      <span>ÉgliseApp</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 mt-4">
      <ul class="space-y-2 p-2">
        <li>
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-layout-dashboard text-white/80"></i>
            <span>Dashboard</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/membres"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-users text-white/80"></i>
            <span>Membres</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/activites"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-calendar text-white/80"></i>
            <span>Activités</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/finances"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-wallet text-white/80"></i>
            <span>Finances</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/messages"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-message-square text-white/80"></i>
            <span>Prédications</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/messages"
            class="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/15"
          >
            <i class="lucide-message-square text-white/80"></i>
            <span>Messages</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Pied du menu -->
    <div class="p-4 text-sm text-white/70 border-t border-white/10">
      © {{ new Date().getFullYear() }} CMA DOKUI 1
    </div>
  </aside>
</template>
