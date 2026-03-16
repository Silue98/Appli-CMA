import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  await prisma.departement.delete({ where: { id } })
  return { message: 'Département supprimé' }
})
