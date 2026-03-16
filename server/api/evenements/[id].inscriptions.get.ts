import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  return await prisma.inscription.findMany({ where: { evenementId: id }, orderBy: { createdAt: 'desc' } })
})
