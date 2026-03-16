import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom) throw createError({ statusCode: 400, message: 'Le nom est requis' })
  return await prisma.departement.create({ data: { nom: body.nom, description: body.description || null, couleur: body.couleur || null, icone: body.icone || null } })
})
