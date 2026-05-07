import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.evenementId) {
    throw createError({ statusCode: 400, message: 'evenementId requis' })
  }

  const evenement = await prisma.evenement.findUnique({
    where: { id: Number(body.evenementId) },
    include: { departement: true }
  })

  if (!evenement) {
    throw createError({ statusCode: 404, message: 'Événement non trouvé' })
  }

  // Récupérer tous les membres actifs avec email
  const membres = await prisma.membre.findMany({
    where: { statut: 'ACTIF', email: { not: null } },
    select: { email: true }
  })

  const emails = membres.map((m: any) => m.email!).filter(Boolean)

  if (emails.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun membre avec email trouvé' })
  }

  const dateFormatee = new Date(evenement.dateDebut).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Nous avons le plaisir de vous inviter à l'événement suivant :</p>
    <div style="background:#f0fdf4; border-left:4px solid #15803d; padding:15px; margin:15px 0; border-radius:5px;">
      <h3 style="margin:0 0 10px; color:#15803d;">${evenement.titre}</h3>
      ${evenement.description ? `<p style="margin:5px 0; color:#555;">${evenement.description}</p>` : ''}
      <p style="margin:8px 0;"><strong>📅 Date :</strong> ${dateFormatee}</p>
      ${evenement.lieu ? `<p style="margin:5px 0;"><strong>📍 Lieu :</strong> ${evenement.lieu}</p>` : ''}
      ${evenement.responsable ? `<p style="margin:5px 0;"><strong>👤 Responsable :</strong> ${evenement.responsable}</p>` : ''}
      ${evenement.departement ? `<p style="margin:5px 0;"><strong>🏛️ Département :</strong> ${evenement.departement.nom}</p>` : ''}
    </div>
    <p>Nous comptons sur votre présence et votre participation.</p>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`📢 ${evenement.titre}`, content)

  try {
    await sendMail({
      to: emails,
      subject: `⛪ CMA DOKUI1 — ${evenement.titre}`,
      html
    })

    await prisma.emailLog.create({
      data: {
        sujet: `Notification événement : ${evenement.titre}`,
        destinataires: emails.length,
        type: 'NOTIF_EVENEMENT',
        statut: 'ENVOYE'
      }
    })

    return { success: true, envoyes: emails.length }

  } catch (err: any) {
    await prisma.emailLog.create({
      data: {
        sujet: `Notification événement : ${evenement.titre}`,
        destinataires: emails.length,
        type: 'NOTIF_EVENEMENT',
        statut: 'ERREUR',
        erreur: err.message
      }
    })
    throw createError({ statusCode: 500, message: `Erreur envoi: ${err.message}` })
  }
})
