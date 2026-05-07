import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.date) throw createError({ statusCode: 400, message: 'La date est requise' })

  const programme = await prisma.programmeCulte.create({
    data: {
      date: new Date(body.date),
      semaine: body.semaine || null,
      typeCulte: body.typeCulte || null,
      theme: body.theme || null,
      cantiqueFrancais: body.cantiqueFrancais || null,
      cantiqueBaoule: body.cantiqueBaoule || null,
      cantiqueFrancaisRef: body.cantiqueFrancaisRef || null,
      cantiqueBaouleRef: body.cantiqueBaouleRef || null,
      notes: body.notes || null,
      status: body.status || 'PLANIFIE',
      planificateurId: body.planificateurId ? Number(body.planificateurId) : null,
      roles: body.roles ? {
        create: body.roles.map((r: any) => ({
          culteType: r.culteType,
          role: r.role,
          heure: r.heure || null,
          membreId: r.membreId ? Number(r.membreId) : null
        }))
      } : undefined
    },
    include: {
      planificateur: true,
      roles: { include: { membre: true } }
    }
  })

  try {
    await $fetch('/api/emails/notify-programme', { method: 'POST', body: { programmeId: programme.id } })
  } catch (e) { console.error('Email programme:', e) }

  return programme
})
