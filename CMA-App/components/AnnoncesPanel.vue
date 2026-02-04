<template>
  <div class="p-4 sm:p-6">
    <!-- En-tête responsive -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-green-700 flex items-center gap-2">
          📢 Annonces
        </h1>
        <p class="text-gray-600 text-sm mt-1">Gestion des annonces de l'église</p>
      </div>
      
      <!-- Boutons d'action responsive -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          @click="printAllAnnonces"
          :disabled="filteredAnnonces.length === 0"
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
          {{ showForm ? 'Fermer' : 'Nouvelle' }}
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
              placeholder="Rechercher par titre, contenu..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="createdAt">Trier par date</option>
            <option value="titre">Trier par titre</option>
            <option value="culteId">Trier par culte ID</option>
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
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="all">Tous les états</option>
            <option value="hasCompteRendu">Avec compte rendu</option>
            <option value="noCompteRendu">Sans compte rendu</option>
          </select>
        </div>
      </div>

      <!-- Informations de filtrage -->
      <div v-if="searchQuery || statusFilter !== 'all'" class="mt-3 flex flex-wrap gap-2 items-center text-sm">
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
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-6 transition-all duration-300">
      <AnnonceForm
        @saved="handleSaved"
        @close="showForm = false"
      />
    </div>

    <!-- Version mobile : cartes -->
    <div v-if="filteredAnnonces.length > 0" class="sm:hidden space-y-4">
      <div 
        v-for="annonce in paginatedAnnonces" 
        :key="annonce.id"
        class="bg-white rounded-xl shadow p-4 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <!-- En-tête de la carte -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg mb-1">{{ annonce.titre || 'Sans titre' }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Culte #{{ annonce.culteId }}
              </span>
              <span class="text-xs text-gray-500">ID: {{ annonce.id }}</span>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="space-y-3">
          <!-- Compte rendu -->
          <div v-if="annonce.compteRendu">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Compte rendu</span>
            </div>
            <div class="text-sm text-gray-600 ml-6">
              <p v-if="annonce.compteRendu.messager" class="truncate">
                📖 {{ truncateText(annonce.compteRendu.messager, 30) }}
              </p>
              <p v-if="annonce.compteRendu.assistanceTotale" class="truncate">
                👥 {{ annonce.compteRendu.assistanceTotale }} personnes
              </p>
            </div>
          </div>

          <!-- Infos du jour -->
          <div v-if="annonce.infosJour">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Infos du jour</span>
            </div>
            <p class="text-sm text-gray-600 ml-6 truncate">
              {{ truncateText(annonce.infosJour, 40) }}
            </p>
          </div>

          <!-- Remerciements -->
          <div v-if="annonce.remerciements">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Remerciements</span>
            </div>
            <p class="text-sm text-gray-600 ml-6 truncate">
              {{ truncateText(annonce.remerciements, 40) }}
            </p>
          </div>
        </div>

        <!-- Actions mobile -->
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            @click="printSingleAnnonce(annonce)"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer
          </button>
          
          <div class="flex gap-2">
            <button
              @click="editAnnonce(annonce)"
              class="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
              title="Modifier"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteSingleAnnonce(annonce)"
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
    <div v-if="filteredAnnonces.length > 0" class="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('titre')"
              >
                <div class="flex items-center gap-1">
                  Titre
                  <svg v-if="sortField === 'titre'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="sortOrder === 'desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
              </th>
              <th 
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('culteId')"
              >
                <div class="flex items-center gap-1">
                  Culte ID
                  <svg v-if="sortField === 'culteId'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="sortOrder === 'desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte Rendu</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infos du jour</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="annonce in paginatedAnnonces" :key="annonce.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ annonce.titre }}</div>
                <div class="text-xs text-gray-500">ID: {{ annonce.id }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  #{{ annonce.culteId }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-900">
                  <div v-if="annonce.compteRendu?.messager" class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ truncateText(annonce.compteRendu.messager, 30) }}
                  </div>
                  <div v-if="annonce.compteRendu?.assistanceTotale" class="text-xs text-gray-500 mt-1">
                    👥 {{ annonce.compteRendu.assistanceTotale }} personnes
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-900 truncate max-w-[200px]">
                  {{ truncateText(annonce.infosJour, 50) }}
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                    @click="printSingleAnnonce(annonce)"
                    class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                    title="Imprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button
                    @click="editAnnonce(annonce)"
                    class="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteSingleAnnonce(annonce)"
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
    <div v-if="filteredAnnonces.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Informations sur les résultats -->
      <div class="text-sm text-gray-600">
        Affichage de <span class="font-semibold">{{ startIndex + 1 }}-{{ endIndex }}</span>
        sur <span class="font-semibold">{{ filteredAnnonces.length }}</span> annonce(s)
        <span v-if="searchQuery" class="ml-2">(recherche: "{{ searchQuery }}")</span>
      </div>

      <!-- Sélecteur d'éléments par page -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Par page :</span>
        <select
          v-model="itemsPerPage"
          class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                ? 'bg-green-600 text-white' 
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
    <div v-if="filteredAnnonces.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune annonce' }}
      </h3>
      <p class="mt-2 text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre première annonce pour commencer' }}
      </p>
      <button
        @click="showForm = true"
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Créer une annonce
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
import AnnonceForm from '~/components/AnnonceForm.vue'
import { computed, ref } from 'vue'

