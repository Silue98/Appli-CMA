import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const settings = await prisma.emailSettings.findFirst()
  if (!settings?.rappelDime) return { success: false, message: 'Rappel dîme désactivé' }

  const maintenant = new Date()
  const mois = maintenant.getMonth() + 1
  const annee = maintenant.getFullYear()

  const moisNom = maintenant.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  // Membres actifs avec email qui n'ont pas encore payé ce mois
  const membresSansDime = await prisma.membre.findMany({
    where: {
      email: { not: null },
      dimes: {
        none: { mois, annee, paye: true }
      }
    },
    select: { id: true, email: true, prenom: true, nom: true }
  })

  if (membresSansDime.length === 0) {
    return { success: true, message: 'Tous les membres ont payé leur dîme ce mois', envoyes: 0 }
  }

  let envoyes = 0

  for (const membre of membresSansDime) {
    if (!membre.email) continue

    const content = `
      <p>Cher(e) <strong>${membre.prenom} ${membre.nom}</strong>,</p>
      <p>Ceci est un rappel amical concernant votre dîme du mois de <strong>${moisNom}</strong>.</p>
      <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:15px; margin:15px 0; border-radius:5px;">
        <p style="margin:5px 0;">💎 Votre dîme de <strong>${moisNom}</strong> n'a pas encore été enregistrée.</p>
        <p style="margin:5px 0; color:#666;">La dîme est un acte de foi et de reconnaissance envers Dieu.</p>
      </div>
      <p>Vous pouvez vous rapprocher du trésorier ou passer lors du prochain culte.</p>
      <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse ! 🙏</p>
    `

    const html = emailTemplate(`💎 Rappel dîme — ${moisNom}`, content)

    try {
      await sendMail({ to: membre.email, subject: `💎 CMA — Rappel dîme ${moisNom}`, html })
      envoyes++
    } catch (e) {
      console.error(`Erreur email dîme ${membre.email}:`, e)
    }
  }

  await prisma.emailLog.create({
    data: { sujet: `Rappel dîme ${moisNom}`, destinataires: envoyes, type: 'RAPPEL_DIME', statut: 'ENVOYE' }
  })

  return { success: true, envoyes, total: membresSansDime.length }
})
