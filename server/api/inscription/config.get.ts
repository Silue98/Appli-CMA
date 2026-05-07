// server/api/inscription/config.get.ts
// Retourne la config d'inscription (publique — pour vérifier si ouvert)
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  let config = await prisma.configInscription.findFirst()

  // Créer la config par défaut si elle n'existe pas encore
  if (!config) {
    config = await prisma.configInscription.create({
      data: {
        actif:         false,
        messageOuvert: 'Bienvenue ! Remplissez ce formulaire pour rejoindre notre église.',
        messageFerme:  'Les inscriptions sont actuellement fermées. Revenez bientôt !'
      }
    })
  }

  // Helper : date valide ?
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime())

  const now = new Date()
  const dansLaPeriode =
    (!config.dateDebut || (isValidDate(config.dateDebut) && now >= config.dateDebut)) &&
    (!config.dateFin   || (isValidDate(config.dateFin)   && now <= config.dateFin))

  return {
    ...config,
    // Nettoyer les dates invalides pour ne pas crasher le front
    dateDebut: isValidDate(config.dateDebut) ? config.dateDebut : null,
    dateFin:   isValidDate(config.dateFin)   ? config.dateFin   : null,
    estOuvert: config.actif && dansLaPeriode
  }
})
