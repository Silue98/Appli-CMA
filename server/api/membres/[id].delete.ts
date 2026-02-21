import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  await prisma.membre.delete({ where: { id } })
  return { message: 'Membre supprimé avec succès' }
})