const showForm = ref(false)
const { data: annonces, refresh } = await useFetch('/api/annonces')

// Variables pour la recherche et le tri
const searchQuery = ref('')
const sortField = ref('createdAt')
const sortOrder = ref('desc') // 'asc' ou 'desc'
const statusFilter = ref('all')
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
    'hasCompteRendu': 'Avec compte rendu',
    'noCompteRendu': 'Sans compte rendu'
  }
  return labels[status] || ''
}

// Fonction pour filtrer les annonces
const filteredAnnonces = computed(() => {
  let filtered = annonces.value || []

  // Filtre de recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(annonce => {
      return (
        (annonce.titre?.toLowerCase().includes(query)) ||
        (annonce.infosJour?.toLowerCase().includes(query)) ||
        (annonce.remerciements?.toLowerCase().includes(query)) ||
        (annonce.compteRendu?.messager?.toLowerCase().includes(query)) ||
        (annonce.compteRendu?.texteBiblique?.toLowerCase().includes(query)) ||
        (annonce.compteRendu?.theme?.toLowerCase().includes(query))
      )
    })
  }

  // Filtre par statut
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(annonce => {
      if (statusFilter.value === 'hasCompteRendu') {
        return annonce.compteRendu && (
          annonce.compteRendu.messager ||
          annonce.compteRendu.texteBiblique ||
          annonce.compteRendu.theme
        )
      }
      if (statusFilter.value === 'noCompteRendu') {
        return !annonce.compteRendu || (
          !annonce.compteRendu.messager &&
          !annonce.compteRendu.texteBiblique &&
          !annonce.compteRendu.theme
        )
      }
      return true
    })
  }

  // Tri
  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue
    
    if (sortField.value === 'createdAt') {
      aValue = new Date(a.createdAt || 0)
      bValue = new Date(b.createdAt || 0)
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
  return Math.ceil(filteredAnnonces.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value
  return Math.min(end, filteredAnnonces.value.length)
})

