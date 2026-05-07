import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.membreId) throw createError({ statusCode: 400, message: 'membreId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.welcomeEnabled) return { success: false, message: 'Email de bienvenue désactivé' }

  const membre = await prisma.membre.findUnique({ where: { id: Number(body.membreId) } })
  if (!membre || !membre.email) return { success: false, message: 'Membre sans email' }

  const content = `
    <p>Cher(e) <strong>${membre.prenom} ${membre.nom}</strong>,</p>
    <p>Nous avons le grand plaisir de vous accueillir au sein de notre famille spirituelle !</p>
    <div style="background:#f0fdf4; border-left:4px solid #15803d; padding:15px; margin:15px 0; border-radius:5px;">
      <p style="margin:5px 0;">✅ Votre profil a été enregistré avec succès</p>
      ${membre.numeroMembre ? `<p style="margin:5px 0;">📋 Numéro de membre : <strong>${membre.numeroMembre}</strong></p>` : ''}
    </div>
    <p>Nous sommes heureux de vous compter parmi nous. Ensemble, nous grandissons dans la foi et l'amour de Dieu.</p>
    <p style="color:#15803d; font-weight:bold;">Bienvenue dans la famille CMA DOKUI1 ! 🙏</p>
  `

  const html = emailTemplate(`Bienvenue ${membre.prenom} !`, content)

  try {
    await sendMail({ to: membre.email, subject: `⛪ Bienvenue chez CMA DOKUI1, ${membre.prenom} !`, html })
    await prisma.emailLog.create({ data: { sujet: `Bienvenue : ${membre.prenom} ${membre.nom}`, destinataires: 1, type: 'BIENVENUE', statut: 'ENVOYE' } })
    return { success: true }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Bienvenue : ${membre.prenom} ${membre.nom}`, destinataires: 1, type: 'BIENVENUE', statut: 'ERREUR', erreur: err.message } })
    return { success: false, message: err.message }
  }
})
