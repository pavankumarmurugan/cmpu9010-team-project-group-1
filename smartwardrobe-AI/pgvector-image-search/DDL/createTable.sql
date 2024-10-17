-- DDL: createTable.sql
------------------------------------------------
-- create database image_search
CREATE DATABASE image_search;

-- connect to image_search
\c image_search

------------------------------------------------
-- drop table !!!!!!!!!!!!!!!!
DROP TABLE IF EXISTS <table_name> CASCADE;
------------------------------------------------

-- Create table product_info (without foreign key constraints)
CREATE TABLE product_info (
    product_Id SERIAL PRIMARY KEY, 
    product_code VARCHAR(100) NOT NULL,      
    image_Id INTEGER
);

-- Create table image_info (without foreign key constraints)
CREATE TABLE image_info (
    image_Id SERIAL PRIMARY KEY,               
    product_id INTEGER NOT NULL,               
    image_name VARCHAR(255) NOT NULL,          
    image_path VARCHAR(255),                   
    vector VECTOR(2048)                        
);

------------------------------------------------------------------------------------------------
-- Add a foreign key constraint to the product_info table (image_Id)
ALTER TABLE product_info
ADD CONSTRAINT fk_image
FOREIGN KEY (image_Id) 
REFERENCES image_info(image_Id)
ON DELETE SET NULL;

-- Add a foreign key constraint to the image_info table (product_id)
ALTER TABLE image_info
ADD CONSTRAINT fk_product
FOREIGN KEY (product_id)
REFERENCES product_info(product_Id)
ON DELETE CASCADE;
------------------------------------------------------------------------------------------------

-- Creating Indexes ------------------------------------------------

-- 为 product_code 创建唯一索引
CREATE UNIQUE INDEX idx_product_code
ON product_info (product_code);

-- 为 image_Id 创建索引
CREATE INDEX idx_image_id
ON product_info (image_Id);

-- 为 product_id 创建索引
CREATE INDEX idx_product_id
ON image_info (product_id);

-- 为 image_name 创建索引
CREATE INDEX idx_image_name
ON image_info (image_name);
