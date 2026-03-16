import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.titre) throw createError({ statusCode: 400, message: 'Le titre est requis' })
  if (!body.culteId) throw createError({ statusCode: 400, message: 'Le culte est requis' })
  if (!body.predicateurId) throw createError({ statusCode: 400, message: 'Le prédicateur est requis' })

  return await prisma.predication.create({
    data: {
      titre: body.titre,
      texteBiblique: body.texteBiblique || '',
      resume: body.resume || null,
      message: body.message || null,
      culteId: Number(body.culteId),
      predicateurId: Number(body.predicateurId)
    },
    include: { culte: true, predicateur: true }
  })
})
