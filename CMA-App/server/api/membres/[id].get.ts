import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  return await prisma.membre.findUnique({
    where: { id },
    include: { activites: true, predications: true },
  })
})
