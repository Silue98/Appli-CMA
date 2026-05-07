import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.ADMIN_PLUS)
  const body = await readBody(event)

  let config = await prisma.emailConfig.findFirst()

  const data: any = {
    host: body.host,
    port: Number(body.port),
    user: body.user,
    from: body.from,
  }

  // Ne mettre à jour le pass que s'il a changé
  if (body.pass && !body.pass.includes('•')) {
    data.pass = body.pass
  }

  if (!config) {
    config = await prisma.emailConfig.create({ data })
  } else {
    config = await prisma.emailConfig.update({ where: { id: config.id }, data })
  }

  return { ...config, pass: '••••••••' }
})
