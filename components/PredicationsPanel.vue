<template>
  <section class="w-full bg-white rounded-xl shadow p-6">
    <!-- 🧭 En-tête -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 class="text-xl font-semibold text-blue-700 flex items-center gap-2">
        📖 Gestion des Prédications
      </h2>
      <div class="flex gap-2">
        <button
          @click="printAllPredications"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          :disabled="predications.length === 0"
        >
          🖨️ Tout imprimer
        </button>
        <button
          @click="showForm = !showForm"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          {{ showForm ? '❌ Fermer' : '📝 Nouvelle prédication' }}
        </button>
      </div>
    </div>

    <!-- 🔍 Filtres & Recherche -->
    <div class="flex flex-col md:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Rechercher une prédication..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        v-model="sortField"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option disabled value="">Trier par...</option>
        <option value="titre">Titre</option>
        <option value="texteBiblique">Texte biblique</option>
        <option value="culte.themePrincipal">Culte</option>
      </select>
    </div>

    <!-- 📝 Formulaire -->
    <div v-if="showForm" class="mb-6">
      <PredicationForm @saved="onSaved" />
    </div>

    <!-- 📋 Tableau -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texte biblique</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Culte</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prédicateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résumé</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="predication in paginatedPredications" :key="predication.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ predication.titre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ predication.texteBiblique }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ predication.culte?.themePrincipal || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ predication.predicateur?.nom || '-' }} {{ predication.predicateur?.prenom || '' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ truncateHTML(predication.resume, 40) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="printSinglePredication(predication)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition"
                  title="Imprimer cette prédication"
                >
                  🖨️
                </button>
                <button
                  @click="deleteSinglePredication(predication)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                  title="Supprimer cette prédication"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="isLoading" class="text-center py-8 text-gray-500">
        <p>Chargement des prédications...</p>
      </div>
      
      <div v-else-if="predications.length === 0" class="text-center py-8 text-gray-500">
        Aucune prédication trouvée. Créez votre première prédication !
      </div>
    </div>

    <!-- 📄 Pagination -->
    <div
      v-if="filteredAndSortedPredications.length > 0"
      class="flex items-center justify-between mt-6 flex-wrap gap-3"
    >
      <p class="text-sm text-gray-500">
        Page {{ currentPage }} sur {{ totalPages }} - 
        {{ filteredAndSortedPredications.length }} prédication(s)
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
        >
          ⬅️ Précédent
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
        >
          Suivant ➡️
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PredicationForm from '~/components/PredicationForm.vue'

const showForm = ref(false)
const predications = ref([])
const isLoading = ref(true)
const search = ref('')
const sortField = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Date actuelle pour l'impression
const currentDate = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Charger les prédications
const fetchPredications = async () => {
  try {
    const res = await $fetch('/api/predications?include=culte,predicateur')
    predications.value = res || []
  } catch (err) {
    console.error('Erreur lors du chargement des prédications:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPredications()
})

// Rafraîchir après enregistrement
const onSaved = () => {
  showForm.value = false
  fetchPredications()
}

// Fonction pour tronquer le HTML
const truncateHTML = (html, length) => {
  if (!html) return '-'
  const text = html.replace(/<[^>]*>/g, '')
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Impression d'une seule prédication
const printSinglePredication = (predication) => {
  console.log('🖨️ Impression de:', predication.titre)
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour l\'impression')
    return
  }

  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${predication.titre || 'Prédication'}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 30px;
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
          
          .print-info-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2c5aa0;
            margin-bottom: 20px;
          }
          
          .print-info-box p {
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
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${predication.titre || 'Prédication sans titre'}</h1>
          <div class="print-meta">
            <p><strong>Date de génération:</strong> ${currentDate}</p>
            <p><strong>ID Prédication:</strong> ${predication.id}</p>
          </div>
        </div>

        <!-- INFORMATIONS DE BASE -->
        <div class="print-info-box">
          <p><strong>📖 Texte biblique:</strong> ${predication.texteBiblique || 'Non spécifié'}</p>
          <p><strong>📅 Culte:</strong> ${predication.culte?.themePrincipal || 'Non spécifié'}</p>
          <p><strong>👤 Prédicateur:</strong> ${predication.predicateur?.nom || 'Non spécifié'} ${predication.predicateur?.prenom || ''}</p>
          <p><strong>📅 Date du culte:</strong> ${predication.culte?.dateCulte ? new Date(predication.culte.dateCulte).toLocaleDateString('fr-FR') : 'Non spécifié'}</p>
        </div>

        <!-- RÉSUMÉ -->
        ${predication.resume ? `
          <div class="print-section">
            <h2>📋 Résumé de la prédication</h2>
            <div class="print-content">${predication.resume}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📋 Résumé de la prédication</h2>
            <div class="empty-section">Aucun résumé disponible</div>
          </div>
        `}

        <!-- MESSAGE COMPLET -->
        ${predication.message ? `
          <div class="print-section">
            <h2>📖 Message complet</h2>
            <div class="print-content">${predication.message}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📖 Message complet</h2>
            <div class="empty-section">Aucun message disponible</div>
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

// Suppression individuelle
const deleteSinglePredication = async (predication) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la prédication "${predication.titre}" ?`)) {
    try {
      await $fetch(`/api/predications/${predication.id}`, { method: 'DELETE' })
      fetchPredications()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('❌ Erreur lors de la suppression')
    }
  }
}

