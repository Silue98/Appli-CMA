import prisma from '~/server/utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.dime.upsert({
    where: { membreId_mois_annee: { membreId: Number(body.membreId), mois: Number(body.mois), annee: Number(body.annee) } },
    create: { membreId: Number(body.membreId), montant: Number(body.montant), mois: Number(body.mois), annee: Number(body.annee), paye: body.paye || false, datePaie: body.paye ? new Date() : null, notes: body.notes || null },
    update: { montant: Number(body.montant), paye: body.paye || false, datePaie: body.paye ? new Date() : null, notes: body.notes || null },
    include: { membre: { select: { id: true, nom: true, prenom: true } } }
  })
})
