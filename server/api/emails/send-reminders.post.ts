import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  // Vérifier si rappels activés
  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.reminderEnabled) {
    return { success: false, message: 'Rappels désactivés' }
  }

  // Trouver événements de demain
  const demain = new Date()
  demain.setDate(demain.getDate() + 1)
  demain.setHours(0, 0, 0, 0)
  const apres = new Date(demain)
  apres.setHours(23, 59, 59, 999)

  const evenements = await prisma.evenement.findMany({
    where: {
      dateDebut: { gte: demain, lte: apres },
      statut: { in: ['PLANIFIE', 'EN_COURS'] }
    }
  })

  if (evenements.length === 0) {
    return { success: true, message: 'Aucun événement demain', envoyes: 0 }
  }

  const membres = await prisma.membre.findMany({
    where: { email: { not: null } },
    select: { email: true }
  })

  const emails = membres.map((m: any) => m.email!).filter(Boolean)

  if (emails.length === 0) {
    return { success: false, message: 'Aucun membre avec email' }
  }

  let totalEnvoyes = 0

  for (const evenement of evenements) {
    const dateFormatee = new Date(evenement.dateDebut).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    const content = `
      <p>Chers frères et sœurs,</p>
      <p>Ceci est un rappel pour l'événement de <strong>demain</strong> :</p>
      <div style="background:#fffbeb; border-left:4px solid #d97706; padding:15px; margin:15px 0; border-radius:5px;">
        <h3 style="margin:0 0 10px; color:#d97706;">⏰ ${evenement.titre}</h3>
        ${evenement.description ? `<p style="margin:5px 0;">${evenement.description}</p>` : ''}
        <p style="margin:8px 0;"><strong>📅 Date :</strong> ${dateFormatee}</p>
        ${evenement.lieu ? `<p style="margin:5px 0;"><strong>📍 Lieu :</strong> ${evenement.lieu}</p>` : ''}
        ${evenement.responsable ? `<p style="margin:5px 0;"><strong>👤 Responsable :</strong> ${evenement.responsable}</p>` : ''}
      </div>
      <p>N'oubliez pas d'y participer !</p>
      <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
    `

    const html = emailTemplate(`⏰ Rappel J-1 : ${evenement.titre}`, content)

    try {
      await sendMail({ to: emails, subject: `⏰ Rappel demain — ${evenement.titre}`, html })
      await prisma.emailLog.create({
        data: {
          sujet: `Rappel J-1 : ${evenement.titre}`,
          destinataires: emails.length,
          type: 'RAPPEL_J1',
          statut: 'ENVOYE'
        }
      })
      totalEnvoyes += emails.length
    } catch (err: any) {
      await prisma.emailLog.create({
        data: {
          sujet: `Rappel J-1 : ${evenement.titre}`,
          destinataires: emails.length,
          type: 'RAPPEL_J1',
          statut: 'ERREUR',
          erreur: err.message
        }
      })
    }
  }

  return { success: true, evenements: evenements.length, envoyes: totalEnvoyes }
})
