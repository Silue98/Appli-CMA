import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.emailLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  })
})
