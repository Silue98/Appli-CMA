<template>
  <aside class="w-64 bg-gradient-to-b from-green-700 to-blue-700 text-white flex flex-col">
    <div class="p-4 text-2xl font-bold text-white flex items-center gap-2">
      ⛪ ÉgliseApp
    </div>

    <nav class="flex-1">
      <ul class="space-y-1 p-2">
        <li>
          <button
            @click="$emit('navigate', 'dashboard')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition"
          >
            📊 Tableau de bord
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'membres')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition"
          >
            👥 Membres
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'activites')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition"
          >
            🎯 Activités
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'finances')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition"
          >
            💰 Finances
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', 'messages')"
            class="block w-full text-left p-2 rounded hover:bg-green-600 transition"
          >
            💬 Messages
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
