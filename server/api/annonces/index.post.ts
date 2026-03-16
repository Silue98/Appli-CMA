import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.titre) throw createError({ statusCode: 400, message: 'Le titre est requis' })
  if (!body.culteId) throw createError({ statusCode: 400, message: 'Le culte est requis' })

  // Vérifier si le compte rendu a des données réelles
  const hasCompteRendu = body.compteRendu && (
    body.compteRendu.messager ||
    body.compteRendu.texteBiblique ||
    body.compteRendu.theme ||
    body.compteRendu.assistanceTotale
  )

  return await prisma.annonce.create({
    data: {
      culteId: Number(body.culteId),
      titre: body.titre,
      infosJour: body.infosJour || null,
      remerciements: body.remerciements || null,
      rappels: body.rappels || null,
      commentaires: body.commentaires || null,
      compteRendu: hasCompteRendu ? {
        create: {
          messager: body.compteRendu.messager || '',
          texteBiblique: body.compteRendu.texteBiblique || '',
          assistanceTotale: body.compteRendu.assistanceTotale ? Number(body.compteRendu.assistanceTotale) : 0,
          theme: body.compteRendu.theme || ''
        }
      } : undefined
    },
    include: { compteRendu: true, culte: true }
  })
})
