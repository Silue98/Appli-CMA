import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.sujet) throw createError({ statusCode: 400, message: 'Sujet requis' })
  return await prisma.demandePriere.create({
    data: { membreId: body.membreId ? Number(body.membreId) : null, nom: body.nom || null, sujet: body.sujet, details: body.details || null, confidentiel: body.confidentiel || false, statut: 'EN_COURS' }
  })
})
