import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.ADMIN_PLUS)
  let config = await prisma.emailConfig.findFirst()
  if (!config) {
    config = await prisma.emailConfig.create({
      data: { host: 'smtp.gmail.com', port: 587, user: '', pass: '', from: '' }
    })
  }
  // Ne jamais retourner le mot de passe en clair
  return { ...config, pass: config.pass ? '••••••••' : '' }
})
