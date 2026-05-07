-- AlterTable
ALTER TABLE `membre` ADD COLUMN `recevoirEmails` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `utilisateur` ADD COLUMN `recevoirEmails` BOOLEAN NOT NULL DEFAULT true;
