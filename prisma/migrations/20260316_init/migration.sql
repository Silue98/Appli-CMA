-- ============================================================
-- CMA DOKUI1 — Système Complet de Gestion d'Église
-- Migration unique complète — MySQL 5.7+ compatible
-- ============================================================

-- ── Utilisateur ──────────────────────────────────────────────
CREATE TABLE `Utilisateur` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `nom`        VARCHAR(191) NOT NULL,
  `prenom`     VARCHAR(191) NOT NULL,
  `email`      VARCHAR(191) NOT NULL,
  `motDePasse` VARCHAR(191) NOT NULL,
  `role`       ENUM('SUPER_ADMIN','ADMIN','PASTEUR','SECRETAIRE','TRESORIER','LECTEUR') NOT NULL DEFAULT 'SECRETAIRE',
  `actif`      TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Utilisateur_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Famille ──────────────────────────────────────────────────
CREATE TABLE `Famille` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `nom`       VARCHAR(191) NOT NULL,
  `adresse`   VARCHAR(191) NULL,
  `contact`   VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Departement ──────────────────────────────────────────────
CREATE TABLE `Departement` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `couleur`     VARCHAR(191) NULL,
  `icone`       VARCHAR(191) NULL,
  `actif`       TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Membre ───────────────────────────────────────────────────
