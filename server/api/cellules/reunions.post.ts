import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.celluleId || !body.date) throw createError({ statusCode: 400, message: 'Cellule et date requis' })
  return await prisma.reunionCellule.create({
    data: { celluleId: Number(body.celluleId), date: new Date(body.date), lieu: body.lieu || null, theme: body.theme || null, presents: body.presents ? Number(body.presents) : null, notes: body.notes || null }
  })
})
