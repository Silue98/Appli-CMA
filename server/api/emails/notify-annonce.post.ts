import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.annonceId) throw createError({ statusCode: 400, message: 'annonceId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.autoAnnonce) return { success: false, message: 'Notifications annonce désactivées' }

  const annonce = await prisma.annonce.findUnique({
    where: { id: Number(body.annonceId) },
    include: { culte: true }
  })
  if (!annonce) throw createError({ statusCode: 404, message: 'Annonce non trouvée' })

  const membres = await prisma.membre.findMany({
    where: { statut: 'ACTIF', email: { not: null } },
    select: { email: true }
  })
  const emails = membres.map((m: any) => m.email!).filter(Boolean)
  if (emails.length === 0) return { success: false, message: 'Aucun membre avec email' }

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Une nouvelle annonce a été publiée :</p>
    <div style="background:#fefce8; border-left:4px solid #ca8a04; padding:15px; margin:15px 0; border-radius:5px;">
      <h3 style="margin:0 0 10px; color:#ca8a04;">📢 ${annonce.titre}</h3>
      ${annonce.infosJour ? `<p style="margin:5px 0;"><strong>ℹ️ Infos du jour :</strong> ${annonce.infosJour}</p>` : ''}
      ${annonce.rappels ? `<p style="margin:5px 0;"><strong>⏰ Rappels :</strong> ${annonce.rappels}</p>` : ''}
      ${annonce.commentaires ? `<p style="margin:5px 0;">${annonce.commentaires}</p>` : ''}
    </div>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`📢 ${annonce.titre}`, content)

  try {
    await sendMail({ to: emails, subject: `📢 CMA — ${annonce.titre}`, html })
    await prisma.emailLog.create({ data: { sujet: `Annonce : ${annonce.titre}`, destinataires: emails.length, type: 'AUTO_ANNONCE', statut: 'ENVOYE' } })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Annonce : ${annonce.titre}`, destinataires: emails.length, type: 'AUTO_ANNONCE', statut: 'ERREUR', erreur: err.message } })
    throw createError({ statusCode: 500, message: err.message })
  }
})
