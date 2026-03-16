export default defineEventHandler(async (event) => {
  deleteCookie(event, 'cma_session', { path: '/' })
  return { message: 'Déconnecté' }
})
