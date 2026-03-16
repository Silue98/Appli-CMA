import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const body = await readBody(event)

  return await prisma.predication.update({
    where: { id },
    data: {
      titre: body.titre,
      texteBiblique: body.texteBiblique,
      resume: body.resume || null,
      message: body.message || null,
      culteId: body.culteId ? Number(body.culteId) : undefined,
      predicateurId: body.predicateurId ? Number(body.predicateurId) : undefined
    },
    include: { culte: true, predicateur: true }
  })
})
