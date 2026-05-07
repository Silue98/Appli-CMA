import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.predicationId) throw createError({ statusCode: 400, message: 'predicationId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.autoPredication) return { success: false, message: 'Notifications prédication désactivées' }

  const predication = await prisma.predication.findUnique({
    where: { id: Number(body.predicationId) },
    include: { predicateur: true, culte: true }
  })
  if (!predication) throw createError({ statusCode: 404, message: 'Prédication non trouvée' })

  const membres = await prisma.membre.findMany({
    where: { statut: 'ACTIF', email: { not: null } },
    select: { email: true }
  })
  const emails = membres.map((m: any) => m.email!).filter(Boolean)
  if (emails.length === 0) return { success: false, message: 'Aucun membre avec email' }

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Une nouvelle prédication a été enregistrée :</p>
    <div style="background:#fff7ed; border-left:4px solid #ea580c; padding:15px; margin:15px 0; border-radius:5px;">
      <h3 style="margin:0 0 10px; color:#ea580c;">📖 ${predication.titre}</h3>
      <p style="margin:5px 0;"><strong>📜 Texte biblique :</strong> ${predication.texteBiblique}</p>
      <p style="margin:5px 0;"><strong>🎤 Prédicateur :</strong> ${predication.predicateur.prenom} ${predication.predicateur.nom}</p>
      ${predication.resume ? `<p style="margin:10px 0; font-style:italic; color:#555;">${predication.resume}</p>` : ''}
    </div>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`📖 ${predication.titre}`, content)

  try {
    await sendMail({ to: emails, subject: `📖 CMA — ${predication.titre}`, html })
    await prisma.emailLog.create({ data: { sujet: `Prédication : ${predication.titre}`, destinataires: emails.length, type: 'AUTO_PREDICATION', statut: 'ENVOYE' } })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Prédication : ${predication.titre}`, destinataires: emails.length, type: 'AUTO_PREDICATION', statut: 'ERREUR', erreur: err.message } })
    throw createError({ statusCode: 500, message: err.message })
  }
})
