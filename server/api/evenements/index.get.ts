import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.type) where.type = q.type
  if (q.statut) where.statut = q.statut
  return await prisma.evenement.findMany({
    where, orderBy: { dateDebut: 'desc' },
    include: { departement: true, _count: { select: { inscriptions: true } } }
  })
})
