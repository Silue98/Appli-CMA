import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const [parCulte, tauxGlobal] = await Promise.all([
    prisma.culte.findMany({
      take: 10,
      orderBy: { dateCulte: 'desc' },
      include: {
        presences: true,
        _count: { select: { presences: true } }
      }
    }),
    prisma.presence.groupBy({
      by: ['statut'],
      _count: true
    })
  ])

  return { parCulte, tauxGlobal }
})
