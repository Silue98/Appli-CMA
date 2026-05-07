// server/api/demandes-inscription/[id].delete.ts
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    await $fetch('/api/auth/me', {
      headers: { cookie: getRequestHeader(event, 'cookie') || '' }
    })
  } catch {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const id = parseInt(getRouterParam(event, 'id') || '0')
  await prisma.demandeInscription.delete({ where: { id } })
  return { success: true }
})
