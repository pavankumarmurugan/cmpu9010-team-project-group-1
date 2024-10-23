
CREATE TABLE text_vector (
    id SERIAL PRIMARY KEY,  
    article_id VARCHAR(255),
    product_code VARCHAR(255),  
    product_name VARCHAR(255),
    product_type VARCHAR(255),
    product_group VARCHAR(255),
    graphical_appearance VARCHAR(255),
    colour_group VARCHAR(255),
    perceived_colour VARCHAR(255),
    department VARCHAR(255),
    index_group VARCHAR(255),
    section_name VARCHAR(255),
    detail_desc TEXT,
    text_vector vector(512) 
);

select count(*) from image_search_imageinfo;