from vector_search.utils import format_search_results, download_image, image_processor, perform_search


def perform_image_search(image_url, TOP_K):
    # download image from url
    original_image = download_image(image_url)

    # Process the image and get the vector
    searchable_vector = image_processor(original_image)

    # Search similar images in the database
    search_results = perform_search(searchable_vector, TOP_K)

    # Format the search results
    formatted_results = format_search_results(search_results)

    return formatted_results
