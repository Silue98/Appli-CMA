import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.programmeId) throw createError({ statusCode: 400, message: 'programmeId requis' })

  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.autoProgramme) return { success: false, message: 'Notifications programme désactivées' }

  const programme = await prisma.programmeCulte.findUnique({
    where: { id: Number(body.programmeId) },
    include: { roles: { include: { membre: true } }, planificateur: true }
  })
  if (!programme) throw createError({ statusCode: 404, message: 'Programme non trouvé' })

  const membres = await prisma.membre.findMany({
    where: { email: { not: null } },
    select: { email: true }
  })
  const emails = membres.map((m: any) => m.email!).filter(Boolean)
  if (emails.length === 0) return { success: false, message: 'Aucun membre avec email' }

  const dateFormatee = new Date(programme.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const rolesHTML = programme.roles.slice(0, 5).map(r =>
    `<p style="margin:3px 0;">• <strong>${r.role}</strong>${r.membre ? ` : ${r.membre.prenom} ${r.membre.nom}` : ''}</p>`
  ).join('')

  const content = `
    <p>Chers frères et sœurs,</p>
    <p>Le programme du culte a été publié :</p>
    <div style="background:#f5f3ff; border-left:4px solid #7c3aed; padding:15px; margin:15px 0; border-radius:5px;">
      <p style="margin:5px 0;"><strong>📅 Date :</strong> ${dateFormatee}</p>
      ${programme.theme ? `<p style="margin:5px 0;"><strong>📖 Thème :</strong> ${programme.theme}</p>` : ''}
      ${programme.typeCulte ? `<p style="margin:5px 0;"><strong>🏛️ Type :</strong> ${programme.typeCulte}</p>` : ''}
      ${rolesHTML ? `<div style="margin-top:10px;"><strong>👥 Rôles assignés :</strong>${rolesHTML}</div>` : ''}
    </div>
    <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
  `

  const html = emailTemplate(`📅 Programme du ${dateFormatee}`, content)

  try {
    await sendMail({ to: emails, subject: `📅 CMA — Programme du ${dateFormatee}`, html })
    await prisma.emailLog.create({ data: { sujet: `Programme du ${dateFormatee}`, destinataires: emails.length, type: 'AUTO_PROGRAMME', statut: 'ENVOYE' } })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({ data: { sujet: `Programme du ${dateFormatee}`, destinataires: emails.length, type: 'AUTO_PROGRAMME', statut: 'ERREUR', erreur: err.message } })
    throw createError({ statusCode: 500, message: err.message })
  }
})
