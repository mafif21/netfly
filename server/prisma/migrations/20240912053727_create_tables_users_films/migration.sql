-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `token` VARCHAR(255) NULL,
    `token_expiration` DATETIME(3) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `films` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
