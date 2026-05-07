-- DropForeignKey
ALTER TABLE `actepastoral` DROP FOREIGN KEY `ActePastoral_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `actepastoral` DROP FOREIGN KEY `ActePastoral_temoinId_fkey`;

-- DropForeignKey
ALTER TABLE `activitemembre` DROP FOREIGN KEY `ActiviteMembre_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `annonce` DROP FOREIGN KEY `Annonce_culteId_fkey`;

-- DropForeignKey
ALTER TABLE `cellule` DROP FOREIGN KEY `Cellule_responsableId_fkey`;

-- DropForeignKey
ALTER TABLE `compterendu` DROP FOREIGN KEY `CompteRendu_annonceId_fkey`;

-- DropForeignKey
ALTER TABLE `demandepriere` DROP FOREIGN KEY `DemandePriere_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `dime` DROP FOREIGN KEY `Dime_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `evenement` DROP FOREIGN KEY `Evenement_departementId_fkey`;

-- DropForeignKey
ALTER TABLE `finance` DROP FOREIGN KEY `Finance_culteId_fkey`;

-- DropForeignKey
ALTER TABLE `finance` DROP FOREIGN KEY `Finance_departementId_fkey`;

-- DropForeignKey
ALTER TABLE `finance` DROP FOREIGN KEY `Finance_evenementId_fkey`;

-- DropForeignKey
ALTER TABLE `inscription` DROP FOREIGN KEY `Inscription_evenementId_fkey`;

-- DropForeignKey
ALTER TABLE `membre` DROP FOREIGN KEY `Membre_familleId_fkey`;

-- DropForeignKey
ALTER TABLE `membrecellule` DROP FOREIGN KEY `MembreCellule_celluleId_fkey`;

-- DropForeignKey
ALTER TABLE `membrecellule` DROP FOREIGN KEY `MembreCellule_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `membredepartement` DROP FOREIGN KEY `MembreDepartement_departementId_fkey`;

-- DropForeignKey
ALTER TABLE `membredepartement` DROP FOREIGN KEY `MembreDepartement_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `nouveauconverti` DROP FOREIGN KEY `NouveauConverti_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `predication` DROP FOREIGN KEY `Predication_culteId_fkey`;

-- DropForeignKey
ALTER TABLE `predication` DROP FOREIGN KEY `Predication_predicateurId_fkey`;

-- DropForeignKey
ALTER TABLE `presence` DROP FOREIGN KEY `Presence_culteId_fkey`;

-- DropForeignKey
ALTER TABLE `presence` DROP FOREIGN KEY `Presence_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `programmeculte` DROP FOREIGN KEY `ProgrammeCulte_planificateurId_fkey`;

-- DropForeignKey
ALTER TABLE `reunioncellule` DROP FOREIGN KEY `ReunionCellule_celluleId_fkey`;

