from flask import Blueprint, request, jsonify

from vector_search.services.image_search_service import perform_image_search

search_im = Blueprint('imagesearch', __name__)

@search_im.route('/image-search', methods=['POST'])
def search_image():
    TOP_K = 100  # Number of similar images to retrieve

    data = request.json  # Parse JSON request body
    image_url = data.get('image_url')

    # print(image_base64)
    print("image_url: ", image_url)

    try:
        # Ensure image_url is provided
        if not image_url:
            return jsonify({"Error": "Please provide an valid 'image_url' for processing."}), 400

        formatted_results = perform_image_search(image_url, TOP_K)

    except Exception as e:
        return jsonify({"Error": str(e)}), 500

    # Return the results in JSON format
    return jsonify(formatted_results), 200