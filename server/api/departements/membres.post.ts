import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.membreDepartement.upsert({
    where: { membreId_departementId: { membreId: Number(body.membreId), departementId: Number(body.departementId) } },
    create: { membreId: Number(body.membreId), departementId: Number(body.departementId), role: body.role || null, actif: true },
    update: { actif: true, role: body.role || null }
  })
})
