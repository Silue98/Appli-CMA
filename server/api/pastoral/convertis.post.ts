import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.membreId || !body.dateConversion) throw createError({ statusCode: 400, message: 'Membre et date requis' })
  return await prisma.nouveauConverti.upsert({
    where: { membreId: Number(body.membreId) },
    create: { membreId: Number(body.membreId), dateConversion: new Date(body.dateConversion), lieuConversion: body.lieuConversion || null, evangelisateur: body.evangelisateur || null, stadeFormation: body.stadeFormation || 'NOUVEAU', notes: body.notes || null },
    update: { stadeFormation: body.stadeFormation || 'NOUVEAU', notes: body.notes || null, lieuConversion: body.lieuConversion || null, evangelisateur: body.evangelisateur || null }
  })
})
