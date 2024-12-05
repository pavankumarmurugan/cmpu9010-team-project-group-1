from vector_search.utilities.main_color_feature import match_images_by_color, reorder_results_by_color
from vector_search.utilities.fetch_product_ids import fetch_product_ids

from vector_search.utilities.utils import download_image, image_processor, perform_search, \
    generate_lowlevel_features, fetch_lowlevel_features, reorder_results


def perform_image_search(image_url, TOP_K):
    # Step 1: Download images and generate vectors
    # download image from url
    original_image = download_image(image_url)
    # Process the image and get the vector
    searchable_vector = image_processor(original_image)

    # Step 2: Generating low-level features
    # query_color_hist, query_texture, query_edge_density = generate_lowlevel_features(original_image)

    # Step 3: Database search Top-K image vectors
    # Search similar images in the database
    top_k_images_dis = perform_search(searchable_vector, TOP_K)

    ####################reordered_by_color###############################################
    db_image_color_feature=match_images_by_color(top_k_images_dis)

    reordered_results_by_color = reorder_results_by_color(top_k_images_dis, original_image, db_image_color_feature)

    final_results_with_product_id = fetch_product_ids(reordered_results_by_color)

    return final_results_with_product_id

    ########################reordered_by_lowlevel_feature########################################
    # # Step 4: Batch acquisition of low-level features
    # lowlevel_features = fetch_lowlevel_features(top_k_images_dis)
    #
    # # Step 5: Implementation of re-ranking
    # reordered_results = reorder_results(top_k_images_dis, query_color_hist, query_texture, query_edge_density,
    #                                     lowlevel_features)
    #
    # # Step 6: Get product_id
    # final_results_with_product_id = fetch_product_ids(reordered_results)
    #
    # return final_results_with_product_id

    ############################################################################
    ############################################################################
    # Format the search results
    # formatted_results = format_search_results(final_results_product_id)
    ############################################################################