-- DropForeignKey
ALTER TABLE `roleprogramme` DROP FOREIGN KEY `RoleProgramme_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `roleprogramme` DROP FOREIGN KEY `RoleProgramme_programmeId_fkey`;

-- DropForeignKey
ALTER TABLE `servicebenevole` DROP FOREIGN KEY `ServiceBenevole_membreId_fkey`;

-- DropForeignKey
ALTER TABLE `visitepastorale` DROP FOREIGN KEY `VisitePastorale_membreId_fkey`;

-- DropIndex
DROP INDEX `ActePastoral_membreId_fkey` ON `actepastoral`;

-- DropIndex
DROP INDEX `ActePastoral_temoinId_fkey` ON `actepastoral`;

-- DropIndex
DROP INDEX `ActiviteMembre_membreId_fkey` ON `activitemembre`;

-- DropIndex
DROP INDEX `Annonce_culteId_fkey` ON `annonce`;

-- DropIndex
DROP INDEX `Cellule_responsableId_fkey` ON `cellule`;

-- DropIndex
DROP INDEX `DemandePriere_membreId_fkey` ON `demandepriere`;

-- DropIndex
DROP INDEX `Evenement_departementId_fkey` ON `evenement`;

-- DropIndex
DROP INDEX `Finance_culteId_fkey` ON `finance`;

-- DropIndex
DROP INDEX `Finance_departementId_fkey` ON `finance`;

-- DropIndex
DROP INDEX `Finance_evenementId_fkey` ON `finance`;

-- DropIndex
DROP INDEX `Inscription_evenementId_fkey` ON `inscription`;

-- DropIndex
DROP INDEX `Membre_familleId_fkey` ON `membre`;

-- DropIndex
DROP INDEX `MembreCellule_celluleId_fkey` ON `membrecellule`;

-- DropIndex
DROP INDEX `MembreDepartement_departementId_fkey` ON `membredepartement`;

-- DropIndex
DROP INDEX `Predication_culteId_fkey` ON `predication`;

-- DropIndex
DROP INDEX `Predication_predicateurId_fkey` ON `predication`;

-- DropIndex
DROP INDEX `Presence_membreId_fkey` ON `presence`;

-- DropIndex
DROP INDEX `ProgrammeCulte_planificateurId_fkey` ON `programmeculte`;

-- DropIndex
DROP INDEX `ReunionCellule_celluleId_fkey` ON `reunioncellule`;

-- DropIndex
DROP INDEX `RoleProgramme_membreId_fkey` ON `roleprogramme`;

-- DropIndex
DROP INDEX `ServiceBenevole_membreId_fkey` ON `servicebenevole`;

-- DropIndex
DROP INDEX `VisitePastorale_membreId_fkey` ON `visitepastorale`;

-- AlterTable
ALTER TABLE `actepastoral` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `demandepriere` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `evenement` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `finance` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `inventaire` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `membre` ALTER COLUMN `sexe` DROP DEFAULT,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `nouveauconverti` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `programmeculte` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `roleprogramme` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `utilisateur` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `ConfigInscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actif` BOOLEAN NOT NULL DEFAULT false,
    `dateDebut` DATETIME(3) NULL,
    `dateFin` DATETIME(3) NULL,
    `messageOuvert` TEXT NULL,
    `messageFerme` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandeInscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `sexe` ENUM('HOMME', 'FEMME') NOT NULL,
    `dateNaissance` DATETIME(3) NULL,
    `contact` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `situationMatrimoniale` VARCHAR(191) NULL,
    `profession` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `statut` ENUM('EN_ATTENTE', 'ACCEPTE', 'REFUSE') NOT NULL DEFAULT 'EN_ATTENTE',
    `notesAdmin` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MembreDepartement` ADD CONSTRAINT `MembreDepartement_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembreDepartement` ADD CONSTRAINT `MembreDepartement_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membre` ADD CONSTRAINT `Membre_familleId_fkey` FOREIGN KEY (`familleId`) REFERENCES `Famille`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgrammeCulte` ADD CONSTRAINT `ProgrammeCulte_planificateurId_fkey` FOREIGN KEY (`planificateurId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleProgramme` ADD CONSTRAINT `RoleProgramme_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `ProgrammeCulte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleProgramme` ADD CONSTRAINT `RoleProgramme_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Predication` ADD CONSTRAINT `Predication_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Predication` ADD CONSTRAINT `Predication_predicateurId_fkey` FOREIGN KEY (`predicateurId`) REFERENCES `Membre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Annonce` ADD CONSTRAINT `Annonce_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompteRendu` ADD CONSTRAINT `CompteRendu_annonceId_fkey` FOREIGN KEY (`annonceId`) REFERENCES `Annonce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evenement` ADD CONSTRAINT `Evenement_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inscription` ADD CONSTRAINT `Inscription_evenementId_fkey` FOREIGN KEY (`evenementId`) REFERENCES `Evenement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Finance` ADD CONSTRAINT `Finance_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Finance` ADD CONSTRAINT `Finance_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Finance` ADD CONSTRAINT `Finance_evenementId_fkey` FOREIGN KEY (`evenementId`) REFERENCES `Evenement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dime` ADD CONSTRAINT `Dime_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActePastoral` ADD CONSTRAINT `ActePastoral_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActePastoral` ADD CONSTRAINT `ActePastoral_temoinId_fkey` FOREIGN KEY (`temoinId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiviteMembre` ADD CONSTRAINT `ActiviteMembre_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cellule` ADD CONSTRAINT `Cellule_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembreCellule` ADD CONSTRAINT `MembreCellule_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembreCellule` ADD CONSTRAINT `MembreCellule_celluleId_fkey` FOREIGN KEY (`celluleId`) REFERENCES `Cellule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReunionCellule` ADD CONSTRAINT `ReunionCellule_celluleId_fkey` FOREIGN KEY (`celluleId`) REFERENCES `Cellule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitePastorale` ADD CONSTRAINT `VisitePastorale_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NouveauConverti` ADD CONSTRAINT `NouveauConverti_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandePriere` ADD CONSTRAINT `DemandePriere_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceBenevole` ADD CONSTRAINT `ServiceBenevole_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `roleprogramme` RENAME INDEX `RoleProgramme_prog_culte_role_key` TO `RoleProgramme_programmeId_culteType_role_key`;
