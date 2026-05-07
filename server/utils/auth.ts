import type { H3Event } from 'h3'

export interface SessionUser {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

export function getSession(event: H3Event): SessionUser | null {
  const s = getCookie(event, 'cma_session')
  if (!s) return null
  try { return JSON.parse(s) } catch { return null }
}

export function requireAuth(event: H3Event): SessionUser {
  const user = getSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })
  return user
}

export function requireRole(event: H3Event, roles: string[]): SessionUser {
  const user = requireAuth(event)
  if (!roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}` })
  }
  return user
}

// Raccourcis par rôle
export const ROLES = {
  ALL: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR', 'SECRETAIRE', 'TRESORIER', 'LECTEUR'],
  ADMIN_PLUS: ['SUPER_ADMIN', 'ADMIN'],
  GESTIONNAIRE: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR', 'SECRETAIRE'],
  FINANCES: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR', 'TRESORIER'],
  PASTORAL: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR'],
  LECTURE: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR', 'SECRETAIRE', 'LECTEUR'],
}
