import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.sujet || !body.message) {
    throw createError({ statusCode: 400, message: 'Sujet et message requis' })
  }

  let emails: string[] = []

  if (body.cible === 'tous') {
    const membres = await prisma.membre.findMany({
      where: { statut: 'ACTIF', email: { not: null } },
      select: { email: true }
    })
    emails = membres.map((m: any) => m.email!).filter(Boolean)
  } else if (body.cible === 'departement' && body.departementId) {
    const membres = await prisma.membreDepartement.findMany({
      where: { departementId: Number(body.departementId), actif: true },
      include: { membre: { select: { email: true } } }
    })
    emails = membres.map((m: any) => m.membre.email!).filter(Boolean)
  } else {
    throw createError({ statusCode: 400, message: 'Cible invalide' })
  }

  if (emails.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun destinataire avec email trouvé' })
  }

  const html = emailTemplate(body.sujet, `<p>${body.message.replace(/\n/g, '<br>')}</p>`)

  try {
    await sendMail({ to: emails, subject: body.sujet, html })
    await prisma.emailLog.create({
      data: { sujet: body.sujet, destinataires: emails.length, type: 'MANUEL', statut: 'ENVOYE' }
    })
    return { success: true, envoyes: emails.length }
  } catch (err: any) {
    await prisma.emailLog.create({
      data: { sujet: body.sujet, destinataires: emails.length, type: 'MANUEL', statut: 'ERREUR', erreur: err.message }
    })
    throw createError({ statusCode: 500, message: `Erreur envoi: ${err.message}` })
  }
})
