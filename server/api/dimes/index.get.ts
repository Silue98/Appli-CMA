import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.membreId) where.membreId = Number(q.membreId)
  if (q.annee) where.annee = Number(q.annee)
  if (q.mois) where.mois = Number(q.mois)
  return await prisma.dime.findMany({
    where,
    include: { membre: { select: { id: true, nom: true, prenom: true } } },
    orderBy: [{ annee: 'desc' }, { mois: 'desc' }]
  })
})
