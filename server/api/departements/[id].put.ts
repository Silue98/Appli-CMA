import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.departement.update({ where: { id }, data: { nom: body.nom, description: body.description || null, couleur: body.couleur || null, icone: body.icone || null, actif: body.actif } })
})
