import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.annonce.findMany({
    include: { compteRendu: true, culte: true },
    orderBy: { id: 'desc' },
  })
})
