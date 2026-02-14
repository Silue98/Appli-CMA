<template>
  <div class="p-4 sm:p-6">
    <!-- En-tête responsive -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-blue-700 flex items-center gap-2">
          📅 Programmes des Cultes
        </h1>
        <p class="text-gray-600 text-sm mt-1">Gestion des programmes et affectations des membres</p>
      </div>
      
      <!-- Boutons d'action responsive -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          @click="printAllProgrammes"
          :disabled="filteredProgrammes.length === 0"
          class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span class="hidden sm:inline">Tout imprimer</span>
          <span class="sm:hidden">Imprimer tout</span>
        </button>
        <button
          @click="showForm = !showForm"
          class="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg v-if="!showForm" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ showForm ? 'Fermer' : 'Nouveau' }}
        </button>
      </div>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Recherche -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par date, thème, membre..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Filtres de tri -->
        <div class="flex flex-col sm:flex-row gap-2">
          <!-- Tri par date -->
          <select
            v-model="sortField"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="date">Trier par date</option>
            <option value="semaine">Trier par semaine</option>
            <option value="theme">Trier par thème</option>
          </select>

          <!-- Ordre de tri -->
          <button
            @click="toggleSortOrder"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="sortOrder === 'desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {{ sortOrder === 'desc' ? 'Décroissant' : 'Croissant' }}
          </button>

          <!-- Filtre par statut -->
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tous les états</option>
            <option value="planifié">Planifié</option>
            <option value="confirmé">Confirmé</option>
            <option value="terminé">Terminé</option>
            <option value="annulé">Annulé</option>
          </select>

          <!-- Filtre par culte -->
          <select
            v-model="culteFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tous les cultes</option>
            <option value="premier">Premier culte</option>
            <option value="deuxieme">Deuxième culte</option>
            <option value="troisieme">Troisième culte</option>
          </select>
        </div>
      </div>

      <!-- Informations de filtrage -->
      <div v-if="searchQuery || statusFilter !== 'all' || culteFilter !== 'all'" class="mt-3 flex flex-wrap gap-2 items-center text-sm">
        <span class="text-gray-600">Filtres actifs :</span>
        <span v-if="searchQuery" class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Recherche: "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="text-blue-600 hover:text-blue-800">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span v-if="statusFilter !== 'all'" class="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
          {{ getStatusLabel(statusFilter) }}
          <button @click="statusFilter = 'all'" class="text-green-600 hover:text-green-800">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span v-if="culteFilter !== 'all'" class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          {{ getCulteLabel(culteFilter) }}
          <button @click="culteFilter = 'all'" class="text-purple-600 hover:text-purple-800">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-6 transition-all duration-300">
      <ProgrammeForm
        @saved="handleSaved"
        @close="showForm = false"
      />
    </div>

    <!-- Version mobile : cartes -->
    <div v-if="filteredProgrammes.length > 0" class="sm:hidden space-y-4">
      <div 
        v-for="programme in paginatedProgrammes" 
        :key="programme.id"
        class="bg-white rounded-xl shadow p-4 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <!-- En-tête de la carte -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusColor(programme.status)
              ]">
                {{ programme.status }}
              </span>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Semaine {{ programme.semaine }}
              </span>
            </div>
            <h3 class="font-bold text-gray-800 text-lg mb-1">{{ formatDate(programme.date) }}</h3>
            <p v-if="programme.theme" class="text-sm text-gray-600 italic">
              "{{ truncateText(programme.theme, 30) }}"
            </p>
          </div>
        </div>

        <!-- Cantiques -->
        <div class="mb-3">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span class="text-sm font-medium text-gray-700">Cantiques</span>
          </div>
          <div class="text-sm ml-6">
            <p v-if="programme.cantiqueFrancais" class="text-gray-600">
              🇫🇷 {{ truncateText(programme.cantiqueFrancais, 25) }}
            </p>
            <p v-if="programme.cantiqueBaoule" class="text-gray-600">
              🇨🇮 {{ truncateText(programme.cantiqueBaoule, 25) }}
            </p>
          </div>
        </div>

        <!-- Responsables par culte -->
        <div class="space-y-3">
          <!-- Premier culte -->
          <div v-if="programme.premierCultePreside">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">1er Culte ({{ programme.premierCulteHeure || '?' }})</span>
            </div>
            <p class="text-sm text-gray-600 ml-6">
              Préside: {{ getMembreName(programme.premierCultePreside) }}
            </p>
          </div>

          <!-- Deuxième culte -->
          <div v-if="programme.deuxiemeCultePreside">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">2ème Culte ({{ programme.deuxiemeCulteHeure || '?' }})</span>
            </div>
            <p class="text-sm text-gray-600 ml-6">
              Préside: {{ getMembreName(programme.deuxiemeCultePreside) }}
            </p>
          </div>

          <!-- Troisième culte -->
          <div v-if="programme.troisiemeCultePreside">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-sm font-medium text-gray-700">3ème Culte ({{ programme.troisiemeCulteHeure || '?' }})</span>
            </div>
            <p class="text-sm text-gray-600 ml-6">
              Préside: {{ getMembreName(programme.troisiemeCultePreside) }}
            </p>
          </div>
        </div>

        <!-- Actions mobile -->
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            @click="printSingleProgramme(programme)"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer
          </button>
          
          <div class="flex gap-2">
            <button
              @click="editProgramme(programme)"
              class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
              title="Modifier"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteSingleProgramme(programme)"
              class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
              title="Supprimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Version desktop : tableau -->
    <div v-if="filteredProgrammes.length > 0" class="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('date')"
              >
                <div class="flex items-center gap-1">
                  Date
                  <svg v-if="sortField === 'date'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="sortOrder === 'desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semaine</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thème</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1er Culte</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2ème Culte</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3ème Culte</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="programme in paginatedProgrammes" :key="programme.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ formatDate(programme.date) }}</div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(programme.date) }}
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ programme.semaine || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-900 max-w-[150px] truncate" :title="programme.theme">
                  {{ programme.theme || '-' }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm">
                  <div v-if="programme.premierCultePreside" class="text-gray-900">
                    {{ getMembreName(programme.premierCultePreside) }}
                  </div>
                  <div v-else class="text-gray-400 italic">Non défini</div>
                  <div v-if="programme.premierCulteHeure" class="text-xs text-gray-500">
                    {{ programme.premierCulteHeure }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm">
                  <div v-if="programme.deuxiemeCultePreside" class="text-gray-900">
                    {{ getMembreName(programme.deuxiemeCultePreside) }}
                  </div>
                  <div v-else class="text-gray-400 italic">Non défini</div>
                  <div v-if="programme.deuxiemeCulteHeure" class="text-xs text-gray-500">
                    {{ programme.deuxiemeCulteHeure }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm">
                  <div v-if="programme.troisiemeCultePreside" class="text-gray-900">
                    {{ getMembreName(programme.troisiemeCultePreside) }}
                  </div>
                  <div v-else class="text-gray-400 italic">Non défini</div>
                  <div v-if="programme.troisiemeCulteHeure" class="text-xs text-gray-500">
                    {{ programme.troisiemeCulteHeure }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(programme.status)
                ]">
                  {{ programme.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                    @click="printSingleProgramme(programme)"
                    class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                    title="Imprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button
                    @click="editProgramme(programme)"
                    class="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteSingleProgramme(programme)"
                    class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredProgrammes.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Informations sur les résultats -->
      <div class="text-sm text-gray-600">
        Affichage de <span class="font-semibold">{{ startIndex + 1 }}-{{ endIndex }}</span>
        sur <span class="font-semibold">{{ filteredProgrammes.length }}</span> programme(s)
        <span v-if="searchQuery" class="ml-2">(recherche: "{{ searchQuery }}")</span>
      </div>

      <!-- Sélecteur d'éléments par page -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Par page :</span>
        <select
          v-model="itemsPerPage"
          class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <!-- Boutons de pagination -->
      <div class="flex items-center gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Précédent
        </button>
        
        <div class="flex gap-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 rounded text-sm',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- État vide -->
    <div v-if="filteredProgrammes.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucun programme' }}
      </h3>
      <p class="mt-2 text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre premier programme pour commencer' }}
      </p>
      <button
        @click="showForm = true"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Créer un programme
      </button>
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition inline-flex items-center gap-2 ml-2"
      >
        Réinitialiser la recherche
      </button>
    </div>
  </div>
</template>

<script setup>
import ProgrammeForm from '~/components/ProgrammeForm.vue'
import { computed, ref, watch } from 'vue'

const showForm = ref(false)
const { data: programmes, refresh } = await useFetch('/api/programmes')

// Variables pour la recherche et le tri
const searchQuery = ref('')
const sortField = ref('date')
const sortOrder = ref('desc') // 'asc' ou 'desc'
const statusFilter = ref('all')
const culteFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Fonction de tri
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const sortBy = (field) => {
  if (sortField.value === field) {
    toggleSortOrder()
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
  currentPage.value = 1
}

// Fonction pour obtenir le libellé du statut
const getStatusLabel = (status) => {
  const labels = {
    'planifié': 'Planifié',
    'confirmé': 'Confirmé',
    'terminé': 'Terminé',
    'annulé': 'Annulé'
  }
  return labels[status] || status
}

const getCulteLabel = (culte) => {
  const labels = {
    'premier': 'Premier culte',
    'deuxieme': 'Deuxième culte',
    'troisieme': 'Troisième culte'
  }
  return labels[culte] || culte
}

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
  const colors = {
    'planifié': 'bg-yellow-100 text-yellow-800',
    'confirmé': 'bg-green-100 text-green-800',
    'terminé': 'bg-blue-100 text-blue-800',
    'annulé': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Fonction pour obtenir le nom complet d'un membre
const getMembreName = (membre) => {
  if (!membre) return '-'
  return `${membre.prenom} ${membre.nom}`
}

// Fonction pour filtrer les programmes
const filteredProgrammes = computed(() => {
  let filtered = programmes.value || []

  // Filtre de recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(programme => {
      return (
        (programme.semaine?.toLowerCase().includes(query)) ||
        (programme.theme?.toLowerCase().includes(query)) ||
        (programme.cantiqueFrancais?.toLowerCase().includes(query)) ||
        (programme.cantiqueBaoule?.toLowerCase().includes(query)) ||
        (programme.premierCultePreside?.nom?.toLowerCase().includes(query)) ||
        (programme.premierCultePreside?.prenom?.toLowerCase().includes(query)) ||
        (programme.deuxiemeCultePreside?.nom?.toLowerCase().includes(query)) ||
        (programme.deuxiemeCultePreside?.prenom?.toLowerCase().includes(query)) ||
        (programme.troisiemeCultePreside?.nom?.toLowerCase().includes(query)) ||
        (programme.troisiemeCultePreside?.prenom?.toLowerCase().includes(query))
      )
    })
  }

  // Filtre par statut
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(programme => {
      return programme.status === statusFilter.value
    })
  }

  // Filtre par culte
  if (culteFilter.value !== 'all') {
    filtered = filtered.filter(programme => {
      if (culteFilter.value === 'premier') {
        return programme.premierCultePreside
      }
      if (culteFilter.value === 'deuxieme') {
        return programme.deuxiemeCultePreside
      }
      if (culteFilter.value === 'troisieme') {
        return programme.troisiemeCultePreside
      }
      return true
    })
  }

  // Tri
  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue
    
    if (sortField.value === 'date') {
      aValue = new Date(a.date || 0)
      bValue = new Date(b.date || 0)
    } else {
      aValue = a[sortField.value] || ''
      bValue = b[sortField.value] || ''
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

// Calculs pour la pagination
const totalPages = computed(() => {
  return Math.ceil(filteredProgrammes.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value
  return Math.min(end, filteredProgrammes.value.length)
})

const paginatedProgrammes = computed(() => {
  return filteredProgrammes.value.slice(startIndex.value, endIndex.value)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Fonctions de pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Réinitialiser la pagination lors du filtrage
watch([searchQuery, statusFilter, culteFilter], () => {
  currentPage.value = 1
})

// Date actuelle pour l'impression
const currentDate = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Fonctions de formatage
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonction pour tronquer le texte
const truncateText = (text, length) => {
  if (!text) return '-'
  const cleanText = text.replace(/<[^>]*>/g, '')
  return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
}

// Gestion après sauvegarde
const handleSaved = () => {
  refresh()
  showForm.value = false
  currentPage.value = 1
}

// Impression d'un seul programme
const printSingleProgramme = (programme) => {
  console.log('🖨️ Impression du programme:', formatDate(programme.date))
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour l\'impression')
    return
  }

  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Programme du ${formatDate(programme.date)}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
          }
          
          .print-header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          
          .print-header h1 { 
            margin: 0; 
            color: #2563eb;
            font-size: 28px;
          }
          
          .print-meta { 
            margin: 10px 0; 
            color: #666;
            font-size: 14px;
          }
          
          .print-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .print-section h2 {
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 20px;
          }
          
          .print-content {
            font-size: 14px;
            line-height: 1.8;
          }
          
          .print-culte-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            margin-bottom: 15px;
          }
          
          .print-culte-info h3 {
            margin-top: 0;
            color: #2563eb;
            font-size: 16px;
          }
          
          .print-membre {
            margin: 8px 0;
            padding-left: 10px;
          }
          
          .print-membre strong {
            display: inline-block;
            width: 120px;
          }
          
          .empty-section {
            color: #999;
            font-style: italic;
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 5px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
          }
          
          .status-planifie { background: #fef3c7; color: #92400e; }
          .status-confirme { background: #d1fae5; color: #065f46; }
          .status-termine { background: #dbeafe; color: #1e40af; }
          .status-annule { background: #fee2e2; color: #991b1b; }
          
          @media print {
            body { padding: 15px; }
            .print-header { margin-bottom: 20px; }
            .print-section { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>📅 Programme des Cultes</h1>
          <div class="print-meta">
            <p><strong>Date:</strong> ${formatDate(programme.date)}</p>
            <p><strong>Semaine:</strong> ${programme.semaine || 'Non spécifiée'}</p>
            <p><strong>Thème:</strong> ${programme.theme || 'Non spécifié'}</p>
            <p><strong>Statut:</strong> 
              <span class="status-badge status-${programme.status}">${programme.status}</span>
            </p>
            <p><strong>Date de génération:</strong> ${currentDate}</p>
          </div>
        </div>

        <!-- CANTIQUES -->
        <div class="print-section">
          <h2>🎵 Cantiques</h2>
          ${programme.cantiqueFrancais || programme.cantiqueBaoule ? `
            <div class="print-content">
              ${programme.cantiqueFrancais ? `<p><strong>Français:</strong> ${programme.cantiqueFrancais} ${programme.cantiqueFrancaisRef ? `(Réf: ${programme.cantiqueFrancaisRef})` : ''}</p>` : ''}
              ${programme.cantiqueBaoule ? `<p><strong>Baoulé:</strong> ${programme.cantiqueBaoule} ${programme.cantiqueBaouleRef ? `(Réf: ${programme.cantiqueBaouleRef})` : ''}</p>` : ''}
            </div>
          ` : `
            <div class="empty-section">Aucun cantique spécifié</div>
          `}
        </div>

        <!-- PREMIER CULTE -->
        <div class="print-section">
          <h2>🌅 Premier Culte ${programme.premierCulteHeure ? `(${programme.premierCulteHeure})` : ''}</h2>
          ${programme.premierCultePreside || programme.premierCulteAnnonce || programme.premierCultePredicateur ? `
            <div class="print-culte-info">
              ${programme.premierCultePreside ? `
                <div class="print-membre">
                  <strong>Président:</strong> ${getMembreName(programme.premierCultePreside)}
                </div>
              ` : ''}
              ${programme.premierCulteAnnonce ? `
                <div class="print-membre">
                  <strong>Chargé d'annonces:</strong> ${getMembreName(programme.premierCulteAnnonce)}
                </div>
              ` : ''}
              ${programme.premierCultePredicateur ? `
                <div class="print-membre">
                  <strong>Prédicateur:</strong> ${getMembreName(programme.premierCultePredicateur)}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="empty-section">Aucun responsable désigné</div>
          `}
        </div>

        <!-- DEUXIEME CULTE -->
        <div class="print-section">
          <h2>☀️ Deuxième Culte ${programme.deuxiemeCulteHeure ? `(${programme.deuxiemeCulteHeure})` : ''}</h2>
          ${programme.deuxiemeCultePreside || programme.deuxiemeCulteAnnonce || programme.deuxiemeCultePredicateur ? `
            <div class="print-culte-info">
              ${programme.deuxiemeCultePreside ? `
                <div class="print-membre">
                  <strong>Président:</strong> ${getMembreName(programme.deuxiemeCultePreside)}
                </div>
              ` : ''}
              ${programme.deuxiemeCulteAnnonce ? `
                <div class="print-membre">
                  <strong>Chargé d'annonces:</strong> ${getMembreName(programme.deuxiemeCulteAnnonce)}
                </div>
              ` : ''}
              ${programme.deuxiemeCultePredicateur ? `
                <div class="print-membre">
                  <strong>Prédicateur:</strong> ${getMembreName(programme.deuxiemeCultePredicateur)}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="empty-section">Aucun responsable désigné</div>
          `}
        </div>

        <!-- TROISIEME CULTE -->
        <div class="print-section">
          <h2>🌙 Troisième Culte ${programme.troisiemeCulteHeure ? `(${programme.troisiemeCulteHeure})` : ''}</h2>
          ${programme.troisiemeCultePreside || programme.troisiemeCulteAnnonce || programme.troisiemeCultePredicateur ? `
            <div class="print-culte-info">
              ${programme.troisiemeCultePreside ? `
                <div class="print-membre">
                  <strong>Président:</strong> ${getMembreName(programme.troisiemeCultePreside)}
                </div>
              ` : ''}
              ${programme.troisiemeCulteAnnonce ? `
                <div class="print-membre">
                  <strong>Chargé d'annonces:</strong> ${getMembreName(programme.troisiemeCulteAnnonce)}
                </div>
              ` : ''}
              ${programme.troisiemeCultePredicateur ? `
                <div class="print-membre">
                  <strong>Prédicateur:</strong> ${getMembreName(programme.troisiemeCultePredicateur)}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="empty-section">Aucun responsable désigné</div>
          `}
        </div>

        <!-- AUTRES ROLES -->
        <div class="print-section">
          <h2>👥 Autres Rôles</h2>
          ${programme.accueil || programme.musique || programme.collecte ? `
            <div class="print-content">
              ${programme.accueil ? `<p><strong>Accueil:</strong> ${getMembreName(programme.accueil)}</p>` : ''}
              ${programme.musique ? `<p><strong>Musique:</strong> ${getMembreName(programme.musique)}</p>` : ''}
              ${programme.collecte ? `<p><strong>Collecte:</strong> ${getMembreName(programme.collecte)}</p>` : ''}
            </div>
          ` : `
            <div class="empty-section">Aucun autre rôle spécifié</div>
          `}
        </div>

        <!-- NOTES -->
        ${programme.notes ? `
          <div class="print-section">
            <h2>📝 Notes</h2>
            <div class="print-content">${programme.notes}</div>
          </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
          <p>Document généré automatiquement - ${currentDate}</p>
        </div>
      </body>
    </html>
  `

  printWindow.document.write(printHTML)
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

// Édition d'un programme
const editProgramme = (programme) => {
  // À implémenter selon votre système d'édition
  console.log('Édition du programme:', programme)
  // Par exemple : ouvrir un modal d'édition
  // editModal.value = true
  // programmeToEdit.value = programme
}

// Suppression individuelle
const deleteSingleProgramme = async (programme) => {
  if (confirm(`Supprimer le programme du ${formatDate(programme.date)} ?`)) {
    await $fetch(`/api/programmes/${programme.id}`, { method: 'DELETE' })
    refresh()
  }
}

// Impression de tous les programmes
const printAllProgrammes = () => {
  if (filteredProgrammes.value.length === 0) {
    alert('Aucun programme à imprimer')
    return
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour l\'impression')
    return
  }

  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Liste des Programmes des Cultes</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
          }
          
          .print-header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          
          .print-header h1 { 
            margin: 0; 
            color: #2563eb;
            font-size: 28px;
          }
          
          .print-date, .print-count { 
            margin: 5px 0; 
            color: #666;
            font-size: 14px;
          }
          
          .print-programme {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .print-programme-header {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #2563eb;
            margin-bottom: 15px;
          }
          
          .print-programme-header h2 {
            margin: 0;
            color: #2563eb;
            font-size: 20px;
          }
          
          .print-programme-meta {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
          }
          
          .print-section {
            margin-bottom: 20px;
          }
          
          .print-section h3 {
            color: #2563eb;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 16px;
          }
          
          .print-culte-details {
            background: #f1f5f9;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          
          .print-membre {
            margin: 3px 0;
          }
          
          @media print {
            body { padding: 10px; }
            .print-header { margin-bottom: 20px; }
            .print-programme { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>📅 Liste des Programmes des Cultes</h1>
          <p class="print-date">Généré le ${currentDate}</p>
          <p class="print-count">Total: ${filteredProgrammes.value.length} programme(s)</p>
        </div>

        ${filteredProgrammes.value.map((programme, index) => `
          <div class="print-programme">
            <div class="print-programme-header">
              <h2>${index + 1}. ${formatDate(programme.date)}</h2>
              <div class="print-programme-meta">
                <span><strong>Semaine:</strong> ${programme.semaine || 'N/A'}</span> | 
                <span><strong>Thème:</strong> ${programme.theme || 'Non spécifié'}</span> |
                <span><strong>Statut:</strong> ${programme.status}</span>
              </div>
            </div>

            ${programme.cantiqueFrancais || programme.cantiqueBaoule ? `
              <div class="print-section">
                <h3>🎵 Cantiques</h3>
                ${programme.cantiqueFrancais ? `<p><strong>Français:</strong> ${programme.cantiqueFrancais}</p>` : ''}
                ${programme.cantiqueBaoule ? `<p><strong>Baoulé:</strong> ${programme.cantiqueBaoule}</p>` : ''}
              </div>
            ` : ''}

            <div class="print-section">
              <h3>👥 Responsables</h3>
              
              ${programme.premierCultePreside ? `
                <div class="print-culte-details">
                  <h4>🌅 Premier Culte ${programme.premierCulteHeure ? `(${programme.premierCulteHeure})` : ''}</h4>
                  ${programme.premierCultePreside ? `<p class="print-membre"><strong>Président:</strong> ${getMembreName(programme.premierCultePreside)}</p>` : ''}
                  ${programme.premierCulteAnnonce ? `<p class="print-membre"><strong>Annonces:</strong> ${getMembreName(programme.premierCulteAnnonce)}</p>` : ''}
                  ${programme.premierCultePredicateur ? `<p class="print-membre"><strong>Prédicateur:</strong> ${getMembreName(programme.premierCultePredicateur)}</p>` : ''}
                </div>
              ` : ''}
              
              ${programme.deuxiemeCultePreside ? `
                <div class="print-culte-details">
                  <h4>☀️ Deuxième Culte ${programme.deuxiemeCulteHeure ? `(${programme.deuxiemeCulteHeure})` : ''}</h4>
                  ${programme.deuxiemeCultePreside ? `<p class="print-membre"><strong>Président:</strong> ${getMembreName(programme.deuxiemeCultePreside)}</p>` : ''}
                  ${programme.deuxiemeCulteAnnonce ? `<p class="print-membre"><strong>Annonces:</strong> ${getMembreName(programme.deuxiemeCulteAnnonce)}</p>` : ''}
                  ${programme.deuxiemeCultePredicateur ? `<p class="print-membre"><strong>Prédicateur:</strong> ${getMembreName(programme.deuxiemeCultePredicateur)}</p>` : ''}
                </div>
              ` : ''}
              
              ${programme.troisiemeCultePreside ? `
                <div class="print-culte-details">
                  <h4>🌙 Troisième Culte ${programme.troisiemeCulteHeure ? `(${programme.troisiemeCulteHeure})` : ''}</h4>
                  ${programme.troisiemeCultePreside ? `<p class="print-membre"><strong>Président:</strong> ${getMembreName(programme.troisiemeCultePreside)}</p>` : ''}
                  ${programme.troisiemeCulteAnnonce ? `<p class="print-membre"><strong>Annonces:</strong> ${getMembreName(programme.troisiemeCulteAnnonce)}</p>` : ''}
                  ${programme.troisiemeCultePredicateur ? `<p class="print-membre"><strong>Prédicateur:</strong> ${getMembreName(programme.troisiemeCultePredicateur)}</p>` : ''}
                </div>
              ` : ''}
              
              ${programme.accueil || programme.musique || programme.collecte ? `
                <div class="print-culte-details">
                  <h4>Autres rôles</h4>
                  ${programme.accueil ? `<p class="print-membre"><strong>Accueil:</strong> ${getMembreName(programme.accueil)}</p>` : ''}
                  ${programme.musique ? `<p class="print-membre"><strong>Musique:</strong> ${getMembreName(programme.musique)}</p>` : ''}
                  ${programme.collecte ? `<p class="print-membre"><strong>Collecte:</strong> ${getMembreName(programme.collecte)}</p>` : ''}
                </div>
              ` : ''}
            </div>

            ${programme.notes ? `
              <div class="print-section">
                <h3>📝 Notes</h3>
                <div>${programme.notes}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </body>
    </html>
  `

  printWindow.document.write(printHTML)
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
  }, 500)
}
</script>

<style scoped>
/* Styles pour mobile */
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  button {
    min-height: 44px; /* Taille tactile recommandée */
  }
}
</style>