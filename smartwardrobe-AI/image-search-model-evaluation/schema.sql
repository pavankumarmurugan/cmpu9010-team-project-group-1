--
create table image_info_test
(
    image_id        serial primary key,
    image_name      varchar(255),
    image_embedding vector(2048)
);

CREATE TABLE fashion_clip_test
(
    id              SERIAL PRIMARY KEY,
    image_name      VARCHAR(255),
    image_embedding vector(768),
    text_embedding  vector(768)
);

CREATE TABLE openai_clip_test
(
    id              SERIAL PRIMARY KEY,
    image_name      VARCHAR(255),
    image_embedding vector(512),
    text_embedding  vector(512)
);
