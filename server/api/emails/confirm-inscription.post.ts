import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.demandeId) throw createError({ statusCode: 400, message: 'demandeId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.confirmInscription) return { success: false, message: 'Confirmation inscription désactivée' }

  const demande = await prisma.demandeInscription.findUnique({
    where: { id: Number(body.demandeId) }
  })
  if (!demande || !demande.email) return { success: false, message: 'Demande sans email' }

  const content = `
    <p>Cher(e) <strong>${demande.prenom} ${demande.nom}</strong>,</p>
    <p>Nous avons bien reçu votre demande d'inscription à l'église CMA DOKUI1.</p>
    <div style="background:#f0fdf4; border-left:4px solid #15803d; padding:15px; margin:15px 0; border-radius:5px;">
      <p style="margin:5px 0;">✅ Votre demande est en cours de traitement</p>
      <p style="margin:5px 0;">📋 Statut : <strong>En attente de validation</strong></p>
      <p style="margin:5px 0; color:#666;">Vous serez contacté(e) par notre équipe dans les meilleurs délais.</p>
    </div>
    <p>Merci de l'intérêt que vous portez à notre communauté. Nous nous réjouissons de vous accueillir bientôt parmi nous !</p>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`✅ Demande d'inscription reçue`, content)

  try {
    await sendMail({ to: demande.email, subject: `✅ CMA — Confirmation de votre demande d'inscription`, html })
    await prisma.emailLog.create({ data: { sujet: `Confirmation inscription : ${demande.prenom} ${demande.nom}`, destinataires: 1, type: 'CONFIRM_INSCRIPTION', statut: 'ENVOYE' } })
    return { success: true }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Confirmation inscription : ${demande.prenom} ${demande.nom}`, destinataires: 1, type: 'CONFIRM_INSCRIPTION', statut: 'ERREUR', erreur: err.message } })
    return { success: false, message: err.message }
  }
})
