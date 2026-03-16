import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.annee) where.annee = Number(q.annee)
  if (q.departementId) where.departementId = Number(q.departementId)
  const [budgets, depenses] = await Promise.all([
    prisma.budget.findMany({ where, orderBy: { categorie: 'asc' } }),
    prisma.finance.groupBy({ by: ['departementId'], where: { type: 'DEPENSE', date: { gte: new Date(`${q.annee || new Date().getFullYear()}-01-01`) } }, _sum: { montant: true } })
  ])
  return { budgets, depenses }
})
