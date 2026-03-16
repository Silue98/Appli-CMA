import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.dimanche) where.dimanche = { gte: new Date(q.dimanche as string), lt: new Date(new Date(q.dimanche as string).getTime() + 7 * 86400000) }
  if (q.service) where.service = q.service
  return await prisma.serviceBenevole.findMany({
    where, orderBy: [{ dimanche: 'desc' }, { service: 'asc' }],
    include: { membre: { select: { id: true, nom: true, prenom: true, contact: true, photo: true } } }
  })
})
