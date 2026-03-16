import prisma from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, message: 'ID invalide' })
  const body = await readBody(event)
  const data: any = { nom: body.nom, prenom: body.prenom, email: body.email, role: body.role, actif: body.actif }
  if (body.motDePasse && body.motDePasse.trim() !== '') {
    data.motDePasse = await bcrypt.hash(body.motDePasse, 10)
  }
  return await prisma.utilisateur.update({
    where: { id }, data,
    select: { id: true, nom: true, prenom: true, email: true, role: true, actif: true }
  })
})
