import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.culteId) throw createError({ statusCode: 400, message: 'Le culte est requis' })

  // Upsert massif : remplace toute la feuille de présence pour ce culte
  if (Array.isArray(body.presences)) {
    await prisma.presence.deleteMany({ where: { culteId: Number(body.culteId) } })

    if (body.presences.length > 0) {
      await prisma.presence.createMany({
        data: body.presences.map((p: any) => ({
          culteId: Number(body.culteId),
          membreId: Number(p.membreId),
          statut: p.statut || 'PRESENT',
          motif: p.motif || null
        }))
      })
    }

    return await prisma.presence.findMany({
      where: { culteId: Number(body.culteId) },
      include: { membre: { select: { id: true, nom: true, prenom: true, photo: true } } }
    })
  }

  // Upsert d'une seule présence
  return await prisma.presence.upsert({
    where: { culteId_membreId: { culteId: Number(body.culteId), membreId: Number(body.membreId) } },
    create: {
      culteId: Number(body.culteId),
      membreId: Number(body.membreId),
      statut: body.statut || 'PRESENT',
      motif: body.motif || null
    },
    update: {
      statut: body.statut || 'PRESENT',
      motif: body.motif || null
    },
    include: { membre: { select: { id: true, nom: true, prenom: true } } }
  })
})
