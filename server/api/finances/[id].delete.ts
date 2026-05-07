import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.FINANCES)
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })
  await prisma.finance.delete({ where: { id } })
  return { message: 'Transaction supprimée' }
})
