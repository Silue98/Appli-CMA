// server/api/inscription/config.put.ts
// Met à jour la config d'inscription — réservé aux admins connectés
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Vérification auth
  try {
    await $fetch('/api/auth/me', {
      headers: { cookie: getRequestHeader(event, 'cookie') || '' }
    })
  } catch {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const body = await readBody(event)

  // Helper : parse une date uniquement si valide, sinon null
  const parseDate = (val: any): Date | null => {
    if (!val) return null
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }

  let config = await prisma.configInscription.findFirst()

  if (!config) {
    config = await prisma.configInscription.create({
      data: {
        actif:         body.actif ?? false,
        dateDebut:     parseDate(body.dateDebut),
        dateFin:       parseDate(body.dateFin),
        messageOuvert: body.messageOuvert || null,
        messageFerme:  body.messageFerme  || null
      }
    })
  } else {
    config = await prisma.configInscription.update({
      where: { id: config.id },
      data: {
        actif: body.actif ?? config.actif,
        // N'écraser dateDebut/dateFin que si le champ est explicitement envoyé
        ...(body.dateDebut !== undefined && { dateDebut: parseDate(body.dateDebut) }),
        ...(body.dateFin   !== undefined && { dateFin:   parseDate(body.dateFin)   }),
        ...(body.messageOuvert !== undefined && { messageOuvert: body.messageOuvert || null }),
        ...(body.messageFerme  !== undefined && { messageFerme:  body.messageFerme  || null })
      }
    })
  }

  const now = new Date()
  const dansLaPeriode =
    (!config.dateDebut || (config.dateDebut instanceof Date && !isNaN(config.dateDebut.getTime()) && now >= config.dateDebut)) &&
    (!config.dateFin   || (config.dateFin   instanceof Date && !isNaN(config.dateFin.getTime())   && now <= config.dateFin))

  return { ...config, estOuvert: config.actif && dansLaPeriode }
})
