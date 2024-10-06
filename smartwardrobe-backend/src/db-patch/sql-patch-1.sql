CREATE TABLE `user` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `firstname` varchar(255) NOT NULL,
    `lastname` varchar(255) NOT NULL,
    `password` varchar(255)  NOT NULL,
    `refresh_token` varchar(255)  DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `dob` varchar(255) DEFAULT NULL,
    `updated_at` date DEFAULT NULL,
    `created_at` date DEFAULT NULL,
    `role` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`));

  CREATE TABLE `product_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `desc` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `product_inventory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quantity` INT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`));
