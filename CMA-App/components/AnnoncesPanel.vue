<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-green-700">📢 Gestion des Annonces</h1>
      
      <div class="flex gap-2">
        <button
          @click="printAllAnnonces"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          :disabled="annonces.length === 0"
        >
          🖨️ Tout imprimer
        </button>

        <button
          @click="showForm = !showForm"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          {{ showForm ? '❌ Fermer' : '📝 Nouvelle annonce' }}
        </button>
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-6">
      <AnnonceForm
        @saved="handleSaved"
        @close="showForm = false"
      />
    </div>

    <!-- Tableau des annonces -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Culte ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte Rendu</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infos du jour</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remerciements</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rappels</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaires</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="annonce in annonces" :key="annonce.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ annonce.titre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ annonce.culteId }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatCompteRendu(annonce.compteRendu) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ truncateHTML(annonce.infosJour, 30) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ truncateHTML(annonce.remerciements, 30) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ truncateHTML(annonce.rappels, 30) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ truncateHTML(annonce.commentaires, 30) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="printSingleAnnonce(annonce)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition"
                  title="Imprimer cette annonce"
                >
                  🖨️
                </button>
                <button
                  @click="deleteSingleAnnonce(annonce)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                  title="Supprimer cette annonce"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="annonces.length === 0" class="text-center py-8 text-gray-500">
        Aucune annonce trouvée. Créez votre première annonce !
      </div>
    </div>
  </div>
</template>

<script setup>
import AnnonceForm from '~/components/AnnonceForm.vue'

const showForm = ref(false)
const { data: annonces, refresh } = await useFetch('/api/annonces')

// Date actuelle pour l'impression
const currentDate = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Fonction pour tronquer le HTML
const truncateHTML = (html, length) => {
  if (!html) return '-'
  const text = html.replace(/<[^>]*>/g, '')
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Fonction pour formater le compte rendu dans le tableau
const formatCompteRendu = (compteRendu) => {
  if (!compteRendu) return '-'
  
  const parts = []
  if (compteRendu.messager) parts.push(`📖:${compteRendu.messager.substring(0, 15)}...`)
  if (compteRendu.assistanceTotale) parts.push(`👥:${compteRendu.assistanceTotale}`)
  
  return parts.length > 0 ? parts.join(' ') : 'Compte rendu'
}

// Gestion après sauvegarde
const handleSaved = () => {
  refresh()
  showForm.value = false
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

        <!-- COMPTE RENDU EN PREMIER -->
        ${annonce.compteRendu ? `
          <div class="print-section">
            <h2>📊 Compte Rendu du Culte Précédent</h2>
            <div class="print-compte-rendu">
              ${annonce.compteRendu.messager ? `<p><strong>📖 Messager:</strong> ${annonce.compteRendu.messager}</p>` : ''}
              ${annonce.compteRendu.texteBiblique ? `<p><strong>✝️ Texte Biblique:</strong> ${annonce.compteRendu.texteBiblique}</p>` : ''}
              ${annonce.compteRendu.assistanceTotale ? `<p><strong>👥 Assistance Totale:</strong> ${annonce.compteRendu.assistanceTotale} personnes</p>` : ''}
              ${annonce.compteRendu.theme ? `<p><strong>🎯 Thème du Culte:</strong> ${annonce.compteRendu.theme}</p>` : ''}
            </div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📊 Compte Rendu du Culte Précédent</h2>
            <div class="empty-section">Aucun compte rendu disponible</div>
          </div>
        `}

        <!-- PUIS INFORMATIONS DU JOUR -->
        ${annonce.infosJour ? `
          <div class="print-section">
            <h2>📅 Informations du Jour</h2>
            <div class="print-content">${annonce.infosJour}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>📅 Informations du Jour</h2>
            <div class="empty-section">Aucune information spécifiée</div>
          </div>
        `}

        ${annonce.remerciements ? `
          <div class="print-section">
            <h2>🙏 Remerciements</h2>
            <div class="print-content">${annonce.remerciements}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>🙏 Remerciements</h2>
            <div class="empty-section">Aucun remerciement spécifié</div>
          </div>
        `}

        ${annonce.rappels ? `
          <div class="print-section">
            <h2>🔔 Rappels Importants</h2>
            <div class="print-content">${annonce.rappels}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>🔔 Rappels Importants</h2>
            <div class="empty-section">Aucun rappel spécifié</div>
          </div>
        `}

        ${annonce.commentaires ? `
          <div class="print-section">
            <h2>💬 Commentaires & Annotations</h2>
            <div class="print-content">${annonce.commentaires}</div>
          </div>
        ` : `
          <div class="print-section">
            <h2>💬 Commentaires & Annotations</h2>
            <div class="empty-section">Aucun commentaire spécifié</div>
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
const deleteSingleAnnonce = async (annonce) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${annonce.titre}" ?`)) {
    await $fetch(`/api/annonces/${annonce.id}`, { method: 'DELETE' })
    refresh()
  }
}

// Impression de toutes les annonces
const printAllAnnonces = () => {
  if (annonces.value.length === 0) {
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
          
          .print-separator {
            border: none;
            border-top: 1px dashed #ccc;
            margin: 30px 0;
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
          <p class="print-count">Total: ${annonces.value.length} annonce(s)</p>
        </div>

        ${annonces.value.map((annonce, index) => `
          <div class="print-annonce">
            <div class="print-annonce-header">
              <h2>${index + 1}. ${annonce.titre || 'Sans titre'}</h2>
              <span class="print-culte-id">Culte #${annonce.culteId}</span>
            </div>

            <!-- COMPTE RENDU EN PREMIER -->
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