import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const body = await readBody(event)
  if (!body.sujet) throw createError({ statusCode: 400, message: 'Sujet requis' })
  const priere = await prisma.demandePriere.create({
    data: { membreId: body.membreId ? Number(body.membreId) : null, nom: body.nom || null, sujet: body.sujet, details: body.details || null, confidentiel: body.confidentiel || false, statut: 'EN_COURS' }
  })

  try {
    await $fetch('/api/emails/notify-priere', { method: 'POST', body: { priereId: priere.id } })
  } catch (e) { console.error('Email prière:', e) }

  return priere
})
