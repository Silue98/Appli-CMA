import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'
import bcrypt from 'bcryptjs'
export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.ADMIN_PLUS)
  const body = await readBody(event)
  if (!body.email || !body.motDePasse || !body.nom || !body.prenom)
    throw createError({ statusCode: 400, message: 'Tous les champs sont requis' })
  const existe = await prisma.utilisateur.findUnique({ where: { email: body.email } })
  if (existe) throw createError({ statusCode: 409, message: 'Cet email est déjà utilisé' })
  const hash = await bcrypt.hash(body.motDePasse, 10)
  return await prisma.utilisateur.create({
    data: { nom: body.nom, prenom: body.prenom, email: body.email, motDePasse: hash, role: body.role || 'SECRETAIRE', actif: true },
    select: { id: true, nom: true, prenom: true, email: true, role: true, actif: true, createdAt: true }
  })
})
