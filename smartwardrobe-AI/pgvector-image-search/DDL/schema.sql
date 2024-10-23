
-- create database image-search
CREATE DATABASE image-search;

-- connect to image-search
\c image-search

------------------------------------------------
-- drop table !!!!!!!!!!!!!!!!
DROP TABLE IF EXISTS <table_name> CASCADE;
------------------------------------------------

-- image_info table
create table if not exists image_info
(
    image_id   serial primary key,
    article_id varchar(255) not null
        constraint unique_image_name
            unique,
    image_path varchar(255),
    vector     vector(2048)
);

-- product_info table
create table if not exists product_info
(
    product_id   serial primary key,
    article_id   varchar(255) not null,
    product_code integer      not null
);