import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.budget.create({ data: { annee: Number(body.annee), departementId: body.departementId ? Number(body.departementId) : null, categorie: body.categorie, montantPrevu: Number(body.montantPrevu), description: body.description || null } })
})
