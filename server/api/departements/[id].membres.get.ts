import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  return await prisma.membreDepartement.findMany({
    where: { departementId: id, actif: true },
    include: { membre: { select: { id: true, nom: true, prenom: true, sexe: true, photo: true, contact: true, profession: true } } }
  })
})
