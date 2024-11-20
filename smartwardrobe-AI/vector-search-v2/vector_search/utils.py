import io

import requests
import torch
from PIL import Image
from transformers import AutoModel, AutoProcessor

from vector_search.models.image_search_model import connect_db

model = AutoModel.from_pretrained('Marqo/marqo-fashionSigLIP', trust_remote_code=True)
processor = AutoProcessor.from_pretrained('Marqo/marqo-fashionSigLIP', trust_remote_code=True)


def download_image(url):
    """
    Downloads an image from a URL and returns it as a PIL image.
    """
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad HTTP status

        # Create a BytesIO object from the response content
        image_stream = io.BytesIO(response.content)

        # Open the image using PIL and convert it to RGB format
        image = Image.open(image_stream)

        return image
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None


def image_processor(image):
    """Process input image to generate embeddings."""
    processed = processor(images=image, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        image_features = model.get_image_features(processed['pixel_values'],
                                                  normalize=True).cpu().numpy().flatten().tolist()
    return image_features


# Perform a similarity search
def perform_search(embedding_query, top_k):
    # Connect to the database
    conn = connect_db()

    cur = conn.cursor()
    # print(f"Performing search on column '{column_name}' with top_k = {top_k}")
    try:
        cur.execute(f"""
            SELECT i.image_name,p.id, i.image_embedding <=> %s::vector AS distance
            FROM marqoclip_image_embedding i
            JOIN products_2_image p ON i.image_name = p.image_name
            ORDER BY distance ASC
            LIMIT %s;
        """, (embedding_query, top_k))

        similar_items = cur.fetchall()

        return similar_items

    except Exception as e:
        print(f"Error performing search: {e}")
        return []
    finally:
        cur.close()


def format_search_results(search_results):
    """
    Format the search results into a list of dictionaries.

    Parameters:
        search_results (list): List of tuples containing article_id, product_code, and distance.

    Returns:
        dict: JSON-compatible dictionary with the formatted results.
    """
    # print("original search_results: ", search_results)

    # Format the results to match the required JSON structure
    formatted_results = [
        {"image_name": result[0], "product_id": result[1]}
        for result in search_results
    ]
    # print("formatted json_response: ", formatted_results)

    # Return the formatted results
    return formatted_results
