
CREATE TABLE "user" (
    "user_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255) DEFAULT NULL,
    "email" VARCHAR(255) DEFAULT NULL,
    "dob" VARCHAR(255) DEFAULT NULL,
    "updated_at" DATE DEFAULT NULL,
    "created_at" DATE DEFAULT NULL,
    "role" VARCHAR(255) NOT NULL,
    "profile_pic" VARCHAR(255) DEFAULT NULL
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

  --   CREATE TABLE "product_category" (
  --   "id" SERIAL PRIMARY KEY,
  --   "name" VARCHAR(255) NULL,
  --   "desc" TEXT NULL,
  --   "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  --   "updated_at" TIMESTAMP NULL,
  --   "deleted_at" TIMESTAMP NULL
  -- );
  
  

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

-- Create the trigger function
CREATE OR REPLACE FUNCTION create_product_inventory()
RETURNS TRIGGER AS $$
DECLARE
    new_inventory_id INT;
BEGIN
    -- Insert a new record into the product_inventory table with a default value of 100
    INSERT INTO product_inventory (quantity) VALUES (100) RETURNING id INTO new_inventory_id;

    -- Update the product table to set the inventory_id with the newly created product_inventory ID
    UPDATE product SET inventory_id = new_inventory_id WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER after_product_insert
AFTER INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION create_product_inventory();

-- CREATE TABLE "product_inventory" (
--     "id" SERIAL PRIMARY KEY,
--     "quantity" INT NULL,
--     "product_id" INT NULL,
--     "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP NULL,
--     "deleted_at" TIMESTAMP NULL,  
--     CONSTRAINT "fk_product_inventory_on_product_id"
--       FOREIGN KEY ("product_id")
--       REFERENCES "smartwardrobe"."product" ("id")
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
--   );

--    CREATE TABLE `product` (
--     `id` INT NOT NULL AUTO_INCREMENT,
--     `article_id` VARCHAR(255) NULL,
--     `product_code` VARCHAR(255) NULL,
--     `prod_name` VARCHAR(255) NULL,
--     `product_type_no` INT NULL,
--     `product_type_name` VARCHAR(255) NULL,
--     `product_group_name` VARCHAR(255) NULL,
--     `graphical_appearance_no` INT NULL,
--     `graphical_appearance_name` VARCHAR(255) NULL,
--     `colour_group_code` VARCHAR(255) NULL,
--     `colour_group_name` VARCHAR(255) NULL,
--     `perceived_colour_value_id` INT NULL,
--     `perceived_colour_value_name` VARCHAR(255) NULL,
--     `perceived_colour_master_id` INT NULL,
--     `perceived_colour_master_name` VARCHAR(255) NULL,
--     `department_no` INT NULL,
--     `department_name` VARCHAR(255) NULL,
--     `index_code` VARCHAR(255) NULL,
--     `index_name` VARCHAR(255) NULL,
--     `index_group_no` INT NULL,
--     `index_group_name` VARCHAR(255) NULL,
--     `section_no` INT NULL,
--     `section_name` VARCHAR(255) NULL,
--     `garment_group_no` INT NULL,
--     `garment_group_name` VARCHAR(255) NULL,
--     `detail_desc` TEXT NULL,
--     `sku` VARCHAR(255) NULL,
--     `category_id` INT NULL,
--     `inventory_id` INT NULL,
--     `price` DECIMAL NULL,
--     `discount_id` INT NULL,
--     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     `updated_at` TIMESTAMP NULL,
--     `deleted_at` TIMESTAMP NULL,
--     PRIMARY KEY (`id`),
--     CONSTRAINT `fk_product_on_category_id`
--       FOREIGN KEY (`category_id`)
--       REFERENCES `smartwardrobe`.`product_category` (`id`)
--       ON UPDATE CASCADE
-- );

-- CREATE TABLE product (
--     id SERIAL PRIMARY KEY,
--     article_id VARCHAR(255) NULL,
--     product_code VARCHAR(255) NULL,
--     prod_name VARCHAR(255) NULL,
--     product_type_no INT NULL,
--     product_type_name VARCHAR(255) NULL,
--     product_group_name VARCHAR(255)  NULL,
--     graphical_appearance_no INT  NULL,
--     graphical_appearance_name VARCHAR(255)  NULL,
--     colour_group_code VARCHAR(255)  NULL,
--     colour_group_name VARCHAR(255)  NULL,
--     perceived_colour_value_id INT  NULL,
--     perceived_colour_value_name VARCHAR(255)  NULL,
--     perceived_colour_master_id INT  NULL,
--     perceived_colour_master_name VARCHAR(255)  NULL,
--     department_no INT  NULL,
--     department_name VARCHAR(255)  NULL,
--     index_code VARCHAR(255)  NULL,
--     index_name VARCHAR(255)  NULL,
--     index_group_no INT  NULL,
--     index_group_name VARCHAR(255)  NULL,
--     section_no INT  NULL,
--     section_name VARCHAR(255)  NULL,
--     garment_group_no INT  NULL,
--     garment_group_name VARCHAR(255)  NULL,
--     detail_desc TEXT  NULL,
--     sku VARCHAR(255) NULL, -- Made nullable
--     category_id INT NULL, -- Made nullable
--     inventory_id INT NULL, -- Made nullable
--     price DECIMAL NULL, -- Made nullable
--     discount_id INT NULL, -- Made nullable
--     image_url VARCHAR(255), 
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP,
--     deleted_at TIMESTAMP,
--     CONSTRAINT fk_product_on_category_id
--       FOREIGN KEY (category_id)
--       REFERENCES product_category (id)
--       ON UPDATE CASCADE
-- );

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(255) NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NULL,
    pattern VARCHAR(100) NULL,
    color VARCHAR(50) NULL,
    color_shade VARCHAR(50) NULL,
    material VARCHAR(100) NULL,
    occasion VARCHAR(100) NULL,
    applicable_season VARCHAR(100) NULL,
    description TEXT NULL,
    price NUMERIC(10, 2) CHECK (price >= 0) NULL,
    image_url VARCHAR(255) NULL,
    trail BOOLEAN DEFAULT true null,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL
);

