import prisma from '~/server/utils/prisma'
export default defineEventHandler(async () => {
  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const debutAnnee = new Date(now.getFullYear(), 0, 1)

  const [
    totalMembres, membresActifs, membresVisiteurs, membresCatechumenes,
    totalCultes, totalPredications, totalDepartements,
    evenementsAVenir, actesAnnee,
    offradesMois, depensesMois, offradeAnnee,
    derniersCultes, derniersMembres
  ] = await Promise.all([
    prisma.membre.count(),
    prisma.membre.count({ where: { statut: 'ACTIF' } }),
    prisma.membre.count({ where: { statut: 'VISITEUR' } }),
    prisma.membre.count({ where: { statut: 'CATECHUMENE' } }),
    prisma.culte.count(),
    prisma.predication.count(),
    prisma.departement.count({ where: { actif: true } }),
    prisma.evenement.count({ where: { dateDebut: { gte: now }, statut: { not: 'ANNULE' } } }),
    prisma.actePastoral.count({ where: { date: { gte: debutAnnee } } }),
    prisma.finance.aggregate({ where: { date: { gte: debutMois }, type: { not: 'DEPENSE' } }, _sum: { montant: true } }),
    prisma.finance.aggregate({ where: { date: { gte: debutMois }, type: 'DEPENSE' }, _sum: { montant: true } }),
    prisma.finance.aggregate({ where: { date: { gte: debutAnnee }, type: { not: 'DEPENSE' } }, _sum: { montant: true } }),
    prisma.culte.findMany({ take: 3, orderBy: { dateCulte: 'desc' }, include: { predications: { include: { predicateur: true } }, _count: { select: { presences: true } } } }),
    prisma.membre.findMany({ take: 5, orderBy: { dateInscription: 'desc' }, select: { id: true, nom: true, prenom: true, sexe: true, statut: true, dateInscription: true, photo: true } })
  ])

  return {
    totalMembres, membresActifs, membresVisiteurs, membresCatechumenes,
    totalCultes, totalPredications, totalDepartements,
    evenementsAVenir, actesAnnee,
    offradesMois: offradesMois._sum.montant || 0,
    depensesMois: depensesMois._sum.montant || 0,
    offradeAnnee: offradeAnnee._sum.montant || 0,
    derniersCultes, derniersMembres
  }
})
