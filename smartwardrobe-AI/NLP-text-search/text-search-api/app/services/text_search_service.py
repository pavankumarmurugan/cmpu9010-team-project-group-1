import torch
from transformers import CLIPModel, CLIPProcessor
from app.models.text_search_model import get_db_connection, add_numpy_adapter

# Initialize the model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Search service
def perform_search(search_query, table_name="text_vector", top_k=200):
    # Add numpy type adapter
    add_numpy_adapter()

    # Generate embedding vectors for the search query
    inputs = processor(text=search_query, return_tensors="pt", padding=True)
    with torch.no_grad():
        search_embedding = model.get_text_features(**inputs).numpy().flatten()

    search_embedding_str = ','.join([str(x) for x in search_embedding])

    sql_query = f"""
        SELECT article_id, product_code,
               1 - (text_vector <=> '[{search_embedding_str}]') AS similarity
        FROM {table_name}
        ORDER BY similarity DESC
        LIMIT {top_k};
    """

    # Get database connection
    conn = get_db_connection()

    # Execute query and return results
    try:
        with conn.cursor() as cur:
            cur.execute(sql_query)
            results = cur.fetchall()

        return [{"article_id": row[0], "product_code": row[1]} for row in results]

    finally:
        conn.close()
