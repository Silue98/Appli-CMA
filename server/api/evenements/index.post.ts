import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.titre || !body.dateDebut) throw createError({ statusCode: 400, message: 'Titre et date requis' })
  return await prisma.evenement.create({
    data: {
      titre: body.titre, description: body.description || null,
      type: body.type || 'AUTRE', statut: body.statut || 'PLANIFIE',
      dateDebut: new Date(body.dateDebut),
      dateFin: body.dateFin ? new Date(body.dateFin) : null,
      lieu: body.lieu || null, capaciteMax: body.capaciteMax ? Number(body.capaciteMax) : null,
      departementId: body.departementId ? Number(body.departementId) : null,
      responsable: body.responsable || null, budget: body.budget ? Number(body.budget) : null,
      notes: body.notes || null
    },
    include: { departement: true }
  })
})
