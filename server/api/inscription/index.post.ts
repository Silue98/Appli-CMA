// server/api/inscription/index.post.ts
// Soumission publique du formulaire d'inscription (sans auth)
import prisma from '~/server/utils/prisma'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // 1. Vérifier que les inscriptions sont ouvertes
  const config = await prisma.configInscription.findFirst()
  const now = new Date()
  const dansLaPeriode = config
    ? (!config.dateDebut || now >= config.dateDebut) && (!config.dateFin || now <= config.dateFin)
    : false
  const estOuvert = config?.actif && dansLaPeriode

  if (!estOuvert) {
    throw createError({
      statusCode: 403,
      message: config?.messageFerme || 'Les inscriptions sont actuellement fermées.'
    })
  }

  const body = await readBody(event)

  // Validation des champs obligatoires
  if (!body.nom || !body.prenom || !body.sexe) {
    throw createError({ statusCode: 400, message: 'Nom, prénom et sexe sont obligatoires.' })
  }

  // 2. Traitement photo (optionnelle)
  let photoPath = null
  if (body.photo && body.photo.startsWith('data:image')) {
    try {
      const mediaDir = join(process.cwd(), 'public', 'media', 'demandes')
      mkdirSync(mediaDir, { recursive: true })
      const matches = body.photo.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        let ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
        if (ext === 'svg+xml') ext = 'svg'
        const buffer = Buffer.from(matches[2], 'base64')
        // Nettoyer le nom : supprimer accents, espaces, caracteres speciaux
        const safeName = `${body.nom}_${body.prenom}`
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .substring(0, 50)
        const fileName = `demande-${Date.now()}-${safeName}.${ext}`
        writeFileSync(join(mediaDir, fileName), buffer)
        // Forcer les slashes POSIX dans l'URL (important sur Windows)
        photoPath = `/media/demandes/${fileName}`
      }
    } catch (err) {
      console.error('Erreur sauvegarde photo demande:', err)
    }
  }

  // 3. Créer la demande avec tous les champs
  const demande = await prisma.demandeInscription.create({
    data: {
      nom:                   body.nom.trim(),
      prenom:                body.prenom.trim(),
      sexe:                  body.sexe?.toUpperCase() as 'HOMME' | 'FEMME',
      dateNaissance:         body.dateNaissance         ? new Date(body.dateNaissance)         : null,
      contact:               body.contact?.trim()       || null,
      email:                 body.email?.trim()         || null,
      adresse:               body.adresse?.trim()       || null,
      situationMatrimoniale: body.situationMatrimoniale || null,
      profession:            body.profession?.trim()    || null,
      photo:                 photoPath,
      // Nouveaux champs église & département
      dateEntreeAleglise:    body.dateEntreeAleglise    ? new Date(body.dateEntreeAleglise)    : null,
      dateBaptemes:          body.dateBaptemes          ? new Date(body.dateBaptemes)          : null,
      activiteAuSeinDP:      body.activiteAuSeinDP?.trim() || null,
      dateEntreeDepartement: body.dateEntreeDepartement ? new Date(body.dateEntreeDepartement) : null,
      statut:                'EN_ATTENTE'
    }
  })

  return { success: true, id: demande.id }
})