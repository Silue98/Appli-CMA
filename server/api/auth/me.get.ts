export default defineEventHandler(async (event) => {
  const s = getCookie(event, 'cma_session')
  if (!s) throw createError({ statusCode: 401, message: 'Non authentifié' })
  try { return JSON.parse(s) } catch { throw createError({ statusCode: 401, message: 'Session invalide' }) }
})
