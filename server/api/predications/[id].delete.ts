import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  await prisma.predication.delete({ where: { id } })
  return { message: 'Prédication supprimée avec succès' }
})
