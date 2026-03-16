import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.membreId || !body.service || !body.dimanche) throw createError({ statusCode: 400, message: 'Champs requis manquants' })
  return await prisma.serviceBenevole.create({
    data: { membreId: Number(body.membreId), service: body.service, dimanche: new Date(body.dimanche), statut: body.statut || 'PLANIFIE', notes: body.notes || null },
    include: { membre: { select: { id: true, nom: true, prenom: true } } }
  })
})
