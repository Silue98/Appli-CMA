import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  // Vérifier si le membre a des prédications (Foreign Key Restrict)
  const predCount = await prisma.predication.count({ where: { predicateurId: id } })
  if (predCount > 0) {
    throw createError({
      statusCode: 409,
      message: `Impossible de supprimer ce membre : il est prédicateur de ${predCount} prédication(s). Supprimez ou réassignez ces prédications d'abord.`
    })
  }

  await prisma.membre.delete({ where: { id } })
  return { message: 'Membre supprimé avec succès' }
})