// Impression de toutes les prédications
const printAllPredications = () => {
  if (predications.value.length === 0) {
    alert('Aucune prédication à imprimer')
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
        <title>Liste des Prédications</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 1000px; 
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
          
          .print-predication {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .print-predication-header {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #2c5aa0;
            margin-bottom: 15px;
          }
          
          .print-predication-header h2 {
            margin: 0;
            color: #2c5aa0;
            font-size: 20px;
          }
          
          .print-predication-meta {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
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
          
          .print-content {
            font-size: 14px;
            line-height: 1.6;
          }
          
          .print-separator {
            border: none;
            border-top: 1px dashed #ccc;
            margin: 30px 0;
          }
          
          @media print {
            body { padding: 10px; }
            .print-header { margin-bottom: 20px; }
            .print-predication { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>📖 Liste des Prédications</h1>
          <p class="print-date">Généré le ${currentDate}</p>
          <p class="print-count">Total: ${predications.value.length} prédication(s)</p>
        </div>

        ${predications.value.map((predication, index) => `
          <div class="print-predication">
            <div class="print-predication-header">
              <h2>${index + 1}. ${predication.titre || 'Sans titre'}</h2>
              <div class="print-predication-meta">
                <strong>Texte biblique:</strong> ${predication.texteBiblique} | 
                <strong>Prédicateur:</strong> ${predication.predicateur?.nom || 'Non spécifié'} | 
                <strong>Culte:</strong> ${predication.culte?.themePrincipal || 'Non spécifié'}
              </div>
            </div>

            ${predication.resume ? `
              <div class="print-section">
                <h3>📋 Résumé</h3>
                <div class="print-content">${predication.resume}</div>
              </div>
            ` : ''}

            ${predication.message ? `
              <div class="print-section">
                <h3>📖 Message</h3>
                <div class="print-content">${predication.message}</div>
              </div>
            ` : ''}

            <hr class="print-separator">
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

// 🔍 Filtrage et tri
const filteredAndSortedPredications = computed(() => {
  let result = predications.value

  // Recherche
  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.titre?.toLowerCase().includes(term) ||
        p.texteBiblique?.toLowerCase().includes(term) ||
        p.culte?.themePrincipal?.toLowerCase().includes(term) ||
        p.predicateur?.nom?.toLowerCase().includes(term) ||
        p.predicateur?.prenom?.toLowerCase().includes(term)
    )
  }

  // Tri
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      const aValue = getNestedValue(a, sortField.value) || ''
      const bValue = getNestedValue(b, sortField.value) || ''
      return aValue.localeCompare(bValue)
    })
  }

  return result
})

// Helper pour les valeurs nested
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredAndSortedPredications.value.length / itemsPerPage.value)
)

const paginatedPredications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAndSortedPredications.value.slice(start, start + itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
  box-shadow: none;
}
</style>