from flask import Blueprint, request, jsonify
import numpy as np
import psycopg2


from psycopg2.extensions import register_adapter, AsIs
import torch

from transformers import CLIPModel, CLIPProcessor
bp = Blueprint('search', __name__)

# Initialize the model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


# Connect to the database
def get_db_connection():
    conn = psycopg2.connect(
        dbname='postgres',
        user='root',
        password='rootuser',
        host='sw.clmeygaiqnad.eu-north-1.rds.amazonaws.com',
        port='5432'
    )
    return conn

def add_numpy_adapter():
    def adapt_numpy_int64(numpy_int):
        return AsIs(numpy_int)

    def adapt_numpy_float64(numpy_float):
        return AsIs(numpy_float)

    register_adapter(np.int64, adapt_numpy_int64)
    register_adapter(np.float64, adapt_numpy_float64)

# Full-text search function (basic simulation)
def fulltext_search(query):
    # Get database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    # Using PostgreSQL full-text search
    try:
        query = query.lower()  # Convert to lowercase to improve matching

        # Use precomputed tsvectors stored in the fulltext_vector column
        cursor.execute("""
                SELECT id, name, image_url
                FROM fulltext_search_products
                WHERE fulltext_vector @@ plainto_tsquery('english', %s);
            """, (query,))

        # get result
        results = cursor.fetchall()

        # format result
        search_results = [
            {
                "product_id": result[0],
                "image_url": result[2],
                "image_name": result[1],
            }
            for result in results
        ]
        return {"results": search_results}

    except Exception as e:
        print(f"Error during search: {e}")
        return {"results": []}

    finally:
        cursor.close()
        conn.close()


# Semantic search function (basic simulation)
def semantic_search(search_query, top_k=200):
    # Add numpy type adapter
    add_numpy_adapter()

    # Generate embedding vectors for the search query
    inputs = processor(text=search_query, return_tensors="pt", padding=True)
    with torch.no_grad():
        search_embedding = model.get_text_features(**inputs).numpy().flatten()

    search_embedding_str = ','.join([str(x) for x in search_embedding])

    sql_query = f"""
            SELECT t1.image_name, t2.image_url,t2.id, t1.text_vector <=> '[{search_embedding_str}]' AS similarity
            FROM products_des_embedding t1
            JOIN image_url t2 ON t1.image_name = t2.image_name
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

        return {
            "results": [{"image_name": row[0],  "image_url": row[1], "product_id": row[2]} for row in results],
        }

    finally:
        conn.close()


@bp.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '')
    method = data.get('method', '')

    if method == "fulltext":
        results = fulltext_search(query)
    elif method == "semantic":
        results = semantic_search(query)
    else:
        results = []

    return jsonify(results)
