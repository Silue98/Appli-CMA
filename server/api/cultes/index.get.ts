import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.culte.findMany({
    include: {
      predications: {
        include: { predicateur: true }
      },
      annonces: { include: { compteRendu: true } }
    },
    orderBy: { dateCulte: 'desc' }
  })
})
