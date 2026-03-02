import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.culte.create({
    data: {
      dateCulte: new Date(body.dateCulte),
      horaire: body.horaire,
      themePrincipal: body.themePrincipal,
    },
  })
})
