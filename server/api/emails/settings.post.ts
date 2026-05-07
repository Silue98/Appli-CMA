import prisma from '~/server/utils/prisma'
import { requireRole, ROLES } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ROLES.ADMIN_PLUS)
  const body = await readBody(event)
  let settings = await prisma.emailSettings.findFirst()

  const data: any = {}
  const fields = ['autoEvenement','reminderEnabled','welcomeEnabled','autoCulte','autoAnnonce','autoProgramme','autoPredication','rappelDime','confirmInscription','notifPriere']
  fields.forEach(f => { if (body[f] !== undefined) data[f] = body[f] })

  if (!settings) {
    settings = await prisma.emailSettings.create({ data: { ...data } })
  } else {
    settings = await prisma.emailSettings.update({ where: { id: settings.id }, data })
  }
  return settings
})
