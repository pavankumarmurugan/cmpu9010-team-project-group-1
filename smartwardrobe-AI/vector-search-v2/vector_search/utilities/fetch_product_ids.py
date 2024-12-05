from vector_search.data_connection.image_search_model import connect_db


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
