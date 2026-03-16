import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.statut) where.statut = q.statut
  if (q.departementId) where.departements = { some: { departementId: Number(q.departementId), actif: true } }
  return await prisma.membre.findMany({
    where, orderBy: { nom: 'asc' },
    include: { famille: true, departements: { where: { actif: true }, include: { departement: true } } }
  })
})
