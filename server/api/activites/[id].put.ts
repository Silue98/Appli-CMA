import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })
  const body = await readBody(event)

  return await prisma.activiteMembre.update({
    where: { id },
    data: {
      titre: body.titre,
      description: body.description || null,
      dateActivite: body.dateActivite ? new Date(body.dateActivite) : undefined,
      lieu: body.lieu || null
    }
  })
})
