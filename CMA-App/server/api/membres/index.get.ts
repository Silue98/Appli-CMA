import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.membre.findMany({
    include: { activites: true, predications: true },
  })
})
