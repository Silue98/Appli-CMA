import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })

  const body = await readBody(event)

  // Mise à jour des infos de base
  await prisma.programmeCulte.update({
    where: { id },
    data: {
      semaine: body.semaine || null,
      typeCulte: body.typeCulte || null,
      theme: body.theme || null,
      cantiqueFrancais: body.cantiqueFrancais || null,
      cantiqueBaoule: body.cantiqueBaoule || null,
      cantiqueFrancaisRef: body.cantiqueFrancaisRef || null,
      cantiqueBaouleRef: body.cantiqueBaouleRef || null,
      notes: body.notes || null,
      status: body.status || undefined,
      planificateurId: body.planificateurId ? Number(body.planificateurId) : null
    }
  })

  // Mise à jour des rôles : supprimer les anciens et recréer
  if (body.roles !== undefined) {
    await prisma.roleProgramme.deleteMany({ where: { programmeId: id } })

    if (body.roles && body.roles.length > 0) {
      await prisma.roleProgramme.createMany({
        data: body.roles.map((r: any) => ({
          programmeId: id,
          culteType: r.culteType,
          role: r.role,
          heure: r.heure || null,
          membreId: r.membreId ? Number(r.membreId) : null
        }))
      })
    }
  }

  return await prisma.programmeCulte.findUnique({
    where: { id },
    include: {
      planificateur: true,
      roles: { include: { membre: true } }
    }
  })
})
