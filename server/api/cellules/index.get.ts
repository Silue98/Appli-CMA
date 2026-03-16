import prisma from '~/server/utils/prisma'
export default defineEventHandler(async () => {
  return await prisma.cellule.findMany({
    include: {
      responsable: { select: { id: true, nom: true, prenom: true } },
      _count: { select: { membres: true, reunions: true } }
    },
    orderBy: { nom: 'asc' }
  })
})
