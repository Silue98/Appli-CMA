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
        const fileName = `${Date.now()}-${body.nom}_${body.prenom}.${ext}`
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
      dateBaptemeEau: body.dateBaptemeEau ? new Date(body.dateBaptemeEau) : null,         // ✅ était dateBaptemes
      dateBaptemeEsprit: body.dateBaptemeEsprit ? new Date(body.dateBaptemeEsprit) : null, // ✅ nouveau champ séparé
      dateEntreeEglise: body.dateEntreeEglise ? new Date(body.dateEntreeEglise) : null,    // ✅ était dateEntreeAleglise
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