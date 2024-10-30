import torch
from transformers import CLIPModel, CLIPProcessor

from vector_search.models.text_search_model import get_db_connection, add_numpy_adapter

# Initialize the model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


# Text Search service
def perform_search(search_query, top_k=200):
    # Add numpy type adapter
    add_numpy_adapter()

    # Generate embedding vectors for the search query
    inputs = processor(text=search_query, return_tensors="pt", padding=True)
    with torch.no_grad():
        search_embedding = model.get_text_features(**inputs).numpy().flatten()

    search_embedding_str = ','.join([str(x) for x in search_embedding])

    # sql_query = f"""
    #     select t1.image_name, t2.id, 1 - (t1.text_vector <=> '[{search_embedding_str}]') AS similarity
    #     from {table_name} t1, products t2
    #     where t1.image_name = t2.image_name
    #     ORDER BY similarity DESC
    #     LIMIT {top_k};
    #    """

    # sql_query = f"""
    #     select t1.image_name, t2.id, t1.text_vector <=> '[{search_embedding_str}]' AS similarity
    #     from products_des_embedding t1, products t2
    #     where t1.image_name = t2.image_name
    #     ORDER BY similarity
    #     LIMIT {top_k};
    #    """

    sql_query = f"""
        SELECT t1.image_name, t2.id, t1.text_vector <=> '[{search_embedding_str}]' AS similarity
        FROM products_des_embedding t1
        JOIN products t2 ON t1.image_name = t2.image_name
        ORDER BY similarity
        LIMIT {top_k};
    """

    # Get database connection
    conn = get_db_connection()

    # Execute query and return results
    try:
        with conn.cursor() as cur:
            cur.execute(sql_query)
            results = cur.fetchall()

        return [{"image_name": row[0], "product_id": row[1]} for row in results]

    finally:
        conn.close()
