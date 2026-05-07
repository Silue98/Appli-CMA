-- AlterTable
ALTER TABLE `EmailSettings` DROP COLUMN `autoEnabled`,
    ADD COLUMN `autoAnnonce` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoCulte` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoEvenement` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoPredication` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoProgramme` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `confirmInscription` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notifPriere` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rappelDime` BOOLEAN NOT NULL DEFAULT false;