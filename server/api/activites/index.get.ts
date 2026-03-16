import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where: any = {}
  if (query.membreId) where.membreId = Number(query.membreId)

  return await prisma.activiteMembre.findMany({
    where,
    include: { membre: { select: { id: true, nom: true, prenom: true, photo: true } } },
    orderBy: { dateActivite: 'desc' }
  })
})
