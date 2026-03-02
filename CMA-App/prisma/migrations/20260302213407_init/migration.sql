-- DropIndex
DROP INDEX `ActiviteMembre_membreId_fkey` ON `activitemembre`;

-- DropIndex
DROP INDEX `Annonce_culteId_fkey` ON `annonce`;

-- DropIndex
DROP INDEX `Predication_culteId_fkey` ON `predication`;

-- DropIndex
DROP INDEX `Predication_predicateurId_fkey` ON `predication`;

-- DropIndex
DROP INDEX `ProgrammeCulte_planificateurId_fkey` ON `programmeculte`;

-- DropIndex
DROP INDEX `RoleProgramme_membreId_fkey` ON `roleprogramme`;

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
