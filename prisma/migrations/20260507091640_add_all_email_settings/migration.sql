/*
  Warnings:

  - You are about to drop the column `autoEnabled` on the `emailsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `emailsettings` DROP COLUMN `autoEnabled`,
    ADD COLUMN `autoAnnonce` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoCulte` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoEvenement` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoPredication` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoProgramme` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `confirmInscription` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notifPriere` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rappelDime` BOOLEAN NOT NULL DEFAULT false;
