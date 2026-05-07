import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.PASTORAL)
  const body = await readBody(event)
  if (!body.membreId || !body.date || !body.pasteur) throw createError({ statusCode: 400, message: 'Membre, date et pasteur requis' })
  return await prisma.visitePastorale.create({
    data: { membreId: Number(body.membreId), pasteur: body.pasteur, date: new Date(body.date), type: body.type || 'VISITE', motif: body.motif || null, notes: body.notes || null, suivi: body.suivi || null, confidentiel: body.confidentiel || false }
  })
})
