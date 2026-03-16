import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const debutAnnee = new Date(now.getFullYear(), 0, 1)

  const [totalMois, totalAnnee, parType, derniersDons] = await Promise.all([
    prisma.finance.aggregate({
      where: { date: { gte: debutMois }, type: { not: 'DEPENSE' } },
      _sum: { montant: true }
    }),
    prisma.finance.aggregate({
      where: { date: { gte: debutAnnee }, type: { not: 'DEPENSE' } },
      _sum: { montant: true }
    }),
    prisma.finance.groupBy({
      by: ['type'],
      _sum: { montant: true },
      where: { date: { gte: debutAnnee } }
    }),
    prisma.finance.findMany({
      take: 5,
      where: { type: { not: 'DEPENSE' } },
      orderBy: { date: 'desc' },
      include: { culte: true }
    })
  ])

  return {
    totalMois: totalMois._sum.montant || 0,
    totalAnnee: totalAnnee._sum.montant || 0,
    parType,
    derniersDons
  }
})
