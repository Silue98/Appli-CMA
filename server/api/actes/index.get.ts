import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.type) where.type = q.type
  return await prisma.actePastoral.findMany({
    where, orderBy: { date: 'desc' },
    include: { membre: { select: { id: true, nom: true, prenom: true } }, temoin: { select: { id: true, nom: true, prenom: true } } }
  })
})
