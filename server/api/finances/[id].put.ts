import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.FINANCES)
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })
  const body = await readBody(event)

  return await prisma.finance.update({
    where: { id },
    data: {
      type: body.type,
      montant: body.montant ? Number(body.montant) : undefined,
      description: body.description || null,
      date: body.date ? new Date(body.date) : undefined,
      culteId: body.culteId ? Number(body.culteId) : null
    },
    include: { culte: true }
  })
})
