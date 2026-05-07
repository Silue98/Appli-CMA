import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.FINANCES)
  const body = await readBody(event)
  if (!body.type) throw createError({ statusCode: 400, message: 'Le type est requis' })
  if (!body.montant || isNaN(Number(body.montant))) throw createError({ statusCode: 400, message: 'Le montant est requis' })

  return await prisma.finance.create({
    data: {
      type: body.type,
      montant: Number(body.montant),
      description: body.description || null,
      date: body.date ? new Date(body.date) : new Date(),
      culteId: body.culteId ? Number(body.culteId) : null
    },
    include: { culte: true }
  })
})
