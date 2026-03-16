import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.evenementId || !body.nom || !body.prenom) throw createError({ statusCode: 400, message: 'Champs requis manquants' })
  return await prisma.inscription.create({
    data: { evenementId: Number(body.evenementId), nom: body.nom, prenom: body.prenom, contact: body.contact || null, statut: body.statut || 'CONFIRME', notes: body.notes || null }
  })
})
