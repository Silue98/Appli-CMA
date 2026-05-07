-- CreateTable
CREATE TABLE `EmailConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `host` VARCHAR(191) NOT NULL DEFAULT 'smtp.gmail.com',
    `port` INTEGER NOT NULL DEFAULT 587,
    `user` VARCHAR(191) NOT NULL DEFAULT '',
    `pass` VARCHAR(191) NOT NULL DEFAULT '',
    `from` VARCHAR(191) NOT NULL DEFAULT '',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
