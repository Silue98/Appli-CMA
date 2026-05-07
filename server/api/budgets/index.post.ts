import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.FINANCES)
  const body = await readBody(event)
  return await prisma.budget.create({ data: { annee: Number(body.annee), departementId: body.departementId ? Number(body.departementId) : null, categorie: body.categorie, montantPrevu: Number(body.montantPrevu), description: body.description || null } })
})
