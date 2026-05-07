import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  await prisma.culte.delete({ where: { id } })
  return { message: 'Culte supprimé avec succès' }
})
