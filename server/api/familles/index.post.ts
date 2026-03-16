import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom) throw createError({ statusCode: 400, message: 'Nom requis' })
  return await prisma.famille.create({ data: { nom: body.nom, adresse: body.adresse || null, contact: body.contact || null } })
})
