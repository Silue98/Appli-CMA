// import prisma from '~/server/utils/prisma'

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event)

//   // 🔎 Voir les données reçues
//   console.log("Données reçues du formulaire :", body)

//   const membre = await prisma.membre.create({
//     data: {
//       nom: body.nom,
//       prenom: body.prenom,
//       sexe: body.sexe?.toUpperCase(),

//       dateNaissance: body.dateNaissance
//         ? new Date(body.dateNaissance)
//         : null,

//       contact: body.contact || null,
//       email: body.email || null,
//       adresse: body.adresse || null,
//       situationMatrimoniale: body.situationMatrimoniale || null,

//       dateEntreeDepartement: body.dateEntreeDepartement
//         ? new Date(body.dateEntreeDepartement)
//         : null,

//       profession: body.profession || null,
//       activiteAuSeinDP: body.activiteAuSeinDP || null
//     }
//   })

//   // 🔎 Voir ce qui est enregistré en base
//   console.log("Membre enregistré :", membre)

//   return membre
// })

/*
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log("Données reçues :", body)

  const membre = await prisma.membre.create({
    data: {
      nom: body.nom,
      prenom: body.prenom,
      sexe: body.sexe?.toUpperCase(),

      dateNaissance: body.dateNaissance
        ? new Date(body.dateNaissance)
        : null,

      contact: body.contact || null,
      email: body.email || null,
      adresse: body.adresse || null,

      // ✅ correction
      situationMatrimoniale: body.situationMatrimoniale || null,

      dateEntreeDepartement: body.dateEntreeDepartement
        ? new Date(body.dateEntreeDepartement)
        : null,

      profession: body.profession || null,

      activiteAuSeinDP: body.activiteAuSeinDP || null
    }
  })

  console.log("Membre enregistré :", membre)

  return membre
})
*/
import prisma from '~/server/utils/prisma'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log("Données reçues :", body)

  // Traiter la photo si elle existe
  let photoPath = null
  if (body.photo) {
    try {
      // Créer le dossier media s'il n'existe pas
      const mediaDir = join(process.cwd(), 'public', 'media')
      mkdirSync(mediaDir, { recursive: true })
      
      // Extraire les données Base64
      // Format attendu: data:image/jpeg;base64,/9j/4AAQSkZJRg...
      const matches = body.photo.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
      
      if (matches && matches.length === 3) {
        const imageType = matches[1] // jpeg, png, gif, etc.
        const imageData = matches[2] // Les données base64
        const buffer = Buffer.from(imageData, 'base64')
        
        // Déterminer l'extension du fichier
        let extension = imageType
        if (imageType === 'jpeg') extension = 'jpg'
        if (imageType === 'svg+xml') extension = 'svg'
        
        // Générer un nom unique pour la photo
        const fileName = `${Date.now()}-${body.nom}_${body.prenom}.${extension}`
        const filePath = join(mediaDir, fileName)
        
        // Sauvegarder la photo
        writeFileSync(filePath, buffer)
        
        // Chemin relatif pour la base de données
        photoPath = `/media/${fileName}`
        console.log('Photo sauvegardée avec succès:', photoPath)
      } else {
        console.log('Format de photo invalide ou pas de photo')
      }
    } catch (photoError) {
      console.error('Erreur lors de la sauvegarde de la photo:', photoError)
    }
  }

  const membre = await prisma.membre.create({
    data: {
      nom: body.nom,
      prenom: body.prenom,
      sexe: body.sexe?.toUpperCase(),

      dateNaissance: body.dateNaissance
        ? new Date(body.dateNaissance)
        : null,
      dateBaptemes: body.dateBaptemes
        ? new Date(body.dateBaptemes)
        : null,
      dateEntreeAleglise: body.dateEntreeAleglise
        ? new Date(body.dateEntreeAleglise)
        : null,
      contact: body.contact || null,
      email: body.email || null,
      adresse: body.adresse || null,

      // ✅ correction
      situationMatrimoniale: body.situationMatrimoniale || null,

      dateEntreeDepartement: body.dateEntreeDepartement
        ? new Date(body.dateEntreeDepartement)
        : null,

      profession: body.profession || null,

      activiteAuSeinDP: body.activiteAuSeinDP || null,
      
      // ✅ Ajout du champ photo
      photo: photoPath
    }
  })

  console.log("Membre enregistré avec photo:", photoPath)
  console.log("Membre complet:", membre)

  return membre
})