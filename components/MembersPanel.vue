<template>
  <section class="w-full bg-white rounded-xl shadow-lg p-6">
    <!-- En-tête avec boutons d'export -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          👥 Membres
        </h2>
        <p class="text-gray-600 text-sm mt-1">Gestion des membres du département de culte</p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <!-- Boutons d'exportation -->
        <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
          <span class="text-sm text-gray-600 mr-2">Exporter :</span>
          <button
            @click="exportToPDF"
            :disabled="isExporting"
            class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition flex items-center gap-2 text-sm border border-red-200 disabled:opacity-50"
            title="Exporter en PDF"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
            </svg>
            PDF
          </button>
          
          <button
            @click="exportToExcel"
            :disabled="isExporting"
            class="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition flex items-center gap-2 text-sm border border-green-200 disabled:opacity-50"
            title="Exporter en Excel"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
            </svg>
            Excel
          </button>
          
          <button
            @click="exportToWord"
            :disabled="isExporting"
            class="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition flex items-center gap-2 text-sm border border-blue-200 disabled:opacity-50"
            title="Exporter en Word"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Word
          </button>
        </div>
        
        <button
          @click="showForm = !showForm"
          class="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg v-if="!showForm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ showForm ? 'Fermer' : '➕ Nouveau' }}
        </button>
      </div>
    </div>

    <!-- Filtres & Recherche améliorés -->
    <div class="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un membre..."
            class="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <select
            v-model="sexeFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">👤 Tous les sexes</option>
            <option value="Homme">👨 Homme</option>
            <option value="Femme">👩 Femme</option>
          </select>
        </div>

        <div>
          <select
            v-model="professionFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">💼 Toutes les professions</option>
            <option v-for="prof in professionsList" :key="prof" :value="prof">
              {{ prof }}
            </option>
          </select>
        </div>

        <div>
          <select
            v-model="sortField"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">📊 Trier par...</option>
            <option value="nom">Nom (A-Z)</option>
            <option value="prenom">Prénom (A-Z)</option>
            <option value="dateInscription">Date d'inscription</option>
            <option value="dateNaissance">Date de naissance</option>
          </select>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Total membres</p>
            <p class="text-xl font-bold text-gray-800">{{ filteredAndSortedMembres.length }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Hommes</p>
            <p class="text-xl font-bold text-blue-600">{{ membresHommes }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Femmes</p>
            <p class="text-xl font-bold text-pink-600">{{ membresFemmes }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500">Nouveaux (30j)</p>
            <p class="text-xl font-bold text-green-600">{{ nouveauxMembres }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-6 transition-all duration-300">
      <MembreForm @saved="onSaved" />
    </div>

    <!-- Tableau responsive -->
    <div class="overflow-x-auto rounded-xl border border-gray-200">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-500">Chargement des membres...</p>
      </div>

      <div v-else-if="filteredAndSortedMembres.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-2 text-gray-600">Aucun membre trouvé</p>
        <p class="text-sm text-gray-500 mt-1">Essayez de modifier vos critères de recherche</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Informations personnelles
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profession & Activité
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates importantes
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="membre in paginatedMembres" 
            :key="membre.id"
            class="hover:bg-gray-50 transition-colors group"
          >
            <!-- Informations personnelles -->
            <td class="px-6 py-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-600 font-medium">
                    {{ membre.prenom?.charAt(0) }}{{ membre.nom?.charAt(0) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium text-gray-900">
                      {{ membre.nom }} {{ membre.prenom }}
                    </p>
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="membre.sexe === 'Homme' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'"
                    >
                      {{ membre.sexe }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ membre.sexe === 'Homme' ? '👨' : '👩' }} 
                    {{ membre.dateNaissance ? formatDate(membre.dateNaissance) + ' • ' : '' }}
                    {{ calculateAge(membre.dateNaissance) ? calculateAge(membre.dateNaissance) + ' ans' : '' }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Contact -->
            <td class="px-6 py-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a :href="'tel:' + membre.contact" class="text-sm text-gray-900 hover:text-green-600 transition">
                    {{ membre.contact || 'Non renseigné' }}
                  </a>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a v-if="membre.email" :href="'mailto:' + membre.email" class="text-sm text-gray-900 hover:text-green-600 transition truncate max-w-[150px]">
                    {{ membre.email }}
                  </a>
                  <span v-else class="text-sm text-gray-500">Non renseigné</span>
                </div>
                <p v-if="membre.adresse" class="text-sm text-gray-500 flex items-start gap-2 mt-2">
                  <svg class="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate max-w-[200px]">{{ membre.adresse }}</span>
                </p>
              </div>
            </td>

            <!-- Profession & Activité -->
            <td class="px-6 py-4">
              <div class="space-y-3">
                <div>
                  <span class="text-xs text-gray-500">Profession</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">
                    {{ membre.profession || 'Non renseignée' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-gray-500">Activité au sein du département</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">
                    {{ membre.activiteAuSeinDP || 'Non renseignée' }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Dates importantes -->
            <td class="px-6 py-4">
              <div class="space-y-3">
                <div>
                  <span class="text-xs text-gray-500">Date d'entrée</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">
                    {{ membre.dateEntreeDepartement ? formatDate(membre.dateEntreeDepartement) : 'Non renseignée' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-gray-500">Inscrit depuis</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">
                    {{ membre.dateInscription ? formatRelativeDate(membre.dateInscription) : 'Non renseignée' }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Actions améliorées -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <!-- Bouton Modification amélioré -->
                <button
                  @click="editMembre(membre)"
                  class="relative group/edit"
                >
                  <div class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span class="text-sm font-medium hidden lg:inline">Modifier</span>
                  </div>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap">
                    Modifier ce membre
                  </div>
                </button>

                <!-- Bouton Suppression amélioré -->
                <button
                  @click="openDeleteModal(membre)"
                  class="relative group/delete"
                >
                  <div class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="text-sm font-medium hidden lg:inline">Supprimer</span>
                  </div>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap">
                    Supprimer ce membre
                  </div>
                </button>

                <!-- Bouton Voir détails -->
                <button
                  @click="viewDetails(membre)"
                  class="relative group/view"
                >
                  <div class="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="text-sm font-medium hidden lg:inline">Voir</span>
                  </div>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/view:opacity-100 transition-opacity whitespace-nowrap">
                    Voir les détails
                  </div>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination améliorée -->
    <div
      v-if="filteredAndSortedMembres.length > 0 && totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200"
    >
      <div class="text-sm text-gray-600">
        Affichage de {{ startIndex + 1 }} à {{ Math.min(endIndex, filteredAndSortedMembres.length) }} sur {{ filteredAndSortedMembres.length }} membres
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 rounded-lg transition',
              currentPage === page 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ page }}
          </button>
          <span v-if="hasEllipsis" class="px-2 text-gray-500">...</span>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          Suivant
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Items par page :</span>
        <select
          v-model="itemsPerPage"
          class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Confirmer la suppression</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le membre 
          <span class="font-bold text-gray-800">{{ membreToDelete?.nom }} {{ membreToDelete?.prenom }}</span> ?
          Cette action est irréversible.
        </p>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 transition flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Oui, supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails du membre -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Contenu du modal de détails -->
        <div v-if="selectedMembre" class="space-y-6">
          <!-- En-tête du modal -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-green-600 font-bold text-lg">
                  {{ selectedMembre.prenom?.charAt(0) }}{{ selectedMembre.nom?.charAt(0) }}
                </span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">
                  {{ selectedMembre.nom }} {{ selectedMembre.prenom }}
                </h3>
                <p class="text-gray-600">Fiche détaillée du membre</p>
              </div>
            </div>
            <button
              @click="showDetailsModal = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Contenu du modal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne gauche -->
            <div class="space-y-6">
              <!-- Informations personnelles -->
              <div class="bg-gray-50 p-5 rounded-xl">
                <h4 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations personnelles
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Sexe</span>
                    <span class="font-medium">{{ selectedMembre.sexe }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date de naissance</span>
                    <span class="font-medium">{{ formatDate(selectedMembre.dateNaissance) || 'Non renseignée' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Âge</span>
                    <span class="font-medium">{{ calculateAge(selectedMembre.dateNaissance) || 'N/A' }} ans</span>
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <div class="bg-gray-50 p-5 rounded-xl">
                <h4 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact
                </h4>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600 block mb-1">Téléphone</span>
                    <a :href="'tel:' + selectedMembre.contact" class="font-medium text-blue-600 hover:underline">
                      {{ selectedMembre.contact || 'Non renseigné' }}
                    </a>
                  </div>
                  <div>
                    <span class="text-gray-600 block mb-1">Email</span>
                    <a v-if="selectedMembre.email" :href="'mailto:' + selectedMembre.email" class="font-medium text-blue-600 hover:underline">
                      {{ selectedMembre.email }}
                    </a>
                    <span v-else class="text-gray-500">Non renseigné</span>
                  </div>
                  <div>
                    <span class="text-gray-600 block mb-1">Adresse</span>
                    <p class="font-medium">{{ selectedMembre.adresse || 'Non renseignée' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite -->
            <div class="space-y-6">
              <!-- Profession & Activité -->
              <div class="bg-gray-50 p-5 rounded-xl">
                <h4 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Profession & Activité
                </h4>
                <div class="space-y-4">
                  <div>
                    <span class="text-gray-600 block mb-1">Profession</span>
                    <p class="font-medium text-lg">{{ selectedMembre.profession || 'Non renseignée' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600 block mb-1">Activité au sein du département</span>
                    <p class="font-medium">{{ selectedMembre.activiteAuSeinDP || 'Non renseignée' }}</p>
                  </div>
                </div>
              </div>

              <!-- Dates importantes -->
              <div class="bg-gray-50 p-5 rounded-xl">
                <h4 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dates importantes
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date d'entrée</span>
                    <span class="font-medium">{{ formatDate(selectedMembre.DateEntreAuDepartementCulte) || 'Non renseignée' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date d'inscription</span>
                    <span class="font-medium">{{ formatDate(selectedMembre.dateInscription) || 'Non renseignée' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Membre depuis</span>
                    <span class="font-medium">{{ formatRelativeDate(selectedMembre.dateInscription) || 'Non renseigné' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action du modal -->
          <div class="flex gap-3 pt-6 border-t border-gray-200">
            <button
              @click="editMembre(selectedMembre)"
              class="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier ce membre
            </button>
            <button
              @click="openDeleteModal(selectedMembre)"
              class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer ce membre
            </button>
            <button
              @click="showDetailsModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MembreForm from '~/components/MembreForm.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const showForm = ref(false)
const membres = ref([])
const isLoading = ref(true)
const search = ref('')
const sexeFilter = ref('')
const professionFilter = ref('')
const sortField = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isExporting = ref(false)
const showDeleteModal = ref(false)
const membreToDelete = ref(null)
const showDetailsModal = ref(false)
const selectedMembre = ref(null)

// Fetch des membres
const fetchMembres = async () => {
  try {
    const res = await $fetch('/api/membres')
    membres.value = res || []
  } catch (err) {
    console.error('Erreur lors du chargement des membres:', err)
  } finally {
    isLoading.value = false
  }
}
fetchMembres()

const onSaved = () => {
  showForm.value = false
  fetchMembres()
}

// Liste des professions uniques pour le filtre
const professionsList = computed(() => {
  const professions = new Set()
  membres.value.forEach(m => {
    if (m.profession) professions.add(m.Profession)
  })
  return Array.from(professions).sort()
})

// Statistiques
const membresHommes = computed(() => 
  filteredAndSortedMembres.value.filter(m => m.sexe === 'Homme').length
)

const membresFemmes = computed(() => 
  filteredAndSortedMembres.value.filter(m => m.sexe === 'Femme').length
)

const nouveauxMembres = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return membres.value.filter(m => {
    if (!m.dateInscription) return false
    return new Date(m.dateInscription) > thirtyDaysAgo
  }).length
})

// Filtrage et tri
const filteredAndSortedMembres = computed(() => {
  let result = membres.value

  // Filtre par recherche
  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(m =>
      m.nom?.toLowerCase().includes(term) ||
      m.prenom?.toLowerCase().includes(term) ||
      m.contact?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.profession?.toLowerCase().includes(term) ||
      m.activiteAuSeinDP?.toLowerCase().includes(term) ||
      m.adresse?.toLowerCase().includes(term)
    )
  }

  // Filtre par sexe
  if (sexeFilter.value) {
    result = result.filter(m => m.sexe === sexeFilter.value)
  }

  // Filtre par profession
  if (professionFilter.value) {
    result = result.filter(m => m.Profession === professionFilter.value)
  }

  // Tri
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortField.value] || ''
      const bVal = b[sortField.value] || ''
      
      if (sortField.value.includes('date')) {
        return new Date(bVal) - new Date(aVal)
      }
      
      return aVal.localeCompare(bVal)
    })
  }

  return result
})

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredAndSortedMembres.value.length / itemsPerPage.value)
)

const paginatedMembres = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAndSortedMembres.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const visiblePages = computed(() => {
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

const hasEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < totalPages.value)

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Réinitialiser la page quand les filtres changent
watch([search, sexeFilter, professionFilter, sortField], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Fonctions d'aide
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatRelativeDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}

const calculateAge = (dateString) => {
  if (!dateString) return null
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Fonctions d'exportation
const exportToPDF = async () => {
  try {
    isExporting.value = true
    
    const doc = new jsPDF()
    
    // En-tête du document
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text('Liste des Membres', 14, 22)
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30)
    doc.text(`Total: ${filteredAndSortedMembres.value.length} membres`, 14, 37)
    
    // Préparation des données du tableau
    const tableData = filteredAndSortedMembres.value.map(membre => [
      `${membre.nom} ${membre.prenom}`,
      membre.sexe,
      membre.contact || 'N/A',
      membre.email || 'N/A',
      membre.profession || 'N/A',
      membre.activiteAuSeinDP || 'N/A',
      formatDate(membre.dateInscription)
    ])
    
    // Création du tableau
    doc.autoTable({
      head: [['Nom & Prénom', 'Sexe', 'Contact', 'Email', 'Profession', 'Activité', 'Inscrit le']],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 }
    })
    
    // Statistiques en bas de page
    const finalY = doc.lastAutoTable.finalY || 60
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(`Hommes: ${membresHommes.value} | Femmes: ${membresFemmes.value}`, 14, finalY + 10)
    
    // Sauvegarde du PDF
    doc.save(`membres_${new Date().toISOString().split('T')[0]}.pdf`)
    
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    alert('Erreur lors de l\'export PDF')
  } finally {
    isExporting.value = false
  }
}

const exportToExcel = async () => {
  try {
    isExporting.value = true
    
    // Création des données CSV
    const headers = [
      'Nom', 'Prénom', 'Sexe', 'Date Naissance', 'Âge', 'Contact', 'Email', 'Adresse',
      'Profession', 'Activité Département', 'Date Entrée', 'Date Inscription'
    ]
    
    const csvData = filteredAndSortedMembres.value.map(membre => [
      membre.nom,
      membre.prenom,
      membre.sexe,
      formatDate(membre.dateNaissance),
      calculateAge(membre.dateNaissance),
      membre.contact,
      membre.email,
      membre.adresse,
      membre.profession,
      membre.activiteAuSeinDP,
      formatDate(membre.dateEntreeDepartement),
      formatDate(membre.dateInscription)
    ])
    
    // Convertir en CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Créer le blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `membres_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    alert('Erreur lors de l\'export Excel')
  } finally {
    isExporting.value = false
  }
}

const exportToWord = async () => {
  try {
    isExporting.value = true
    
    // Création du contenu HTML pour Word
    let htmlContent = `
 <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: landscape;
      margin: 0.5cm;
    }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 20px;
      font-size: 9pt;
      line-height: 1.2;
    }
    h1 { 
      color: #2c3e50; 
      font-size: 16pt;
      margin: 0 0 10px 0;
      text-align: center;
    }
    .header-info {
      text-align: center;
      color: #666;
      font-size: 9pt;
      margin-bottom: 15px;
    }
    .statistics { 
      background-color: #f8f9fa; 
      padding: 8px 12px; 
      border-radius: 4px; 
      margin: 15px 0; 
      border: 1px solid #dee2e6;
      font-size: 8pt;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
    }
    .stat-value {
      font-weight: bold;
      color: #3498db;
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 10px 0;
      font-size: 8pt;
      table-layout: fixed;
    }
    th { 
      background-color: #3498db; 
      color: white; 
      padding: 6px 4px; 
      text-align: left; 
      font-weight: bold;
      border: 1px solid #2980b9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    td { 
      padding: 5px 4px; 
      border: 1px solid #ddd; 
      vertical-align: top;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
    }
    tr:nth-child(even) { background-color: #f9f9f9; }
    tr:hover { background-color: #f0f8ff; }
    .footer { 
      margin-top: 20px; 
      color: #7f8c8d; 
      font-size: 7pt; 
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 8px;
    }
    .compact-text {
      margin: 0;
      padding: 0;
    }
    /* Largeurs de colonnes optimisées */
    .col-nom { width: 15%; }
    .col-sexe { width: 7%; }
    .col-contact { width: 10%; }
    .col-email { width: 16%; }
    .col-profession { width: 15%; }
    .col-activite { width: 14%; }
    .col-entree { width: 12%; }
    .col-inscription { width: 11%; }
    
    /* Pour éviter les sauts de page dans les lignes */
    tr { page-break-inside: avoid; }
    
    /* Style pour les dates manquantes */
    .date-na {
      color: #999;
      font-style: italic;
      font-size: 7pt;
    }
    
    /* Optimisation pour l'impression */
    @media print {
      body { margin: 0.5cm; }
      .no-print { display: none; }
      table { font-size: 7pt; }
      th, td { padding: 4px 3px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 LISTE DES MEMBRES - DÉPARTEMENT DE CULTE</h1>
    <div class="header-info">
      Rapport généré le ${new Date().toLocaleDateString('fr-FR', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      })} à ${new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}
    </div>
  </div>
  
  <div class="statistics">
    <div class="stat-row">
      <span>Total membres:</span>
      <span class="stat-value">${filteredAndSortedMembres.value.length}</span>
    </div>
    <div class="stat-row">
      <span>Hommes:</span>
      <span class="stat-value">${membresHommes.value}</span>
    </div>
    <div class="stat-row">
      <span>Femmes:</span>
      <span class="stat-value">${membresFemmes.value}</span>
    </div>
    <div class="stat-row">
      <span>Nouveaux (30 jours):</span>
      <span class="stat-value">${nouveauxMembres.value}</span>
    </div>
  </div>
  
  <h2 style="font-size: 11pt; margin: 15px 0 8px 0;">📋 LISTE DÉTAILLÉE DES MEMBRES</h2>
  <table>
    <thead>
      <tr>
        <th class="col-nom">Nom & Prénom</th>
        <th class="col-sexe">Sexe</th>
        <th class="col-contact">Contact</th>
        <th class="col-email">Habitation</th>
        <th class="col-profession">Profession</th>
        <th class="col-activite">Activité</th>
        <th class="col-entree">Date d'entrée</th>
        <th class="col-inscription">Etat civil</th>
      </tr>
    </thead>
    <tbody>

`;

// Fonction helper pour formater les dates courtes
const formatShortDate = (dateString) => {
  if (!dateString) return '<span class="date-na">N/A</span>';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '<span class="date-na">N/A</span>';
  }
};

// Fonction helper pour tronquer les textes
const truncateText = (text, maxLength = 20) => {
  if (!text) return 'N/A';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Ajout des données avec formatage optimisé
filteredAndSortedMembres.value.forEach((membre, index) => {
  // Troncature des champs textuels pour économiser de l'espace
  const nomComplet = `${membre.nom || ''} ${membre.prenom || ''}`.trim();
  const nomTronque = truncateText(nomComplet, 40);
  
  const profession = truncateText(membre.profession, 18);
  const activite = truncateText(membre.activiteAuSeinDP, 20);
  const adresse = truncateText(membre.adresse, 40);
  const contact = membre.contact || 'N/A';
  
  // Formatage des dates
  const dateEntree = formatShortDate(membre.dateEntreeDepartement);
  const situationMatrimoniale = truncateText(membre.situationMatrimoniale,40);
  
  htmlContent += `
      <tr>
        <td class="col-nom" title="${nomComplet}">${nomTronque}</td>
        <td class="col-sexe">${membre.sexe || 'N/A'}</td>
        <td class="col-contact" title="${contact}">${contact}</td>
        <td class="col-email" title="${membre.adresse || ''}">${adresse}</td>
        <td class="col-profession" title="${membre.profession || ''}">${profession}</td>
        <td class="col-activite" title="${membre.activiteAuSeinDP || ''}">${activite}</td>
        <td class="col-entree">${dateEntree}</td>
        <td class="col-inscription">${situationMatrimoniale}</td>
      </tr>
  `;
});

// Fin du document
htmlContent += `
    </tbody>
  </table>
  
  <div class="footer">
    <p class="compact-text">Document généré automatiquement par le système de gestion des membres</p>
    <p class="compact-text">© ${new Date().getFullYear()} - Département de Culte • Page 1/1</p>
    <p class="compact-text" style="font-size: 6pt; margin-top: 5px;">
      N/A = Non renseigné • Passez la souris sur le texte pour voir le contenu complet
    </p>
  </div>
</body>
</html>
    `
    
    // Créer le blob et télécharger
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `membres_${new Date().toISOString().split('T')[0]}.doc`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (error) {
    console.error('Erreur lors de l\'export Word:', error)
    alert('Erreur lors de l\'export Word')
  } finally {
    isExporting.value = false
  }
}

// Actions sur les membres
const openDeleteModal = (membre) => {
  membreToDelete.value = membre
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!membreToDelete.value) return
  
  try {
    await $fetch(`/api/membres/${membreToDelete.value.id}`, { method: 'DELETE' })
    showDeleteModal.value = false
    membreToDelete.value = null
    fetchMembres()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    alert('Une erreur est survenue lors de la suppression')
  }
}

const editMembre = (membre) => {
  // À implémenter selon votre système d'édition
  console.log('Édition du membre:', membre)
  // Exemple : ouvrir un modal d'édition avec les données du membre
  // editModal.value = true
  // membreToEdit.value = membre
}

const viewDetails = (membre) => {
  selectedMembre.value = membre
  showDetailsModal.value = true
}
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation pour les boutons d'export */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

button:disabled {
  cursor: not-allowed;
}

button:not(:disabled):hover {
  animation: pulse 0.3s ease-in-out;
}
</style>