import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const body = await readBody(event)

  return await prisma.culte.update({
    where: { id },
    data: {
      dateCulte: body.dateCulte ? new Date(body.dateCulte) : undefined,
      horaire: body.horaire,
      themePrincipal: body.themePrincipal || null
    }
  })
})
