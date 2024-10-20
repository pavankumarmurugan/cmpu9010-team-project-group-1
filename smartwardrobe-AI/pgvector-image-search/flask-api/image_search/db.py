import psycopg2

# Connecting to a PostgreSQL Database
def connect_db():
    connection = psycopg2.connect(
        dbname='imageSearch',  # database name
        user='postgres',  # user ID
        password='test-postgres',  # cryptographic
        host='localhost',  # RDSTerminal node of the instance
        port='5432'  # PostgreSQL ports
    )
    return connection

# Search for similar images in the database using pgvector
def search_similar_images(input_vector, top_k):
    """
    Search for similar images in the database using pgvector.
    Args:
        input_vector (list): The 2048-dimensional input vector.
        top_k (int): The number of most similar images to retrieve.
    Returns:
        list: A list of tuples containing image_names and distances.
    """
    connection = connect_db() # Connect to the database

    # cosine distance (<=>)
    query = """
    SELECT image_name, vector <=> %s AS distance
    FROM image_info
    ORDER BY distance
    LIMIT %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (input_vector, top_k))  # Execute the query
        results = cursor.fetchall()

    connection.close() # Close the connection

    return results
