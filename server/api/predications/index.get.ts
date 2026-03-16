import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.predication.findMany({
    include: {
      culte: true,
      predicateur: true
    },
    orderBy: { id: 'desc' }
  })
})
