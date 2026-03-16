import prisma from '~/server/utils/prisma'
export default defineEventHandler(async () => {
  return await prisma.famille.findMany({
    include: { _count: { select: { membres: true } } },
    orderBy: { nom: 'asc' }
  })
})
