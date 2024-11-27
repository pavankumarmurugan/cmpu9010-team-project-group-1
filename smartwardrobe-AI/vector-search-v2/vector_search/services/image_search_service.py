from vector_search.utils import download_image, image_processor, perform_search, \
    generate_lowlevel_features, fetch_lowlevel_features, reorder_results, fetch_product_ids


def perform_image_search(image_url, TOP_K):
    # Step 1: Download images and generate vectors
    # download image from url
    original_image = download_image(image_url)
    # Process the image and get the vector
    searchable_vector = image_processor(original_image)

    # Step 2: Generating low-level features
    query_color_hist, query_texture, query_edge_density = generate_lowlevel_features(original_image)

    # Step 3: Database search Top-K image vectors
    # Search similar images in the database
    top_k_images_dis = perform_search(searchable_vector, TOP_K)

    # Step 4: Batch acquisition of low-level features
    lowlevel_features = fetch_lowlevel_features(top_k_images_dis)

    # Step 5: Implementation of re-ranking
    reordered_results = reorder_results(top_k_images_dis, query_color_hist, query_texture, query_edge_density,
                                        lowlevel_features)

    # Step 6: Get product_id
    final_results_product_id = fetch_product_ids(reordered_results)

    return final_results_product_id

    ##############################################################################################################
    # Format the search results
    # formatted_results = format_search_results(final_results_product_id)
