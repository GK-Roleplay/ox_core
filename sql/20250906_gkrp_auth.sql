-- GK:RP auth migration
-- Generated 2025-09-06T13:22:18.559220Z

ALTER TABLE `users`
  ADD COLUMN `username` VARCHAR(64) NOT NULL UNIQUE AFTER `userId`,
  ADD COLUMN `password_hash` VARCHAR(255) NOT NULL AFTER `username`;

-- Optional: store ped model + bio on character (if you want to persist from registration)
ALTER TABLE `characters`
  ADD COLUMN `model` VARCHAR(64) NULL AFTER `gender`,
  ADD COLUMN `bio` TEXT NULL AFTER `model`;
