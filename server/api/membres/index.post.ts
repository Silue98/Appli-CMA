import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return await prisma.membre.create({
    data: {
      nom: body.nom,
      prenom: body.prenom,
      sexe: body.sexe?.toUpperCase(), // HOMME ou FEMME

      dateNaissance: body.dateNaissance ?? null,
      contact: body.contact ?? null,
      email: body.email ?? null,
      adresse: body.adresse ?? null,
      situationMatrimoniale: body.situationMatrimoniale ?? null,
      dateEntreeDepartement: body.dateEntreeDepartement ?? null,
      profession: body.profession ?? null,
      activiteAuSeinDP: body.activiteAuSeinDP ?? null
    }
  })
})