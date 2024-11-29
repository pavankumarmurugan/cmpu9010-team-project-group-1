import io

import cv2
import numpy as np
import requests
import torch
from PIL import Image
from scipy.spatial.distance import cosine
from skimage.feature import graycomatrix, graycoprops
from transformers import AutoModel, AutoProcessor

from vector_search.data_connection.image_search_model import connect_db

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
        image = Image.open(image_stream).convert("RGB")

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
            SELECT i.image_name,i.image_embedding <=> %s::vector AS distance
            FROM marqoclip_image_embedding i
            ORDER BY distance ASC
            LIMIT %s;
        """, (embedding_query, top_k))

        similar_items = cur.fetchall()

        # image_names = [result[0] for result in similar_items]  # Extract image_name

        # print(f"Found {len(similar_items)} similar items.")
        # print("similar_items: ", similar_items)

        return similar_items

    except Exception as e:
        print(f"Error performing search: {e}")
        return []
    finally:
        cur.close()


def generate_lowlevel_features(image):
    """Generate low-level features for query image."""
    image_np = np.array(image)

    # 1. color histogram
    hsv_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
    color_hist = cv2.calcHist([hsv_image], [0, 1, 2], None, [4, 4, 4], [0, 256, 0, 256, 0, 256])
    color_hist = cv2.normalize(color_hist, color_hist).flatten()
    # print("query_color_hist: ", color_hist)

    # 2. GLCM Texture characteristics
    gray_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    distances = [1, 2, 3]  # Use multiple distances
    angles = [0, np.pi / 4, np.pi / 2, 3 * np.pi / 4]  # Use multiple directions.
    glcm = graycomatrix(gray_image.astype(np.uint8), distances, angles)
    contrast = graycoprops(glcm, 'contrast')
    correlation = graycoprops(glcm, 'correlation')
    texture_features = np.hstack((contrast.flatten(), correlation.flatten()))
    # print("query_texture_features: ", texture_features)

    # 3. Perform Canny edge detection
    edges = cv2.Canny(gray_image, 50, 150)
    edge_density = np.mean(edges)
    # print("query_edge_density: ", edge_density)

    return color_hist, texture_features, edge_density


def fetch_lowlevel_features(top_k_images_dis):
    """Fetch and decode low-level features for a list of image names from the database."""
    image_names = [result[0] for result in top_k_images_dis]

    conn = connect_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT image_name, color_histogram, texture_features, edge_features
            FROM image_lowlevel_features
            WHERE image_name = ANY(%s::text[]);
        """, (image_names,))

        results = cur.fetchall()

        lowlevel_features = {}
        for row in results:
            image_name, color_hist, texture_features, edge_features = row

            # print("db_color_hist: ", color_hist)
            # print("db_texture_features: ", texture_features)
            # print("db_edge_features: ", edge_features)

            lowlevel_features[image_name] = (color_hist, texture_features, edge_features)

        # print("Decoded feature_dict length:", len(lowlevel_features))

        return lowlevel_features

    except Exception as e:
        print(f"Error fetching low-level features: {e}")
        return {}
    finally:
        cur.close()
        conn.close()


def calculate_feature_similarity(target_feature, candidate_feature, metric="cosine"):
    """Calculate similarity or distance between two feature vectors."""
    if metric == "cosine":
        return 1 - cosine(target_feature, candidate_feature)  # Cosine similarity
    elif metric == "euclidean":
        return np.linalg.norm(np.array(target_feature) - np.array(candidate_feature))  # Euclidean distance
    else:
        raise ValueError("Unsupported similarity metric: Choose 'cosine' or 'euclidean'.")


