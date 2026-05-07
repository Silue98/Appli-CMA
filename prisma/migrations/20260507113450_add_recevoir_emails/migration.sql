-- AlterTable
ALTER TABLE `Membre` ADD COLUMN `recevoirEmails` BOOLEAN NOT NULL DEFAULT true;
-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `recevoirEmails` BOOLEAN NOT NULL DEFAULT true;