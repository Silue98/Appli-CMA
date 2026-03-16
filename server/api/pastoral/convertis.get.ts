import prisma from '~/server/utils/prisma'
export default defineEventHandler(async () => {
  return await prisma.nouveauConverti.findMany({
    include: { membre: { select: { id: true, nom: true, prenom: true, contact: true, photo: true, sexe: true } } },
    orderBy: { dateConversion: 'desc' }
  })
})
