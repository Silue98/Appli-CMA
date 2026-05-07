import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.evenement.update({
    where: { id },
    data: {
      titre: body.titre, description: body.description || null,
      type: body.type, statut: body.statut,
      dateDebut: body.dateDebut ? new Date(body.dateDebut) : undefined,
      dateFin: body.dateFin ? new Date(body.dateFin) : null,
      lieu: body.lieu || null, capaciteMax: body.capaciteMax ? Number(body.capaciteMax) : null,
      departementId: body.departementId ? Number(body.departementId) : null,
      responsable: body.responsable || null, budget: body.budget ? Number(body.budget) : null,
      notes: body.notes || null
    },
    include: { departement: true }
  })
})
