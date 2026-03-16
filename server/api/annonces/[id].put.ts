import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const body = await readBody(event)

  // Mise à jour des données de base
  const annonce = await prisma.annonce.update({
    where: { id },
    data: {
      titre: body.titre,
      culteId: body.culteId ? Number(body.culteId) : undefined,
      infosJour: body.infosJour || null,
      remerciements: body.remerciements || null,
      rappels: body.rappels || null,
      commentaires: body.commentaires || null
    },
    include: { compteRendu: true, culte: true }
  })

  // Mise à jour ou création du compte rendu
  if (body.compteRendu) {
    const hasData = body.compteRendu.messager || body.compteRendu.texteBiblique || body.compteRendu.theme || body.compteRendu.assistanceTotale

    if (hasData) {
      await prisma.compteRendu.upsert({
        where: { annonceId: id },
        create: {
          annonceId: id,
          messager: body.compteRendu.messager || '',
          texteBiblique: body.compteRendu.texteBiblique || '',
          assistanceTotale: body.compteRendu.assistanceTotale ? Number(body.compteRendu.assistanceTotale) : 0,
          theme: body.compteRendu.theme || ''
        },
        update: {
          messager: body.compteRendu.messager || '',
          texteBiblique: body.compteRendu.texteBiblique || '',
          assistanceTotale: body.compteRendu.assistanceTotale ? Number(body.compteRendu.assistanceTotale) : 0,
          theme: body.compteRendu.theme || ''
        }
      })
    }
  }

  return await prisma.annonce.findUnique({
    where: { id },
    include: { compteRendu: true, culte: true }
  })
})
