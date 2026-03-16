import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.cellule.update({
    where: { id },
    data: { nom: body.nom, zone: body.zone || null, quartier: body.quartier || null, responsableId: body.responsableId ? Number(body.responsableId) : null, actif: body.actif }
  })
})
