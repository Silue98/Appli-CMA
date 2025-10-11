import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.predication.create({
    data: {
      culteId: body.culteId,
      titre: body.titre,
      texteBiblique: body.texteBiblique,
      resume: body.resume,
      message: body.message,
      predicateurId: body.predicateurId,
    },
  })
})