CREATE TABLE `Membre` (
  `id`                    INT NOT NULL AUTO_INCREMENT,
  `numeroMembre`          VARCHAR(191) NULL,
  `nom`                   VARCHAR(191) NOT NULL,
  `prenom`                VARCHAR(191) NOT NULL,
  `sexe`                  ENUM('HOMME','FEMME') NOT NULL DEFAULT 'HOMME',
  `dateNaissance`         DATETIME(3) NULL,
  `contact`               VARCHAR(191) NULL,
  `email`                 VARCHAR(191) NULL,
  `adresse`               VARCHAR(191) NULL,
  `situationMatrimoniale` VARCHAR(191) NULL,
  `profession`            VARCHAR(191) NULL,
  `photo`                 VARCHAR(191) NULL,
  `statut`                ENUM('ACTIF','INACTIF','VISITEUR','CATECHUMENE','TRANSFERE') NOT NULL DEFAULT 'ACTIF',
  `dateEntreeEglise`      DATETIME(3) NULL,
  `dateBaptemeEau`        DATETIME(3) NULL,
  `dateBaptemeEsprit`     DATETIME(3) NULL,
  `dateEntreeDepartement` DATETIME(3) NULL,
  `activiteAuSeinDP`      VARCHAR(191) NULL,
  `numeroCarteMembre`     VARCHAR(191) NULL,
  `familleId`             INT NULL,
  `dateInscription`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`             DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Membre_numeroMembre_key` (`numeroMembre`),
  UNIQUE KEY `Membre_email_key` (`email`),
  KEY `Membre_familleId_fkey` (`familleId`),
  CONSTRAINT `Membre_familleId_fkey` FOREIGN KEY (`familleId`) REFERENCES `Famille` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── MembreDepartement ─────────────────────────────────────────
CREATE TABLE `MembreDepartement` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `membreId`      INT NOT NULL,
  `departementId` INT NOT NULL,
  `role`          VARCHAR(191) NULL,
  `dateDebut`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dateFin`       DATETIME(3) NULL,
  `actif`         TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MembreDepartement_membreId_departementId_key` (`membreId`,`departementId`),
  KEY `MembreDepartement_departementId_fkey` (`departementId`),
  CONSTRAINT `MembreDepartement_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE,
  CONSTRAINT `MembreDepartement_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Culte ────────────────────────────────────────────────────
CREATE TABLE `Culte` (
  `id`             INT NOT NULL AUTO_INCREMENT,
  `dateCulte`      DATETIME(3) NOT NULL,
  `horaire`        VARCHAR(191) NOT NULL,
  `themePrincipal` VARCHAR(191) NULL,
  `assistance`     INT NULL,
  `notes`          TEXT NULL,
  `createdAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ProgrammeCulte ───────────────────────────────────────────
CREATE TABLE `ProgrammeCulte` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `date`                DATETIME(3) NOT NULL,
  `semaine`             VARCHAR(191) NULL,
  `typeCulte`           VARCHAR(191) NULL,
  `theme`               VARCHAR(191) NULL,
  `cantiqueFrancais`    VARCHAR(191) NULL,
  `cantiqueBaoule`      VARCHAR(191) NULL,
  `cantiqueFrancaisRef` VARCHAR(191) NULL,
  `cantiqueBaouleRef`   VARCHAR(191) NULL,
  `notes`               TEXT NULL,
  `status`              ENUM('PLANIFIE','EN_COURS','TERMINE','ANNULE') NOT NULL DEFAULT 'PLANIFIE',
  `planificateurId`     INT NULL,
  `createdAt`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ProgrammeCulte_planificateurId_fkey` (`planificateurId`),
  CONSTRAINT `ProgrammeCulte_planificateurId_fkey` FOREIGN KEY (`planificateurId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── RoleProgramme ────────────────────────────────────────────
CREATE TABLE `RoleProgramme` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `programmeId` INT NOT NULL,
  `culteType`   ENUM('PREMIER','DEUXIEME','TROISIEME') NOT NULL,
  `role`        VARCHAR(191) NOT NULL,
  `heure`       VARCHAR(191) NULL,
  `membreId`    INT NULL,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `RoleProgramme_prog_culte_role_key` (`programmeId`,`culteType`,`role`),
  KEY `RoleProgramme_membreId_fkey` (`membreId`),
  CONSTRAINT `RoleProgramme_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `ProgrammeCulte` (`id`) ON DELETE CASCADE,
  CONSTRAINT `RoleProgramme_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Predication ──────────────────────────────────────────────
CREATE TABLE `Predication` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `culteId`       INT NOT NULL,
  `titre`         VARCHAR(191) NOT NULL,
  `texteBiblique` VARCHAR(191) NOT NULL,
  `resume`        TEXT NULL,
  `message`       TEXT NULL,
  `predicateurId` INT NOT NULL,
  `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Predication_culteId_fkey` (`culteId`),
  KEY `Predication_predicateurId_fkey` (`predicateurId`),
  CONSTRAINT `Predication_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Predication_predicateurId_fkey` FOREIGN KEY (`predicateurId`) REFERENCES `Membre` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Annonce ──────────────────────────────────────────────────
CREATE TABLE `Annonce` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `culteId`       INT NOT NULL,
  `titre`         VARCHAR(191) NOT NULL,
  `infosJour`     TEXT NULL,
  `remerciements` TEXT NULL,
  `rappels`       TEXT NULL,
  `commentaires`  VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  KEY `Annonce_culteId_fkey` (`culteId`),
  CONSTRAINT `Annonce_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── CompteRendu ──────────────────────────────────────────────
CREATE TABLE `CompteRendu` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `annonceId`        INT NOT NULL,
  `messager`         VARCHAR(191) NOT NULL,
  `texteBiblique`    VARCHAR(191) NOT NULL,
  `assistanceTotale` INT NOT NULL,
  `theme`            VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CompteRendu_annonceId_key` (`annonceId`),
  CONSTRAINT `CompteRendu_annonceId_fkey` FOREIGN KEY (`annonceId`) REFERENCES `Annonce` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Presence ─────────────────────────────────────────────────
CREATE TABLE `Presence` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `culteId`   INT NOT NULL,
  `membreId`  INT NOT NULL,
  `statut`    ENUM('PRESENT','ABSENT','EXCUSE') NOT NULL DEFAULT 'PRESENT',
  `motif`     VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Presence_culteId_membreId_key` (`culteId`,`membreId`),
  KEY `Presence_membreId_fkey` (`membreId`),
  CONSTRAINT `Presence_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Presence_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Evenement ────────────────────────────────────────────────
CREATE TABLE `Evenement` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `titre`         VARCHAR(191) NOT NULL,
  `description`   TEXT NULL,
  `type`          ENUM('RETRAITE','CONFERENCE','CAMP','EVANGELISATION','MARIAGE','BAPTEME','FUNERAILLES','DEDICACE','ANNIVERSAIRE','AUTRE') NOT NULL DEFAULT 'AUTRE',
  `statut`        ENUM('PLANIFIE','EN_COURS','TERMINE','ANNULE') NOT NULL DEFAULT 'PLANIFIE',
  `dateDebut`     DATETIME(3) NOT NULL,
  `dateFin`       DATETIME(3) NULL,
  `lieu`          VARCHAR(191) NULL,
  `capaciteMax`   INT NULL,
  `departementId` INT NULL,
  `responsable`   VARCHAR(191) NULL,
  `budget`        DOUBLE NULL,
  `notes`         TEXT NULL,
  `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Evenement_departementId_fkey` (`departementId`),
  CONSTRAINT `Evenement_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Inscription ──────────────────────────────────────────────
CREATE TABLE `Inscription` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `evenementId` INT NOT NULL,
  `nom`         VARCHAR(191) NOT NULL,
  `prenom`      VARCHAR(191) NOT NULL,
  `contact`     VARCHAR(191) NULL,
  `statut`      VARCHAR(191) NOT NULL DEFAULT 'CONFIRME',
  `notes`       VARCHAR(191) NULL,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Inscription_evenementId_fkey` (`evenementId`),
  CONSTRAINT `Inscription_evenementId_fkey` FOREIGN KEY (`evenementId`) REFERENCES `Evenement` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Finance ──────────────────────────────────────────────────
CREATE TABLE `Finance` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `type`          ENUM('OFFRANDE','DIXME','DON','DEPENSE','REMBOURSEMENT','AUTRE') NOT NULL,
  `montant`       DOUBLE NOT NULL,
  `description`   VARCHAR(191) NULL,
  `date`          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reference`     VARCHAR(191) NULL,
  `recu`          TINYINT(1) NOT NULL DEFAULT 0,
  `culteId`       INT NULL,
  `departementId` INT NULL,
  `evenementId`   INT NULL,
  `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Finance_culteId_fkey` (`culteId`),
  KEY `Finance_departementId_fkey` (`departementId`),
  KEY `Finance_evenementId_fkey` (`evenementId`),
  CONSTRAINT `Finance_culteId_fkey` FOREIGN KEY (`culteId`) REFERENCES `Culte` (`id`) ON DELETE SET NULL,
  CONSTRAINT `Finance_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement` (`id`) ON DELETE SET NULL,
  CONSTRAINT `Finance_evenementId_fkey` FOREIGN KEY (`evenementId`) REFERENCES `Evenement` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Dime ─────────────────────────────────────────────────────
CREATE TABLE `Dime` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `membreId`  INT NOT NULL,
  `montant`   DOUBLE NOT NULL,
  `mois`      INT NOT NULL,
  `annee`     INT NOT NULL,
  `paye`      TINYINT(1) NOT NULL DEFAULT 0,
  `datePaie`  DATETIME(3) NULL,
  `notes`     VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Dime_membreId_mois_annee_key` (`membreId`,`mois`,`annee`),
  CONSTRAINT `Dime_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Budget ───────────────────────────────────────────────────
CREATE TABLE `Budget` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `annee`         INT NOT NULL,
  `departementId` INT NULL,
  `categorie`     VARCHAR(191) NOT NULL,
  `montantPrevu`  DOUBLE NOT NULL,
  `description`   VARCHAR(191) NULL,
  `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ActePastoral ─────────────────────────────────────────────
CREATE TABLE `ActePastoral` (
  `id`             INT NOT NULL AUTO_INCREMENT,
  `type`           ENUM('MARIAGE','BAPTEME_EAU','BAPTEME_ESPRIT','FUNERAILLES','DEDICACE_ENFANT','RECEPTION_MEMBRE') NOT NULL,
  `date`           DATETIME(3) NOT NULL,
  `lieu`           VARCHAR(191) NULL,
  `officiant`      VARCHAR(191) NOT NULL,
  `description`    TEXT NULL,
  `notes`          TEXT NULL,
  `membreId`       INT NULL,
  `temoinId`       INT NULL,
  `conjointNom`    VARCHAR(191) NULL,
  `conjointPrenom` VARCHAR(191) NULL,
  `createdAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ActePastoral_membreId_fkey` (`membreId`),
  KEY `ActePastoral_temoinId_fkey` (`temoinId`),
  CONSTRAINT `ActePastoral_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ActePastoral_temoinId_fkey` FOREIGN KEY (`temoinId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ActiviteMembre ───────────────────────────────────────────
CREATE TABLE `ActiviteMembre` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `membreId`     INT NOT NULL,
  `titre`        VARCHAR(191) NOT NULL,
  `description`  TEXT NULL,
  `dateActivite` DATETIME(3) NOT NULL,
  `lieu`         VARCHAR(191) NULL,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ActiviteMembre_membreId_fkey` (`membreId`),
  CONSTRAINT `ActiviteMembre_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cellule ──────────────────────────────────────────────────
CREATE TABLE `Cellule` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `nom`           VARCHAR(191) NOT NULL,
  `zone`          VARCHAR(191) NULL,
  `quartier`      VARCHAR(191) NULL,
  `responsableId` INT NULL,
  `actif`         TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Cellule_responsableId_fkey` (`responsableId`),
  CONSTRAINT `Cellule_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── MembreCellule ────────────────────────────────────────────
CREATE TABLE `MembreCellule` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `membreId`  INT NOT NULL,
  `celluleId` INT NOT NULL,
  `actif`     TINYINT(1) NOT NULL DEFAULT 1,
  `dateDebut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `MembreCellule_membreId_celluleId_key` (`membreId`,`celluleId`),
  KEY `MembreCellule_celluleId_fkey` (`celluleId`),
  CONSTRAINT `MembreCellule_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE,
  CONSTRAINT `MembreCellule_celluleId_fkey` FOREIGN KEY (`celluleId`) REFERENCES `Cellule` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ReunionCellule ───────────────────────────────────────────
CREATE TABLE `ReunionCellule` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `celluleId` INT NOT NULL,
  `date`      DATETIME(3) NOT NULL,
  `lieu`      VARCHAR(191) NULL,
  `theme`     VARCHAR(191) NULL,
  `presents`  INT NULL,
  `notes`     TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ReunionCellule_celluleId_fkey` (`celluleId`),
  CONSTRAINT `ReunionCellule_celluleId_fkey` FOREIGN KEY (`celluleId`) REFERENCES `Cellule` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── VisitePastorale ──────────────────────────────────────────
CREATE TABLE `VisitePastorale` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `membreId`     INT NOT NULL,
  `pasteur`      VARCHAR(191) NOT NULL,
  `date`         DATETIME(3) NOT NULL,
  `type`         VARCHAR(191) NOT NULL DEFAULT 'VISITE',
  `motif`        VARCHAR(191) NULL,
  `notes`        TEXT NULL,
  `suivi`        TEXT NULL,
  `confidentiel` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `VisitePastorale_membreId_fkey` (`membreId`),
  CONSTRAINT `VisitePastorale_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── NouveauConverti ──────────────────────────────────────────
CREATE TABLE `NouveauConverti` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `membreId`         INT NOT NULL,
  `dateConversion`   DATETIME(3) NOT NULL,
  `lieuConversion`   VARCHAR(191) NULL,
  `evangelisateur`   VARCHAR(191) NULL,
  `stadeFormation`   VARCHAR(191) NOT NULL DEFAULT 'NOUVEAU',
  `notes`            TEXT NULL,
  `createdAt`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `NouveauConverti_membreId_key` (`membreId`),
  CONSTRAINT `NouveauConverti_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── DemandePriere ────────────────────────────────────────────
CREATE TABLE `DemandePriere` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `membreId`     INT NULL,
  `nom`          VARCHAR(191) NULL,
  `sujet`        VARCHAR(191) NOT NULL,
  `details`      TEXT NULL,
  `statut`       VARCHAR(191) NOT NULL DEFAULT 'EN_COURS',
  `confidentiel` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `DemandePriere_membreId_fkey` (`membreId`),
  CONSTRAINT `DemandePriere_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Inventaire ───────────────────────────────────────────────
CREATE TABLE `Inventaire` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `nom`          VARCHAR(191) NOT NULL,
  `categorie`    VARCHAR(191) NOT NULL,
  `quantite`     INT NOT NULL DEFAULT 1,
  `etat`         VARCHAR(191) NOT NULL DEFAULT 'BON',
  `valeur`       DOUBLE NULL,
  `dateAchat`    DATETIME(3) NULL,
  `fournisseur`  VARCHAR(191) NULL,
  `numeroSerie`  VARCHAR(191) NULL,
  `localisation` VARCHAR(191) NULL,
  `notes`        VARCHAR(191) NULL,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ServiceBenevole ──────────────────────────────────────────
CREATE TABLE `ServiceBenevole` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `membreId`  INT NOT NULL,
  `service`   VARCHAR(191) NOT NULL,
  `dimanche`  DATETIME(3) NOT NULL,
  `statut`    VARCHAR(191) NOT NULL DEFAULT 'PLANIFIE',
  `notes`     VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ServiceBenevole_membreId_fkey` (`membreId`),
  CONSTRAINT `ServiceBenevole_membreId_fkey` FOREIGN KEY (`membreId`) REFERENCES `Membre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Départements par défaut ──────────────────────────────────
INSERT INTO `Departement` (`nom`, `description`, `couleur`, `icone`) VALUES
('Culte',          'Département de culte principal',     '#16a34a', '⛪'),
('Jeunesse',       'Département des jeunes',             '#2563eb', '🌟'),
('Femmes',         'Département des femmes',             '#db2777', '👩'),
('Hommes',         'Département des hommes',             '#1d4ed8', '👨'),
('Enfants',        'École du dimanche',                  '#f59e0b', '👶'),
('Louange',        'Équipe de louange et adoration',     '#7c3aed', '🎵'),
('Évangélisation', 'Équipe d\'évangélisation',           '#dc2626', '📢'),
('Intercession',   'Équipe de prière',                   '#0891b2', '🙏');

-- ── Admin par défaut (mot de passe : admin123) ───────────────
INSERT INTO `Utilisateur` (`nom`,`prenom`,`email`,`motDePasse`,`role`,`actif`,`updatedAt`)
VALUES ('Admin','CMA','admin@cma-dokui1.ci',
  '$2a$10$axMKU9HRTCfXjMmK7xmu/OcrkmY4zIFYXSshTfy41IurrKNi9pLiW',
  'SUPER_ADMIN', 1, NOW());
