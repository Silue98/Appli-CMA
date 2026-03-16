import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })
  const session = JSON.parse(getCookie(event, 'cma_session') || '{}')
  if (session.id === id) throw createError({ statusCode: 400, message: 'Vous ne pouvez pas supprimer votre propre compte' })
  await prisma.utilisateur.delete({ where: { id } })
  return { message: 'Utilisateur supprimé' }
})
