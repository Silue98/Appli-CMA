import prisma from '~/server/utils/prisma'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Traitement de la photo si présente (base64)
  let photoPath = null
  if (body.photo && body.photo.startsWith('data:image')) {
    try {
      const mediaDir = join(process.cwd(), 'public', 'media')
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
        const fileName = `${Date.now()}-${safeName}.${ext}`
        writeFileSync(join(mediaDir, fileName), buffer)
        photoPath = `/media/${fileName}`
      }
    } catch (err) {
      console.error('Erreur sauvegarde photo:', err)
    }
  }

  const membre = await prisma.membre.create({
    data: {
      nom: body.nom,
      prenom: body.prenom,
      sexe: body.sexe?.toUpperCase() as 'HOMME' | 'FEMME',
      dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
      // Le formulaire envoie dateBaptemes → BDD : dateBaptemeEau
      dateBaptemeEau: body.dateBaptemes ? new Date(body.dateBaptemes) : null,
      dateBaptemeEsprit: body.dateBaptemeEsprit ? new Date(body.dateBaptemeEsprit) : null,
      // Le formulaire envoie dateEntreeAleglise → BDD : dateEntreeEglise
      dateEntreeEglise: body.dateEntreeAleglise ? new Date(body.dateEntreeAleglise) : null,
      contact: body.contact || null,
      email: body.email || null,
      adresse: body.adresse || null,
      situationMatrimoniale: body.situationMatrimoniale || null,
      dateEntreeDepartement: body.dateEntreeDepartement ? new Date(body.dateEntreeDepartement) : null,
      profession: body.profession || null,
      activiteAuSeinDP: body.activiteAuSeinDP || null,
      photo: photoPath
    }
  })

  return membre
})