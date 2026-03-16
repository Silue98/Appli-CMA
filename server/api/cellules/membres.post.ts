import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.membreCellule.upsert({
    where: { membreId_celluleId: { membreId: Number(body.membreId), celluleId: Number(body.celluleId) } },
    create: { membreId: Number(body.membreId), celluleId: Number(body.celluleId), actif: true },
    update: { actif: true }
  })
})
