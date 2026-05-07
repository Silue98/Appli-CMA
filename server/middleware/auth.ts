export default defineEventHandler(async (event) => {
  const url = getRequestURL(event).pathname
  const publicRoutes = ['/api/auth/login', '/api/auth/logout']
  // Routes publiques : formulaire d'inscription (sans auth)
  const publicPrefixes = ['/api/inscription', '/api/demandes-inscription']
  if (publicRoutes.includes(url) || !url.startsWith('/api/')) return
  if (publicPrefixes.some(p => url.startsWith(p))) return
  const s = getCookie(event, 'cma_session')
  if (!s) throw createError({ statusCode: 401, message: 'Session expirée. Veuillez vous reconnecter.' })
  try { JSON.parse(s) } catch { throw createError({ statusCode: 401, message: 'Session invalide' }) }
})
