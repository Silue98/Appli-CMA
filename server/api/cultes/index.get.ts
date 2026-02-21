import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.culte.findMany({
    include: { predications: true, annonces: true },
    orderBy: { dateCulte: 'desc' },
  })
})
