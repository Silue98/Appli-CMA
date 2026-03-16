import prisma from '~/server/utils/prisma'
export default defineEventHandler(async () => {
  return await prisma.utilisateur.findMany({
    select: { id: true, nom: true, prenom: true, email: true, role: true, actif: true, createdAt: true }
  })
})
