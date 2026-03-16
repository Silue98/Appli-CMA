import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.categorie) where.categorie = q.categorie
  if (q.etat) where.etat = q.etat
  return await prisma.inventaire.findMany({ where, orderBy: { categorie: 'asc' } })
})
