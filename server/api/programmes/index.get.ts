import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.programmeCulte.findMany({
    include: {
      planificateur: true,
      roles: {
        include: { membre: true }
      }
    },
    orderBy: { date: 'desc' }
  })
})
