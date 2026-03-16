import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where: any = {}
  if (query.culteId) where.culteId = Number(query.culteId)
  if (query.membreId) where.membreId = Number(query.membreId)

  return await prisma.presence.findMany({
    where,
    include: {
      membre: { select: { id: true, nom: true, prenom: true, sexe: true, activiteAuSeinDP: true, photo: true } },
      culte: true
    },
    orderBy: { createdAt: 'desc' }
  })
})
