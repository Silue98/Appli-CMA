-- AlterTable
ALTER TABLE `emailsettings` ADD COLUMN `reminderEnabled` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `welcomeEnabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `autoEnabled` BOOLEAN NOT NULL DEFAULT false;
