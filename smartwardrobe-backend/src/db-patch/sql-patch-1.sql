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
  PRIMARY KEY (`user_id`),
    UNIQUE (`username`)
);

  CREATE TABLE `product_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `desc` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
  );

CREATE TABLE `product_inventory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quantity` INT NULL,
  `product_id` INT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `deleted_at` TIMESTAMP NULL,  
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_inventory_on_product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `smartwardrobe`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

   CREATE TABLE `product` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `desc` TEXT NULL,
    `SKU` VARCHAR(255) NULL,
    `category_id` INT NULL,
    `inventory_id` INT NULL,
    `price` DECIMAL NULL,
    `discount_id` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_product_on_category_id`
      FOREIGN KEY (`category_id`)
      REFERENCES `smartwardrobe`.`product_category` (`id`)
      ON UPDATE CASCADE
    );

CREATE TABLE `smartwardrobe`.`cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `smartwardrobe`.`user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

DELIMITER //

CREATE TRIGGER `create_cart_after_user_insert`
AFTER INSERT ON `smartwardrobe`.`user`
FOR EACH ROW
BEGIN
  INSERT INTO `smartwardrobe`.`cart` (`user_id`, `created_at`, `updated_at`)
  VALUES (NEW.`user_id`, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END //

DELIMITER ;

CREATE TABLE `smartwardrobe`.`cart_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cart_id` INT NULL,
  `product_id` INT NULL,
  `quantity` INT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `smartwardrobe`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_item_on_cart_id`
    FOREIGN KEY (`cart_id`)
    REFERENCES `smartwardrobe`.`cart` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

