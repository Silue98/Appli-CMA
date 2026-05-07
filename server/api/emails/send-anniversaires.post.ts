import prisma from '~/server/utils/prisma'
import { sendMail, emailTemplate } from '~/server/utils/mailer'

export default defineEventHandler(async () => {
  const today = new Date()
  const jour = today.getDate()
  const mois = today.getMonth() + 1

  // Membres dont c'est l'anniversaire aujourd'hui
  const membres = await prisma.membre.findMany({
    where: {
      statut: 'ACTIF',
      email: { not: null },
      dateNaissance: { not: null }
    },
    select: { id: true, email: true, prenom: true, nom: true, dateNaissance: true }
  })

  const anniversaires = membres.filter(m => {
    if (!m.dateNaissance) return false
    const d = new Date(m.dateNaissance)
    return d.getDate() === jour && d.getMonth() + 1 === mois
  })

  if (anniversaires.length === 0) {
    return { success: true, message: 'Aucun anniversaire aujourd\'hui', envoyes: 0 }
  }

  let envoyes = 0

  for (const membre of anniversaires) {
    if (!membre.email) continue
    const age = new Date().getFullYear() - new Date(membre.dateNaissance!).getFullYear()

    const content = `
      <p>Cher(e) <strong>${membre.prenom} ${membre.nom}</strong>,</p>
      <p>Toute la famille de CMA DOKUI1 vous souhaite un très joyeux anniversaire ! 🎂</p>
      <div style="background:#fef9c3; border-left:4px solid #eab308; padding:20px; margin:15px 0; border-radius:5px; text-align:center;">
        <p style="font-size:40px; margin:0;">🎉🎂🎊</p>
        <h3 style="color:#92400e; margin:10px 0;">Joyeux ${age}ème anniversaire !</h3>
        <p style="color:#666;">Que cette nouvelle année de vie soit remplie de bénédictions, de santé et de la grâce de Dieu.</p>
      </div>
      <p>Nous prions pour vous et vous souhaitons une excellente journée entourée de vos proches.</p>
      <p style="color:#15803d; font-weight:bold;">Que Dieu vous bénisse et vous comble de ses bienfaits ! 🙏</p>
    `

    const html = emailTemplate(`🎂 Joyeux Anniversaire ${membre.prenom} !`, content)

    try {
      await sendMail({ to: membre.email, subject: `🎂 CMA vous souhaite un Joyeux Anniversaire, ${membre.prenom} !`, html })
      envoyes++
    } catch (e) {
      console.error(`Erreur anniversaire ${membre.email}:`, e)
    }
  }

  await prisma.emailLog.create({
    data: { sujet: `Anniversaires du ${jour}/${mois}`, destinataires: envoyes, type: 'ANNIVERSAIRE', statut: 'ENVOYE' }
  })

  return { success: true, envoyes, total: anniversaires.length }
})
