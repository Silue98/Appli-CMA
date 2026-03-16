import prisma from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.email || !body.motDePasse) throw createError({ statusCode: 400, message: 'Email et mot de passe requis' })
  const user = await prisma.utilisateur.findUnique({ where: { email: body.email } })
  if (!user || !user.actif) throw createError({ statusCode: 401, message: 'Email ou mot de passe incorrect' })
  const valid = await bcrypt.compare(body.motDePasse, user.motDePasse)
  if (!valid) throw createError({ statusCode: 401, message: 'Email ou mot de passe incorrect' })
  setCookie(event, 'cma_session', JSON.stringify({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }), { httpOnly: true, maxAge: 28800, sameSite: 'lax', path: '/' })
  return { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
})
