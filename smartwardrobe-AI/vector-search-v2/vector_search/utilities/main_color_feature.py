import json

import cv2
import numpy as np
from sklearn.cluster import KMeans

from vector_search.data_connection.image_search_model import connect_db


# def extract_main_colors(image):
#     """Extract the main colors from an image."""
#     image_np = np.array(image)
#     # Convert image to HSV
#     hsv_image = cv2.cvtColor(image_np, cv2.COLOR_BGR2HSV)
#     pixels = hsv_image.reshape((-1, 3))  # Flatten image data
#
#     # Apply KMeans to find main colors
#     n_colors = 3  # Default to 3 colors
#     kmeans = KMeans(n_clusters=n_colors, random_state=42)
#     kmeans.fit(pixels)
#
#     # Get the main colors and their proportions
#     main_colors = kmeans.cluster_centers_
#     color_proportions = np.bincount(kmeans.labels_) / len(kmeans.labels_)
#
#     # Sort the colors by proportion (largest to smallest)
#     sorted_indices = np.argsort(-color_proportions)
#
#     main_colors = main_colors[sorted_indices]
#     color_proportions = color_proportions[sorted_indices]

def extract_main_colors(image):
    """Extract the main colors from an image."""

    # Ensure the image is a numpy array
    image_np = np.array(image)

    # Step 2: Convert to grayscale
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    # Step 3: Apply Canny edge detection
    edges = cv2.Canny(gray, threshold1=50, threshold2=150)

    # Step 4: Find contours and isolate the largest one (short-sleeve region)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [contour], -1, (255), thickness=cv2.FILLED)

    # Step 5: Apply the mask to the original image
    # Convert mask to 3 channels to match image_np dimensions
    mask_3channel = cv2.merge([mask, mask, mask])
    isolated_image = cv2.bitwise_and(image_np, mask_3channel)

    # Step 6: Extract dominant colors
    hsv_image = cv2.cvtColor(isolated_image, cv2.COLOR_BGR2HSV)
    non_black_mask = cv2.inRange(isolated_image, (1, 1, 1), (255, 255, 255))
    isolated_pixels = hsv_image[non_black_mask > 0]

    # Use KMeans to cluster colors
    kmeans = KMeans(n_clusters=3, random_state=42)  # Adjust n_clusters as needed
    kmeans.fit(isolated_pixels)
    main_colors = kmeans.cluster_centers_[:, :3]  # HSV values
    color_proportions = np.bincount(kmeans.labels_) / len(kmeans.labels_)

    # Sort the colors by proportion (largest to smallest)
    sorted_indices = np.argsort(-color_proportions)

    main_colors = main_colors[sorted_indices]
    color_proportions = color_proportions[sorted_indices]

    return main_colors, color_proportions


def match_images_by_color(top_k_images_dis):
    """Match images based on color similarity."""
    image_names = [result[0] for result in top_k_images_dis]

    conn = connect_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT image_name, main_colors, color_proportions 
            FROM image_main_colors
            WHERE image_name = ANY(%s::text[]);
            """, (image_names,))

        results = cur.fetchall()
        print(f"Found {len(results)} matching images.")
        # print("results: ", results)

        # Parse stored main colors and proportions
        db_image_color_feature = {}
        # for image_name, main_colors_json, proportions_json in results:
        #     main_colors = np.array(json.loads(main_colors_json))
        #     proportions = np.array(json.loads(proportions_json))
        #
        #     db_image_color_feature[image_name] = (main_colors, proportions)

        for image_name, main_colors_json, proportions_json in results:
            try:
                # If the data is already a list (from jsonb), use it directly
                main_colors = np.array(main_colors_json) if isinstance(main_colors_json, list) else np.array(
                    json.loads(main_colors_json))
                proportions = np.array(proportions_json) if isinstance(proportions_json, list) else np.array(
                    json.loads(proportions_json))
                db_image_color_feature[image_name] = (main_colors, proportions)
            except Exception as e:
                print(f"Error parsing colors for image {image_name}: {e}")
                continue

        # print(f"db_image_color_feature: {db_image_color_feature}")

        return db_image_color_feature

    except Exception as e:
        print(f"Error matching images: {e}")
        return {}
    finally:
        cur.close()
        conn.close()


def calculate_color_similarity(query_colors, query_proportions, db_colors, db_proportions):
    """Calculate the similarity between query image and database image colors."""
    similarity_score = 0.0
    for q_color, q_prop in zip(query_colors, query_proportions):
        color_distances = np.linalg.norm(db_colors - q_color, axis=1)
        best_match_idx = np.argmin(color_distances)
        best_match_distance = color_distances[best_match_idx]
        db_prop = db_proportions[best_match_idx]

        # Inverse of distance weighted by proportions
        similarity_score += (1 / (1 + best_match_distance)) * min(q_prop, db_prop)

    return similarity_score


def reorder_results_by_color(top_k_images_dis, query_image, db_image_color_feature):
    """Reorder the results based on color similarity."""

    query_colors, query_proportions = extract_main_colors(query_image)

    reordered_results = []
    detailed_results = []  # Detailed results for debugging

    for image_name, distance in top_k_images_dis:
        image_color_feature = db_image_color_feature.get(image_name)
        if not image_color_feature:
            continue  # Skip if no features found

        db_colors, db_proportions = image_color_feature

        # Calculate color similarity
        color_similarity = calculate_color_similarity(query_colors, query_proportions, db_colors, db_proportions)

        # Combine original model's distance and color similarity
        combined_score = ((1 - distance) * 0.4 + color_similarity * 0.6)
        # combined_score = (distance * 0.4 + color_similarity * 0.6)

        reordered_results.append((image_name, combined_score))

    #################debugging###############################################################
    #     # Detailed results for debugging
    #     detailed_results.append({
    #         "image_name": image_name,
    #         "distance": distance,
    #         "color_similarity": color_similarity,
    #         "combined_score": combined_score
    #     })

    # # Sort results by combined score
    # detailed_results.sort(key=lambda x: x["combined_score"], reverse=True)

    # # Print detailed results
    # for detail in detailed_results:
    #     print(f"Image: {detail['image_name']}, "
    #           f"Distance: {detail['distance']:.8f}, "
    #           f"Color Similarity: {detail['color_similarity']:.8f}, "
    #           f"Combined Score: {detail['combined_score']:.8f}")
    #################debugging###############################################################

    reordered_results.sort(key=lambda x: x[1], reverse=True)

    return reordered_results
