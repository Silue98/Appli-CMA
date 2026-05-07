import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let settings = await prisma.emailSettings.findFirst()
  if (!settings) {
    settings = await prisma.emailSettings.create({
      data: {
        autoEnabled: body.autoEnabled ?? false,
        welcomeEnabled: body.welcomeEnabled ?? true,
        reminderEnabled: body.reminderEnabled ?? true
      }
    })
  } else {
    settings = await prisma.emailSettings.update({
      where: { id: settings.id },
      data: {
        ...(body.autoEnabled !== undefined && { autoEnabled: body.autoEnabled }),
        ...(body.welcomeEnabled !== undefined && { welcomeEnabled: body.welcomeEnabled }),
        ...(body.reminderEnabled !== undefined && { reminderEnabled: body.reminderEnabled }),
      }
    })
  }
  return settings
})
