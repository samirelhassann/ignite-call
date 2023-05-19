/*
  Warnings:

  - You are about to drop the `user_time_intervals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_time_intervals` DROP FOREIGN KEY `user_time_intervals_user_id_fkey`;

-- DropTable
DROP TABLE `user_time_intervals`;

-- CreateTable
CREATE TABLE `e` (
    `id` VARCHAR(191) NOT NULL,
    `week_day` INTEGER NOT NULL,
    `time_start_in_minutes` INTEGER NOT NULL,
    `time_end_in_minutes` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `e_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `accounts_user_id_fkey` TO `accounts_user_id_idx`;

-- RenameIndex
ALTER TABLE `schedulings` RENAME INDEX `schedulings_user_id_fkey` TO `schedulings_user_id_idx`;
