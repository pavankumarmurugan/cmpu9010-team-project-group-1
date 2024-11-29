from vector_search.models.image_search_model import connect_db
from vector_search.utils import generate_image_vector, format_search_results, download_image


def perform_image_search(image_url, TOP_K):

    original_image = download_image(image_url)

    # Process the image and get the vector
    searchable_vector = generate_image_vector(original_image)

    # Search similar images in the database
    search_results = search_similar_images(searchable_vector, TOP_K)

    # Format the search results
    formatted_results = format_search_results(search_results)

    return formatted_results


def search_similar_images(input_vector, top_k):
    """
    Search for similar images in the database using pgvector.
    Args:
        input_vector (list): The 2048-dimensional input vector.
        top_k (int): The number of most similar images to retrieve.
    Returns:
        list: A list of tuples containing image_names and distances.
    """
    connection = connect_db()  # Connect to the database

    # cosine distance (<=>)
    query = """
    SELECT i.image_name, p.id, i.vector <=> %s AS distance
    FROM image_info_image_search i
    LEFT JOIN products_2_image p ON i.image_name = p.image_name
    ORDER BY distance
    LIMIT %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (input_vector, top_k))  # Execute the query
        results = cursor.fetchall()

    connection.close()  # Close the connection

    return results