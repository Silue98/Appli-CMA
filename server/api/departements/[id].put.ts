import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.departement.update({ where: { id }, data: { nom: body.nom, description: body.description || null, couleur: body.couleur || null, icone: body.icone || null, actif: body.actif } })
})
