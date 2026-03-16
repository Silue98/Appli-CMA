import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const annonce = await prisma.annonce.findUnique({
    where: { id },
    include: { compteRendu: true, culte: true }
  })
  if (!annonce) throw createError({ statusCode: 404, message: 'Annonce introuvable' })
  return annonce
})
