import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.membreId) where.membreId = Number(q.membreId)
  if (q.type) where.type = q.type
  return await prisma.visitePastorale.findMany({
    where, orderBy: { date: 'desc' },
    include: { membre: { select: { id: true, nom: true, prenom: true, photo: true } } }
  })
})
