import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.annonce.create({
    data: {
      culteId: body.culteId,
      titre: body.titre,
      infosJour: body.infosJour,
      remerciements: body.remerciements,
      rappels: body.rappels,
      commentaires: body.commentaires,
      compteRendu: body.compteRendu
        ? {
            create: {
              messager: body.compteRendu.messager,
              texteBiblique: body.compteRendu.texteBiblique,
              assistanceTotale: body.compteRendu.assistanceTotale,
              theme: body.compteRendu.theme,
            },
          }
        : undefined,
    },
  })
})
