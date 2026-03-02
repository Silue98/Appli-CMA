/*
  Warnings:

  - You are about to drop the column `ActiviteAuSeinDP` on the `membre` table. All the data in the column will be lost.
  - You are about to drop the column `DateEntreAuDepartementCulte` on the `membre` table. All the data in the column will be lost.
  - You are about to drop the column `Profession` on the `membre` table. All the data in the column will be lost.
  - You are about to drop the column `SituationMatriMoniale` on the `membre` table. All the data in the column will be lost.
  - You are about to alter the column `sexe` on the `membre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `dateNaissance` on the `membre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - A unique constraint covering the columns `[email]` on the table `Membre` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ActiviteMembre_membreId_fkey` ON `activitemembre`;

-- DropIndex
DROP INDEX `Annonce_culteId_fkey` ON `annonce`;

-- DropIndex
DROP INDEX `Predication_culteId_fkey` ON `predication`;

-- DropIndex
DROP INDEX `Predication_predicateurId_fkey` ON `predication`;

-- AlterTable
ALTER TABLE `membre` DROP COLUMN `ActiviteAuSeinDP`,
    DROP COLUMN `DateEntreAuDepartementCulte`,
    DROP COLUMN `Profession`,
    DROP COLUMN `SituationMatriMoniale`,
    ADD COLUMN `activiteAuSeinDP` VARCHAR(191) NULL,
    ADD COLUMN `dateEntreeDepartement` DATETIME(3) NULL,
    ADD COLUMN `profession` VARCHAR(191) NULL,
    ADD COLUMN `situationMatrimoniale` VARCHAR(191) NULL,
    MODIFY `sexe` ENUM('HOMME', 'FEMME') NOT NULL,
    MODIFY `dateNaissance` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `ProgrammeCulte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `semaine` VARCHAR(191) NULL,
    `typeCulte` VARCHAR(191) NULL,
    `theme` VARCHAR(191) NULL,
    `cantiqueFrancais` VARCHAR(191) NULL,
    `cantiqueBaoule` VARCHAR(191) NULL,
    `cantiqueFrancaisRef` VARCHAR(191) NULL,
    `cantiqueBaouleRef` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `status` ENUM('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE') NOT NULL DEFAULT 'PLANIFIE',
    `planificateurId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProgrammeCulte_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleProgramme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programmeId` INTEGER NOT NULL,
    `culteType` ENUM('PREMIER', 'DEUXIEME', 'TROISIEME') NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `heure` VARCHAR(191) NULL,
    `membreId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RoleProgramme_programmeId_culteType_role_key`(`programmeId`, `culteType`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Membre_email_key` ON `Membre`(`email`);

-- AddForeignKey
ALTER TABLE `ProgrammeCulte` ADD CONSTRAINT `ProgrammeCulte_planificateurId_fkey` FOREIGN KEY (`planificateurId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleProgramme` ADD CONSTRAINT `RoleProgramme_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `ProgrammeCulte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleProgramme` ADD CONSTRAINT `RoleProgramme_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiviteMembre` ADD CONSTRAINT `ActiviteMembre_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Predication` ADD CONSTRAINT `Predication_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Predication` ADD CONSTRAINT `Predication_predicateurId_fkey` FOREIGN KEY (`predicateurId`) REFERENCES `Membre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Annonce` ADD CONSTRAINT `Annonce_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompteRendu` ADD CONSTRAINT `CompteRendu_annonceId_fkey` FOREIGN KEY (`annonceId`) REFERENCES `Annonce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
