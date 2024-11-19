import os
import pandas as pd
import psycopg2
import torch
from PIL import Image
from psycopg2.extras import execute_batch
from transformers import AutoModel, AutoProcessor

# from transformers import AutoModel, AutoProcessor
# model = AutoModel.from_pretrained('Marqo/marqo-fashionCLIP', trust_remote_code=True)
# processor = AutoProcessor.from_pretrained('Marqo/marqo-fashionCLIP', trust_remote_code=True)

model = AutoModel.from_pretrained("openai/clip-vit-base-patch32")
processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 检测设备是否支持 MPS
device = torch.device("mps" if torch.backends.mps.is_available() and torch.backends.mps.is_built() else "cpu")
model.to(device)  # 将模型移动到 mps（如支持）
# print(f"Using device: {device}")

# Paths and batch size
base_image_dir = "clothing-images"
csv_path = "h&m_cleaned.csv"
batch_size = 1  # Database batch size for memory management

# Database connection configuration
db_config = {
    'dbname': 'image-search',
    'user': 'postgres',
    'password': 'test-postgres',
    'host': '127.0.0.1',
    'port': '5432'
}


def connect_to_database(config):
    """Connect to PostgreSQL database."""
    try:
        conn = psycopg2.connect(**config)
        print("Database connection established.")
        return conn
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise


def preprocess_text(row):
    """Combine product descriptions into a single text string."""
    text_fields = [
        row.get("Product_name"), row.get("Product_type"), row.get("Pattern"),
        row.get("Color"), row.get("Color_shade"), row.get("Material"),
        row.get("Occasion"), row.get("Applicable_season"), row.get("Description")
    ]
    text = " ".join([str(field) for field in text_fields if pd.notnull(field)])
    # print("row_text: ", text)
    return text


def process_record(row):
    """Process each record to generate image and text embeddings."""
    image_filename = row["Image"]
    subdir = image_filename[:3]
    image_path = os.path.join(base_image_dir, subdir, image_filename)

    if os.path.exists(image_path):
        try:
            # image = Image.open(image_path).convert("RGB").resize((224, 224))
            image = Image.open(image_path)
            text = preprocess_text(row)

            # Debugging: Check image path and text
            # print("Processing image:", image_path)
            # print("Text:", text)
            # print("----------------------------------------")

            processed = processor(text=[text], images=image, padding=True, truncation=True, return_tensors="pt")
            processed = {k: v.to(device) for k, v in processed.items()}  # 将处理后的数据移至 mps

            with torch.no_grad():
                image_features = model.get_image_features(processed['pixel_values']).cpu().numpy().flatten().tolist()
                text_features = model.get_text_features(processed['input_ids']).cpu().numpy().flatten().tolist()

                # print("image_embeddings: ",image_features)
                # print("text_embeddings: ",text_features)
                # print("Generated image embedding shape:", len(image_features))
                # print("Generated text embedding shape:", len(text_features))

                return {
                    "image_name": image_filename,
                    "image_embedding": image_features,
                    "text_embedding": text_features
                }
        except Exception as e:
            print(f"Error processing image {image_filename}: {e}")
    else:
        print(f"Warning: Image file {image_path} does not exist.")
        return None


def insert_embeddings_batch(conn, embeddings_batch):
    """Insert a batch of embeddings into the database."""
    with conn.cursor() as cur:
        insert_query = """
        INSERT INTO openai_clip (image_name, image_embedding, text_embedding)
        VALUES (%s, %s, %s)
        """

        data_to_insert = [
            (item["image_name"], item["image_embedding"], item["text_embedding"])
            for item in embeddings_batch
        ]
        # print("Data to insert:", len(data_to_insert))

        try:
            execute_batch(cur, insert_query, data_to_insert)
            conn.commit()
            print(f"Inserted batch of {len(embeddings_batch)} embeddings into the database.")
        except Exception as e:
            conn.rollback()
            print(f"Error inserting batch: {e}")


def process_csv_in_chunks(csv_path, chunk_size, conn):
    """Process the CSV in chunks and insert embeddings."""
    embeddings_batch = []
    for chunk in pd.read_csv(csv_path, chunksize=chunk_size):
        for _, row in chunk.iterrows():
            result = process_record(row)
            if result:
                embeddings_batch.append(result)

            # Insert batch into database if it reaches the batch size
            if len(embeddings_batch) >= batch_size:
                insert_embeddings_batch(conn, embeddings_batch)
                embeddings_batch.clear()  # Clear the batch for the next set of embeddings

        # Insert any remaining embeddings in the last batch
        if embeddings_batch:
            insert_embeddings_batch(conn, embeddings_batch)


def main():
    """Main function to execute the embedding generation and database insertion."""
    try:
        conn = connect_to_database(db_config)

        process_csv_in_chunks(csv_path, 100, conn)

    except Exception as e:
        print(f"Error in main processing: {e}")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")


if __name__ == "__main__":
    main()