const paginatedAnnonces = computed(() => {
  return filteredAnnonces.value.slice(startIndex.value, endIndex.value)
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
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// Date actuelle pour l'impression
const currentDate = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Fonction pour tronquer le texte
const truncateText = (text, length) => {
  if (!text) return '-'
  // Supprime les balises HTML si présentes
  const cleanText = text.replace(/<[^>]*>/g, '')
  return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
}

// Gestion après sauvegarde
const handleSaved = () => {
  refresh()
  showForm.value = false
  currentPage.value = 1
}

// Impression d'une seule annonce
const printSingleAnnonce = (annonce) => {
  console.log('🖨️ Impression de:', annonce.titre)
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour l\'impression')
    return
  }

  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${annonce.titre || 'Annonce'}</title>
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
            border-bottom: 3px solid #2c5aa0; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          
          .print-header h1 { 
            margin: 0; 
            color: #2c5aa0;
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
            color: #2c5aa0;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 20px;
          }
          
          .print-content {
            font-size: 14px;
            line-height: 1.8;
          }
          
          .print-compte-rendu {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2c5aa0;
          }
          
          .print-compte-rendu p {
            margin: 8px 0;
            padding-left: 10px;
          }
          
          .empty-section {
            color: #999;
            font-style: italic;
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 5px;
          }
          
          @media print {
            body { padding: 15px; }
            .print-header { margin-bottom: 20px; }
            .print-section { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${annonce.titre || 'Annonce sans titre'}</h1>
          <div class="print-meta">
            <p><strong>Date de génération:</strong> ${currentDate}</p>
            <p><strong>Référence Culte:</strong> #${annonce.culteId}</p>
            <p><strong>ID Annonce:</strong> ${annonce.id}</p>
          </div>
        </div>

        <!-- COMPTE RENDU -->
        ${annonce.compteRendu ? `
          <div class="print-section">
            <h2>📊 Compte Rendu du Culte</h2>
            <div class="print-compte-rendu">
              ${annonce.compteRendu.messager ? `<p><strong>📖 Messager:</strong> ${annonce.compteRendu.messager}</p>` : ''}
              ${annonce.compteRendu.texteBiblique ? `<p><strong>✝️ Texte Biblique:</strong> ${annonce.compteRendu.texteBiblique}</p>` : ''}
              ${annonce.compteRendu.assistanceTotale ? `<p><strong>👥 Assistance:</strong> ${annonce.compteRendu.assistanceTotale} personnes</p>` : ''}
              ${annonce.compteRendu.theme ? `<p><strong>🎯 Thème:</strong> ${annonce.compteRendu.theme}</p>` : ''}
            </div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📊 Compte Rendu</h2>
            <div class="empty-section">Aucun compte rendu</div>
          </div>
        `}

        <!-- INFORMATIONS DU JOUR -->
        ${annonce.infosJour ? `
          <div class="print-section">
            <h2>📅 Informations du Jour</h2>
            <div class="print-content">${annonce.infosJour}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📅 Informations du Jour</h2>
            <div class="empty-section">Aucune information</div>
          </div>
        `}

        <!-- REMERCIEMENTS -->
        ${annonce.remerciements ? `
          <div class="print-section">
            <h2>🙏 Remerciements</h2>
            <div class="print-content">${annonce.remerciements}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>🙏 Remerciements</h2>
            <div class="empty-section">Aucun remerciement</div>
          </div>
        `}

        <!-- RAPPELS -->
        ${annonce.rappels ? `
          <div class="print-section">
            <h2>🔔 Rappels Importants</h2>
            <div class="print-content">${annonce.rappels}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>🔔 Rappels</h2>
            <div class="empty-section">Aucun rappel</div>
          </div>
        `}

        <!-- COMMENTAIRES -->
        ${annonce.commentaires ? `
          <div class="print-section">
            <h2>💬 Commentaires</h2>
            <div class="print-content">${annonce.commentaires}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>💬 Commentaires</h2>
            <div class="empty-section">Aucun commentaire</div>
          </div>
        `}

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

// Édition d'une annonce
const editAnnonce = (annonce) => {
  // À implémenter selon votre système d'édition
  console.log('Édition de:', annonce)
  // Par exemple : ouvrir un modal d'édition
  // editModal.value = true
  // annonceToEdit.value = annonce
}

// Suppression individuelle
const deleteSingleAnnonce = async (annonce) => {
  if (confirm(`Supprimer "${annonce.titre}" ?`)) {
    await $fetch(`/api/annonces/${annonce.id}`, { method: 'DELETE' })
    refresh()
  }
}

// Impression de toutes les annonces
const printAllAnnonces = () => {
  if (filteredAnnonces.value.length === 0) {
    alert('Aucune annonce à imprimer')
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
        <title>Liste des Annonces</title>
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
            border-bottom: 3px solid #2c5aa0; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          
          .print-header h1 { 
            margin: 0; 
            color: #2c5aa0;
            font-size: 28px;
          }
          
          .print-date, .print-count { 
            margin: 5px 0; 
            color: #666;
            font-size: 14px;
          }
          
          .print-annonce {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .print-annonce-header {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #2c5aa0;
            margin-bottom: 15px;
          }
          
          .print-annonce-header h2 {
            margin: 0;
            color: #2c5aa0;
            font-size: 20px;
          }
          
          .print-culte-id {
            color: #666;
            font-size: 14px;
          }
          
          .print-section {
            margin-bottom: 20px;
          }
          
          .print-section h3 {
            color: #2c5aa0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 16px;
          }
          
          .print-compte-rendu p {
            margin: 5px 0;
            padding-left: 10px;
          }
          
          @media print {
            body { padding: 10px; }
            .print-header { margin-bottom: 20px; }
            .print-annonce { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>📢 Liste des Annonces</h1>
          <p class="print-date">Généré le ${currentDate}</p>
          <p class="print-count">Total: ${filteredAnnonces.value.length} annonce(s)</p>
        </div>

        ${filteredAnnonces.value.map((annonce, index) => `
          <div class="print-annonce">
            <div class="print-annonce-header">
              <h2>${index + 1}. ${annonce.titre || 'Sans titre'}</h2>
              <span class="print-culte-id">Culte #${annonce.culteId} | ID: ${annonce.id}</span>
            </div>

            ${annonce.compteRendu ? `
              <div class="print-section">
                <h3>📊 Compte rendu</h3>
                <div class="print-compte-rendu">
                  ${annonce.compteRendu.messager ? `<p><strong>Messager:</strong> ${annonce.compteRendu.messager}</p>` : ''}
                  ${annonce.compteRendu.texteBiblique ? `<p><strong>Texte biblique:</strong> ${annonce.compteRendu.texteBiblique}</p>` : ''}
                  ${annonce.compteRendu.assistanceTotale ? `<p><strong>Assistance:</strong> ${annonce.compteRendu.assistanceTotale}</p>` : ''}
                  ${annonce.compteRendu.theme ? `<p><strong>Thème:</strong> ${annonce.compteRendu.theme}</p>` : ''}
                </div>
              </div>
            ` : ''}

            ${annonce.infosJour ? `
              <div class="print-section">
                <h3>📅 Informations du jour</h3>
                <div>${annonce.infosJour}</div>
              </div>
            ` : ''}

            ${annonce.remerciements ? `
              <div class="print-section">
                <h3>🙏 Remerciements</h3>
                <div>${annonce.remerciements}</div>
              </div>
            ` : ''}

            ${annonce.rappels ? `
              <div class="print-section">
                <h3>🔔 Rappels</h3>
                <div>${annonce.rappels}</div>
              </div>
            ` : ''}

            ${annonce.commentaires ? `
              <div class="print-section">
                <h3>💬 Commentaires</h3>
                <div>${annonce.commentaires}</div>
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