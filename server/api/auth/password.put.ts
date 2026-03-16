import prisma from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
export default defineEventHandler(async (event) => {
  const s = getCookie(event, 'cma_session')
  if (!s) throw createError({ statusCode: 401, message: 'Non authentifié' })
  const session = JSON.parse(s)
  const body = await readBody(event)
  const user = await prisma.utilisateur.findUnique({ where: { id: session.id } })
  if (!user) throw createError({ statusCode: 404, message: 'Introuvable' })
  if (!await bcrypt.compare(body.ancienMotDePasse, user.motDePasse)) throw createError({ statusCode: 400, message: 'Ancien mot de passe incorrect' })
  await prisma.utilisateur.update({ where: { id: session.id }, data: { motDePasse: await bcrypt.hash(body.nouveauMotDePasse, 10) } })
  return { message: 'Mot de passe modifié' }
})
