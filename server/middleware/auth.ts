export default defineEventHandler(async (event) => {
  const url = getRequestURL(event).pathname
  const publicRoutes = ['/api/auth/login', '/api/auth/logout']
  if (publicRoutes.includes(url) || !url.startsWith('/api/')) return
  const s = getCookie(event, 'cma_session')
  if (!s) throw createError({ statusCode: 401, message: 'Session expirée. Veuillez vous reconnecter.' })
  try { JSON.parse(s) } catch { throw createError({ statusCode: 401, message: 'Session invalide' }) }
})