CREATE TABLE public."cart" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  "deleted_at" TIMESTAMP NULL,
  CONSTRAINT "fk_user_id"
    FOREIGN KEY ("user_id")
    REFERENCES "public"."user" ("user_id")
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

-- CREATE OR REPLACE FUNCTION create_cart_after_user_insert()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO "smartwardrobe"."cart" ("user_id", "created_at", "updated_at")
--   VALUES (NEW."user_id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER create_cart_after_user_insert
-- AFTER INSERT ON "smartwardrobe"."user"
-- FOR EACH ROW
-- EXECUTE FUNCTION create_cart_after_user_insert();



CREATE TABLE "smartwardrobe"."cart_item" (
  "id" SERIAL PRIMARY KEY,
  "cart_id" INT NULL,
  "product_id" INT NULL,
  "quantity" INT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  CONSTRAINT "fk_product_id"
    FOREIGN KEY ("product_id")
    REFERENCES "smartwardrobe"."product" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "fk_cart_item_on_cart_id"
    FOREIGN KEY ("cart_id")
    REFERENCES "smartwardrobe"."cart" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);



CREATE TABLE public.like (
  id SERIAL PRIMARY KEY,
  user_id INT NULL,
  product_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_product_id
    FOREIGN KEY (product_id)
    REFERENCES public.product (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- CREATE TABLE public.chat (
--   id SERIAL PRIMARY KEY,
--   sender_id INT NULL,
--   receiver_id INT NULL,
--   message TEXT NULL,
--   created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NULL,
--   CONSTRAINT fk_sender_id
--     FOREIGN KEY (sender_id)
--     REFERENCES public.user (user_id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE,
--   CONSTRAINT fk_receiver_id
--     FOREIGN KEY (receiver_id)
--     REFERENCES public.user (user_id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE
-- );

CREATE TABLE public.chat (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NULL,
  group_id INT NULL,  
  message TEXT NULL,
  message_type VARCHAR(50) DEFAULT 'text', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_sender_id
    FOREIGN KEY (sender_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_receiver_id
    FOREIGN KEY (receiver_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_group_id
    FOREIGN KEY (group_id)
    REFERENCES public.group (group_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


CREATE TABLE public.friend_requests (
  request_id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_receiver
    FOREIGN KEY (receiver_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
);

CREATE TABLE public.friends (
  friend_id SERIAL PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_user1
    FOREIGN KEY (user1_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user2
    FOREIGN KEY (user2_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
);

CREATE TABLE public.group (
  group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  CONSTRAINT fk_creator
    FOREIGN KEY (created_by)
    REFERENCES public.user (user_id)
    ON DELETE SET NULL
);

CREATE TABLE public.group_members (
  membership_id SERIAL PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  CONSTRAINT fk_group
    FOREIGN KEY (group_id)
    REFERENCES public.group (group_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
);

CREATE TABLE public.message_attachments (
  attachment_id SERIAL PRIMARY KEY,
  message_id INT NOT NULL,
  attachment_type VARCHAR(50) NOT NULL, 
  updated_at TIMESTAMP DEFAULT NULL,
  url VARCHAR(255) NOT NULL,            
  CONSTRAINT fk_message
    FOREIGN KEY (message_id)
    REFERENCES public.chat (id)
    ON DELETE CASCADE
);

CREATE TABLE public.notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,          
  content VARCHAR(255) NOT NULL,      
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id)
    ON DELETE CASCADE
);

CREATE TABLE image_info_image_search (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(255) NOT NULL,
    vector vector(2048) NOT  null,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL
);