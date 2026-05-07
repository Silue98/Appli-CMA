import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.GESTIONNAIRE)
  const body = await readBody(event)

  if (!body.id) throw createError({ statusCode: 400, message: 'ID requis' })

  const membre = await prisma.membre.findUnique({ where: { id: Number(body.id) } })
  if (!membre) throw createError({ statusCode: 404, message: 'Membre non trouvé' })

  const updated = await prisma.membre.update({
    where: { id: Number(body.id) },
    data: { recevoirEmails: !membre.recevoirEmails },
    select: { id: true, recevoirEmails: true }
  })

  return updated
})
