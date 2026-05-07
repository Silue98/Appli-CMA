import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const body = await readBody(event)
  if (!body.dateCulte) throw createError({ statusCode: 400, message: 'La date du culte est requise' })
  if (!body.horaire) throw createError({ statusCode: 400, message: 'L\'horaire est requis' })

  const culte = await prisma.culte.create({
    data: { dateCulte: new Date(body.dateCulte), horaire: body.horaire, themePrincipal: body.themePrincipal || null }
  })

  try {
    await $fetch('/api/emails/notify-culte', { method: 'POST', body: { culteId: culte.id } })
  } catch (e) { console.error('Email culte:', e) }

  return culte
})
