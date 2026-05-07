import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.evenementId) {
    throw createError({ statusCode: 400, message: 'evenementId requis' })
  }

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.autoEnabled) {
    return { success: false, message: 'Envoi automatique désactivé' }
  }

  const evenement = await prisma.evenement.findUnique({
    where: { id: Number(body.evenementId) }
  })

  if (!evenement) {
    throw createError({ statusCode: 404, message: 'Événement non trouvé' })
  }

  const membres = await prisma.membre.findMany({
    where: { statut: 'ACTIF', email: { not: null } },
    select: { email: true }
  })

  const emails = membres.map((m: any) => m.email!).filter(Boolean)

  if (emails.length === 0) {
    return { success: false, message: 'Aucun membre avec email' }
  }

  const dateFormatee = new Date(evenement.dateDebut).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Nous avons le plaisir de vous informer d'un nouvel événement :</p>
    <div style="background:#f0fdf4; border-left:4px solid #15803d; padding:15px; margin:15px 0; border-radius:5px;">
      <h3 style="margin:0 0 10px; color:#15803d;">${evenement.titre}</h3>
      ${evenement.description ? `<p style="margin:5px 0;">${evenement.description}</p>` : ''}
      <p style="margin:5px 0;"><strong>📅 Date :</strong> ${dateFormatee}</p>
      ${evenement.lieu ? `<p style="margin:5px 0;"><strong>📍 Lieu :</strong> ${evenement.lieu}</p>` : ''}
      ${evenement.responsable ? `<p style="margin:5px 0;"><strong>👤 Responsable :</strong> ${evenement.responsable}</p>` : ''}
    </div>
    <p>Nous comptons sur votre présence et participation.</p>
    <p>Que Dieu vous bénisse !</p>
  `

  const html = emailTemplate(`Nouvel événement : ${evenement.titre}`, content)

  try {
    await sendMail({ to: emails, subject: `⛪ CMA - Nouvel événement : ${evenement.titre}`, html })
    await prisma.emailLog.create({
      data: { sujet: `Nouvel événement : ${evenement.titre}`, destinataires: emails.length, type: 'AUTO_EVENEMENT', statut: 'ENVOYE' }
    })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({
      data: { sujet: `Nouvel événement : ${evenement.titre}`, destinataires: emails.length, type: 'AUTO_EVENEMENT', statut: 'ERREUR', erreur: err.message }
    })
    throw createError({ statusCode: 500, message: `Erreur envoi: ${err.message}` })
  }
})
