import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom) throw createError({ statusCode: 400, message: 'Nom requis' })
  return await prisma.cellule.create({
    data: { nom: body.nom, zone: body.zone || null, quartier: body.quartier || null, responsableId: body.responsableId ? Number(body.responsableId) : null }
  })
})
