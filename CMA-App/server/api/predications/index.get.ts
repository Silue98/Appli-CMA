import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.predication.findMany({
    include: { predications: true, annonces: true },
    orderBy: { dateCulte: 'desc' },
  })
})
