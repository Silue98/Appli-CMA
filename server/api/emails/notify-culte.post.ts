import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.culteId) throw createError({ statusCode: 400, message: 'culteId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.autoCulte) return { success: false, message: 'Notifications culte désactivées' }

  const culte = await prisma.culte.findUnique({ where: { id: Number(body.culteId) } })
  if (!culte) throw createError({ statusCode: 404, message: 'Culte non trouvé' })

  const membres = await prisma.membre.findMany({
    where: { email: { not: null } },
    select: { email: true }
  })
  const emails = membres.map((m: any) => m.email!).filter(Boolean)
  if (emails.length === 0) return { success: false, message: 'Aucun membre avec email' }

  const dateFormatee = new Date(culte.dateCulte).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Nous vous invitons au culte suivant :</p>
    <div style="background:#eff6ff; border-left:4px solid #2563eb; padding:15px; margin:15px 0; border-radius:5px;">
      <p style="margin:5px 0;"><strong>📅 Date :</strong> ${dateFormatee}</p>
      <p style="margin:5px 0;"><strong>🕐 Horaire :</strong> ${culte.horaire}</p>
      ${culte.themePrincipal ? `<p style="margin:5px 0;"><strong>📖 Thème :</strong> ${culte.themePrincipal}</p>` : ''}
    </div>
    <p>Nous comptons sur votre présence et votre participation active.</p>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`⛪ Culte du ${dateFormatee}`, content)

  try {
    await sendMail({ to: emails, subject: `⛪ CMA — Culte du ${dateFormatee}`, html })
    await prisma.emailLog.create({ data: { sujet: `Culte du ${dateFormatee}`, destinataires: emails.length, type: 'AUTO_CULTE', statut: 'ENVOYE' } })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Culte du ${dateFormatee}`, destinataires: emails.length, type: 'AUTO_CULTE', statut: 'ERREUR', erreur: err.message } })
    throw createError({ statusCode: 500, message: err.message })
  }
})
