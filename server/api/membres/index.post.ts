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
      situationMatrimoniale: body.SituationMatriMoniale || null,

      dateEntreeDepartement: body.DateEntreAuDepartementCulte
        ? new Date(body.DateEntreAuDepartementCulte)
        : null,

      profession: body.profession || null,

      activiteAuSeinDP: body.activiteAuSeinDP || null
    }
  })

  console.log("Membre enregistré :", membre)

  return membre
})