/*
  Warnings:

  - You are about to drop the column `dateBapteme` on the `demandeinscription` table. All the data in the column will be lost.
  - You are about to drop the column `departementSouhaite` on the `demandeinscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `demandeinscription` DROP COLUMN `dateBapteme`,
    DROP COLUMN `departementSouhaite`,
    ADD COLUMN `activiteAuSeinDP` VARCHAR(191) NULL,
    ADD COLUMN `dateBaptemes` DATETIME(3) NULL,
    ADD COLUMN `dateEntreeAleglise` DATETIME(3) NULL,
    ADD COLUMN `dateEntreeDepartement` DATETIME(3) NULL;
