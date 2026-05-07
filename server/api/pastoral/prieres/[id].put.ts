import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.PASTORAL)
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.demandePriere.update({ where: { id }, data: { statut: body.statut } })
})
