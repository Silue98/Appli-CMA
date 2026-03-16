import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where: any = {}
  if (query.type) where.type = query.type
  if (query.culteId) where.culteId = Number(query.culteId)
  if (query.dateDebut || query.dateFin) {
    where.date = {}
    if (query.dateDebut) where.date.gte = new Date(query.dateDebut as string)
    if (query.dateFin) where.date.lte = new Date(query.dateFin as string)
  }

  const [transactions, totaux] = await Promise.all([
    prisma.finance.findMany({
      where,
      include: { culte: true },
      orderBy: { date: 'desc' }
    }),
    prisma.finance.groupBy({
      by: ['type'],
      _sum: { montant: true },
      where
    })
  ])

  return { transactions, totaux }
})
