
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

CREATE OR REPLACE FUNCTION create_product_inventory()
RETURNS TRIGGER AS $$
DECLARE
    new_inventory_id INT;
BEGIN
    INSERT INTO product_inventory (quantity) VALUES (100) RETURNING id INTO new_inventory_id;

    UPDATE product SET inventory_id = new_inventory_id WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_product_insert
AFTER INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION create_product_inventory();


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


CREATE OR REPLACE FUNCTION create_cart_after_user_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "public"."cart" ("user_id", "created_at", "updated_at")
  VALUES (NEW."user_id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_cart_after_user_insert
AFTER INSERT ON "public"."user"
FOR EACH ROW
EXECUTE FUNCTION create_cart_after_user_insert();



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
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES public.user (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_product_id
        FOREIGN KEY (product_id)
        REFERENCES public.products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (user_id, product_id)
);



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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

CREATE OR REPLACE FUNCTION add_group_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, joined_at)
  VALUES (NEW.group_id, NEW.created_by, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_creator_as_member
AFTER INSERT ON public.group
FOR EACH ROW
EXECUTE FUNCTION add_group_creator_as_member();

CREATE TABLE public.message_attachments (
  attachment_id SERIAL PRIMARY KEY,
  message_id INT NOT NULL,
  attachment_type VARCHAR(50) NOT NULL, 
  updated_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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


CREATE TABLE vto_image_search (
  id SERIAL PRIMARY KEY,
  model_image_name VARCHAR(255) NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  vto_s3_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
);


CREATE TABLE image_info_image_search (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(255) NOT NULL,
    vector vector(2048) NOT  null,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL
);


CREATE OR REPLACE FUNCTION notify_friend_request_change()
RETURNS TRIGGER AS $$
DECLARE
    notification JSON;
BEGIN

    notification = json_build_object(
        'request_id', NEW.request_id,
        'sender_id', NEW.sender_id,
        'receiver_id', NEW.receiver_id,
        'status', NEW.status,
        'event_type', TG_OP,  
        'timestamp', CURRENT_TIMESTAMP
    );

    
    PERFORM pg_notify('friend_request_change', notification::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_friend_requests_change_event
AFTER INSERT OR UPDATE ON public.friend_requests
FOR EACH ROW
EXECUTE FUNCTION notify_friend_requests_change_event();

CREATE OR REPLACE FUNCTION update_friend_requests_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_friend_requests_updated_at
BEFORE UPDATE ON public.friend_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_friend_requests_updated_at_column();

DROP TRIGGER IF EXISTS trigger_notify_friend_requests_change_event ON public.friend_requests;
DROP TRIGGER IF EXISTS trigger_update_friend_requests_updated_at ON public.friend_requests;

DROP FUNCTION IF EXISTS notify_friend_request_change();
DROP FUNCTION IF EXISTS update_friend_requests_updated_at_column();


CREATE TABLE public.user_liked_models (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    model_image_name VARCHAR(255) NOT NULL,
    model_image_url VARCHAR(255) DEFAULT NULL,
    updated_at DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.user (user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_model
        UNIQUE (user_id, model_image_name)
);

