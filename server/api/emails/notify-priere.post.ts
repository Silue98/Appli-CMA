import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.priereId) throw createError({ statusCode: 400, message: 'priereId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.notifPriere) return { success: false, message: 'Notifications prière désactivées' }

  const priere = await prisma.demandePriere.findUnique({
    where: { id: Number(body.priereId) },
    include: { membre: true }
  })
  if (!priere) throw createError({ statusCode: 404, message: 'Demande non trouvée' })
  if (priere.confidentiel) return { success: false, message: 'Demande confidentielle, pas de notification' }

  // Notifier les pasteurs et admins
  const admins = await prisma.utilisateur.findMany({
    where: { actif: true, role: { in: ['SUPER_ADMIN', 'ADMIN', 'PASTEUR'] } },
    select: { email: true, prenom: true, nom: true }
  })

  const emails = admins.map(a => a.email).filter(Boolean)
  if (emails.length === 0) return { success: false, message: 'Aucun admin avec email' }

  const demandeur = priere.membre
    ? `${priere.membre.prenom} ${priere.membre.nom}`
    : (priere.nom || 'Anonyme')

  const content = `
    <p>Une nouvelle demande de prière a été soumise :</p>
    <div style="background:#fdf4ff; border-left:4px solid #9333ea; padding:15px; margin:15px 0; border-radius:5px;">
      <p style="margin:5px 0;"><strong>🙏 Sujet :</strong> ${priere.sujet}</p>
      <p style="margin:5px 0;"><strong>👤 Demandeur :</strong> ${demandeur}</p>
      ${priere.details ? `<p style="margin:10px 0; font-style:italic; color:#555;">${priere.details}</p>` : ''}
    </div>
    <p>Veuillez porter cette demande en prière.</p>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`🙏 Nouvelle demande de prière`, content)

  try {
    await sendMail({ to: emails, subject: `🙏 CMA — Nouvelle demande de prière : ${priere.sujet}`, html })
    await prisma.emailLog.create({ data: { sujet: `Demande prière : ${priere.sujet}`, destinataires: emails.length, type: 'NOTIF_PRIERE', statut: 'ENVOYE' } })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Demande prière : ${priere.sujet}`, destinataires: emails.length, type: 'NOTIF_PRIERE', statut: 'ERREUR', erreur: err.message } })
    throw createError({ statusCode: 500, message: err.message })
  }
})
