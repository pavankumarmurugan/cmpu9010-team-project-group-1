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

-- Create table image_info
CREATE TABLE image_info (
    image_id SERIAL PRIMARY KEY,               
    product_code INTEGER NOT NULL,               
    image_name VARCHAR(255) NOT NULL,          
    image_path VARCHAR(255),                   
    vector VECTOR(2048)
);