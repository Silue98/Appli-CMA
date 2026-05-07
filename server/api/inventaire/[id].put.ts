import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  return await prisma.inventaire.update({
    where: { id },
    data: { nom: body.nom, categorie: body.categorie, quantite: Number(body.quantite) || 1, etat: body.etat, valeur: body.valeur ? Number(body.valeur) : null, dateAchat: body.dateAchat ? new Date(body.dateAchat) : null, fournisseur: body.fournisseur || null, numeroSerie: body.numeroSerie || null, localisation: body.localisation || null, notes: body.notes || null }
  })
})
