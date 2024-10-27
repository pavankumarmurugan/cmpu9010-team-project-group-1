from flask import Flask, request, jsonify

from image_search.db import search_similar_images
from image_search.utils import download_image, generate_image_vector, format_search_results

app = Flask(__name__)

# Test Route
@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, this is your Flask API!"})

# Route to handle Base64 image input
@app.route('/search', methods=['POST'])
def search_image():
    data = request.json  # Parse JSON request body
    TOP_K = 10  # Number of similar images to retrieve

    # Determine if the input is a Base64-encoded image or an image URL
    # image_base64 = data.get('image', {}).get('data')
    image_url = data.get('image_url')
    # image_mime = data.get('image', {}).get('mime')

    # print(image_base64)
    print("image_url: ", image_url)

    original_image = download_image(image_url)

    try:
        # Ensure image_url is provided
        if not image_url:
            return jsonify({"Error": "Please provide an valid 'image_url' for processing."}), 400

        """
        # Process the image based on the provided format
        # if image_url:
        #     original_image = download_image(image_url)
        # # elif image_base64:
        # #     original_image = base64_image_decoder(image_base64)
        # else:
        #     return jsonify({"Error": "No valid image input found"}), 400
        """

        # Process the image and get the vector
        searchable_vector = generate_image_vector(original_image)

        # Search similar images in the database
        search_results = search_similar_images(searchable_vector, TOP_K)

        # Format the search results
        formatted_results = format_search_results(search_results)

    except Exception as e:
        return jsonify({"Error": str(e)}), 500

    # Return the results in JSON format
    return jsonify(formatted_results), 200


if __name__ == '__main__':
    # image_search.run(debug=True)
    app.run(host='0.0.0.0', port=9090)

# flask --image_search image_search run --host=0.0.0.0 --port=9090
