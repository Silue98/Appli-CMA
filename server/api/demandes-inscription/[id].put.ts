// server/api/demandes-inscription/[id].put.ts
// Accepter ou refuser une demande (admin)
// Si action = 'ACCEPTE', crée automatiquement le membre dans la table Membre
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    await $fetch('/api/auth/me', {
      headers: { cookie: getRequestHeader(event, 'cookie') || '' }
    })
  } catch {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)

  const demande = await prisma.demandeInscription.findUnique({ where: { id } })
  if (!demande) throw createError({ statusCode: 404, message: 'Demande introuvable' })

  // Si acceptée → vérifications AVANT de toucher à quoi que ce soit
  if (body.statut === 'ACCEPTE') {

    // Vérifier si l'email est déjà utilisé par un membre existant
    if (demande.email) {
      const emailExiste = await prisma.membre.findUnique({ where: { email: demande.email } })
      if (emailExiste) {
        throw createError({
          statusCode: 409,
          message: `L'adresse email "${demande.email}" est déjà utilisée par le membre ${emailExiste.prenom} ${emailExiste.nom}. Veuillez corriger l'email de la demande avant d'accepter.`
        })
      }
    }

    // Générer un numéro membre unique basé sur le MAX existant (pas le count)
    const dernierMembre = await prisma.membre.findFirst({
      where: { numeroMembre: { startsWith: 'MBR-' } },
      orderBy: { numeroMembre: 'desc' }
    })
    let nextNum = 1
    if (dernierMembre?.numeroMembre) {
      const num = parseInt(dernierMembre.numeroMembre.replace('MBR-', ''))
      if (!isNaN(num)) nextNum = num + 1
    }
    const numeroMembre = `MBR-${String(nextNum).padStart(4, '0')}`

    // Créer le membre
    const membre = await prisma.membre.create({
      data: {
        numeroMembre,
        nom:                   demande.nom,
        prenom:                demande.prenom,
        sexe:                  demande.sexe,
        dateNaissance:         demande.dateNaissance         || null,
        contact:               demande.contact               || null,
        email:                 demande.email                 || null,
        adresse:               demande.adresse               || null,
        situationMatrimoniale: demande.situationMatrimoniale || null,
        profession:            demande.profession            || null,
        photo:                 demande.photo                 || null,
        statut:                'VISITEUR',
        dateEntreeEglise:      demande.dateEntreeAleglise    || null,
        dateBaptemeEau:        demande.dateBaptemes          || null,
        activiteAuSeinDP:      demande.activiteAuSeinDP      || null,
        dateEntreeDepartement: demande.dateEntreeDepartement || null
      }
    })

    // Marquer la demande comme acceptée seulement si le membre a bien été créé
    const updated = await prisma.demandeInscription.update({
      where: { id },
      data: { statut: 'ACCEPTE', notesAdmin: body.notesAdmin || null }
    })

    return { demande: updated, membre }
  }

  // Cas REFUSE : juste mettre à jour le statut
  const updated = await prisma.demandeInscription.update({
    where: { id },
    data: { statut: body.statut, notesAdmin: body.notesAdmin || null }
  })

  return { demande: updated, membre: null }
})