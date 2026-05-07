import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  let settings = await prisma.emailSettings.findFirst()
  if (!settings) {
    settings = await prisma.emailSettings.create({
      data: { autoEnabled: false, welcomeEnabled: true, reminderEnabled: true }
    })
  }
  return settings
})