def reorder_results(top_k_images_dis, query_color_hist, query_texture, query_edge_density, lowlevel_features):
    """Reorder results using low-level feature similarity."""
    reordered_results = []

    detailed_results = []  # Detailed results for debugging

    for image_name, distance in top_k_images_dis:
        features = lowlevel_features.get(image_name)
        if not features:
            continue  # Skip if no features found

        color_hist_candidate, texture_candidate, edge_candidate = features

        # Convert list to np.array if necessary
        color_hist_candidate = np.array(color_hist_candidate) if isinstance(color_hist_candidate,
                                                                            list) else color_hist_candidate
        texture_candidate = np.array(texture_candidate) if isinstance(texture_candidate, list) else texture_candidate
        edge_candidate = np.array(edge_candidate)

        # print("color_hist_candidate: ", color_hist_candidate)
        # print("texture_candidate: ", texture_candidate)
        # print("edge_candidate: ", edge_candidate)

        # Calculate similarities
        color_similarity = calculate_feature_similarity(query_color_hist, color_hist_candidate, metric="cosine")
        texture_similarity = calculate_feature_similarity(query_texture, texture_candidate, metric="cosine")
        edge_similarity = 1 - abs(query_edge_density - edge_candidate[0])

        # Combine scores (weights can be adjusted)
        combined_score = (0.4 * (1 - distance) +
                          0.48 * color_similarity +
                          0.1 * texture_similarity +
                          0.02 * edge_similarity)

        reordered_results.append((image_name, combined_score))

    # ###################debugging#########################################################
    #     # Append detailed results for debugging
    #     detailed_results.append({
    #         "image_name": image_name,
    #         "distance": distance,
    #         "color_similarity": color_similarity,
    #         "texture_similarity": texture_similarity,
    #         "edge_similarity": edge_similarity,
    #         "combined_score": combined_score
    #     })
    #
    # detailed_results.sort(key=lambda x: x["combined_score"], reverse=True)
    #
    # # Print detailed results
    # for result in detailed_results:
    #     print(f"Image: {result['image_name']}, "
    #           f"Distance: {result['distance']:.8f}, "
    #           f"Color Similarity: {result['color_similarity']:.8f}, "
    #           f"Texture Similarity: {result['texture_similarity']:.8f}, "
    #           f"Edge Similarity: {result['edge_similarity']:.8f}, "
    #           f"Combined Score: {result['combined_score']:.8f}")
    #
    # # return detailed_results
    # ################debugging#########################################################

    # Sort by combined score
    reordered_results.sort(key=lambda x: x[1], reverse=True)
    # print("reordered_results: ", reordered_results)

    # Return both image names and combined scores
    return reordered_results
    # return [image[0] for image in reordered_results]


def fetch_product_ids(reordered_images_with_scores):
    """
    Fetch product IDs for reordered images.
    Returns only image_name and product_id in the order of combined_score.
    """
    # Extract image names in the order of combined scores
    image_names = [image[0] for image in reordered_images_with_scores]

    conn = connect_db()
    cur = conn.cursor()

    try:
        # Fetch mapping of image_name to product_id
        cur.execute("""
            SELECT image_name, id
            FROM products_2_image
            WHERE image_name = ANY(%s);
        """, (image_names,))
        results = dict(cur.fetchall())  # Directly map image_name to product_id

        # Return the result in the same order as the reordered images
        final_results = [{"image_name": name, "product_id": results.get(name)} for name in image_names]
        # print("final_results: ", final_results)
        return final_results

    except Exception as e:
        print(f"Error fetching product IDs: {e}")
        return []
    finally:
        cur.close()
        conn.close()

#########################################################
# def format_search_results(search_results):
#     """
#     Format the search results into a list of dictionaries.
#
#     Parameters:
#         search_results (list): List of tuples containing article_id, product_code, and distance.
#
#     Returns:
#         dict: JSON-compatible dictionary with the formatted results.
#     """
#     # print("original search_results: ", search_results)
#
#     # Format the results to match the required JSON structure
#     formatted_results = [
#         {"image_name": result[0], "product_id": result[1]}
#         for result in search_results
#     ]
#     # print("formatted json_response: ", formatted_results)
#
#     # Return the formatted results
#     return formatted_results
#########################################################
