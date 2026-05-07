// middleware/auth.global.ts
// Protège toutes les routes sauf /login et /inscription
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return
  if (to.path === '/inscription') return   // ← page publique, pas de vérification auth
  try { await $fetch('/api/auth/me') }
  catch { return navigateTo('/login') }
})
