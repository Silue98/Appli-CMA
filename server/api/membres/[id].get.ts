import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const membre = await prisma.membre.findUnique({
    where: { id },
    include: {
      activites: true,
      predications: { include: { culte: true } }
    }
  })

  if (!membre) throw createError({ statusCode: 404, message: 'Membre introuvable' })
  return membre
})
