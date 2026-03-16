import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.membreId) throw createError({ statusCode: 400, message: 'Le membre est requis' })
  if (!body.titre) throw createError({ statusCode: 400, message: 'Le titre est requis' })
  if (!body.dateActivite) throw createError({ statusCode: 400, message: 'La date est requise' })

  return await prisma.activiteMembre.create({
    data: {
      membreId: Number(body.membreId),
      titre: body.titre,
      description: body.description || null,
      dateActivite: new Date(body.dateActivite),
      lieu: body.lieu || null
    },
    include: { membre: { select: { id: true, nom: true, prenom: true } } }
  })
})
