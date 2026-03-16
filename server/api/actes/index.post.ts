import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.type || !body.date || !body.officiant) throw createError({ statusCode: 400, message: 'Type, date et officiant requis' })
  return await prisma.actePastoral.create({
    data: {
      type: body.type, date: new Date(body.date),
      lieu: body.lieu || null, officiant: body.officiant,
      description: body.description || null, notes: body.notes || null,
      membreId: body.membreId ? Number(body.membreId) : null,
      temoinId: body.temoinId ? Number(body.temoinId) : null,
      conjointNom: body.conjointNom || null, conjointPrenom: body.conjointPrenom || null
    },
    include: { membre: true, temoin: true }
  })
})
