import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.ADMIN_PLUS)
  const body = await readBody(event)

  if (!body.id) throw createError({ statusCode: 400, message: 'ID requis' })

  const user = await prisma.utilisateur.findUnique({ where: { id: Number(body.id) } })
  if (!user) throw createError({ statusCode: 404, message: 'Utilisateur non trouvé' })

  const updated = await prisma.utilisateur.update({
    where: { id: Number(body.id) },
    data: { recevoirEmails: !user.recevoirEmails },
    select: { id: true, recevoirEmails: true }
  })

  return updated
})
