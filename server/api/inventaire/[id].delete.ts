import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  await prisma.inventaire.delete({ where: { id } })
  return { message: 'Article supprimé' }
})
