// server/api/demandes-inscription/index.get.ts
// Liste toutes les demandes d'inscription (admin)
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    await $fetch('/api/auth/me', {
      headers: { cookie: getRequestHeader(event, 'cookie') || '' }
    })
  } catch {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const q = getQuery(event)

  const where: any = {}
  if (q.statut && q.statut !== 'TOUS') {
    where.statut = q.statut
  }

  const demandes = await prisma.demandeInscription.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })

  return demandes
})
