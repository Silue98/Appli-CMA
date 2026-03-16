import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.statut) where.statut = q.statut
  return await prisma.demandePriere.findMany({
    where, orderBy: { createdAt: 'desc' },
    include: { membre: { select: { id: true, nom: true, prenom: true } } }
  })
})
