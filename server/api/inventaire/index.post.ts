import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom || !body.categorie) throw createError({ statusCode: 400, message: 'Nom et catégorie requis' })
  return await prisma.inventaire.create({
    data: { nom: body.nom, categorie: body.categorie, quantite: Number(body.quantite) || 1, etat: body.etat || 'BON', valeur: body.valeur ? Number(body.valeur) : null, dateAchat: body.dateAchat ? new Date(body.dateAchat) : null, fournisseur: body.fournisseur || null, numeroSerie: body.numeroSerie || null, localisation: body.localisation || null, notes: body.notes || null }
  })
})
