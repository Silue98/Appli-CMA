import prisma from '~/server/utils/prisma'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const body = await readBody(event)

  // Traitement de la photo si nouvelle (base64)
  let photoPath = body.photo
  if (body.photo && body.photo.startsWith('data:image')) {
    try {
      const mediaDir = join(process.cwd(), 'public', 'media')
      mkdirSync(mediaDir, { recursive: true })
      const matches = body.photo.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        let ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
        const buffer = Buffer.from(matches[2], 'base64')
        const fileName = `${Date.now()}-${body.nom}_${body.prenom}.${ext}`
        writeFileSync(join(mediaDir, fileName), buffer)
        photoPath = `/media/${fileName}`
      }
    } catch (err) {
      console.error('Erreur sauvegarde photo:', err)
      photoPath = undefined
    }
  }

  const data: Record<string, any> = {}
  if (body.nom !== undefined) data.nom = body.nom
  if (body.prenom !== undefined) data.prenom = body.prenom
  if (body.sexe !== undefined) data.sexe = body.sexe?.toUpperCase()
  if (body.contact !== undefined) data.contact = body.contact || null
  if (body.email !== undefined) data.email = body.email || null
  if (body.adresse !== undefined) data.adresse = body.adresse || null
  if (body.profession !== undefined) data.profession = body.profession || null
  if (body.activiteAuSeinDP !== undefined) data.activiteAuSeinDP = body.activiteAuSeinDP || null
  if (body.situationMatrimoniale !== undefined) data.situationMatrimoniale = body.situationMatrimoniale || null
  if (body.dateNaissance !== undefined) data.dateNaissance = body.dateNaissance ? new Date(body.dateNaissance) : null
  if (body.dateBaptemes !== undefined) data.dateBaptemes = body.dateBaptemes ? new Date(body.dateBaptemes) : null
  if (body.dateEntreeAleglise !== undefined) data.dateEntreeAleglise = body.dateEntreeAleglise ? new Date(body.dateEntreeAleglise) : null
  if (body.dateEntreeDepartement !== undefined) data.dateEntreeDepartement = body.dateEntreeDepartement ? new Date(body.dateEntreeDepartement) : null
  if (photoPath !== undefined && !photoPath?.startsWith('data:')) data.photo = photoPath

  return await prisma.membre.update({ where: { id }, data })
})
