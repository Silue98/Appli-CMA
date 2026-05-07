import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  let settings = await prisma.emailSettings.findFirst()
  if (!settings) {
    settings = await prisma.emailSettings.create({
      data: {
        autoEvenement: false, reminderEnabled: true,
        welcomeEnabled: true, autoCulte: false,
        autoAnnonce: false, autoProgramme: false,
        autoPredication: false, rappelDime: false,
        confirmInscription: true, notifPriere: false
      }
    })
  }
  return settings
})
