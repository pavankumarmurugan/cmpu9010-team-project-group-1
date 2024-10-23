from flask import Flask, request, jsonify

from image_search.db import search_similar_images
from image_search.utils import preprocess_image, format_search_results

app = Flask(__name__)

# Test Route
@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, this is your Flask API!"})

# Route to handle Base64 image input
@app.route('/search', methods=['POST'])
def search_image():
    # Parse JSON request body
    data = request.json

    # Get the image data and MIME type
    image_base64 = data.get('image', {}).get('data')
    image_mime = data.get('image', {}).get('mime')

    print(image_base64)
    print(image_mime)

    try:
        TOP_K = 10  # Number of similar images to retrieve
        # Process the image and get the vector
        searchable_vector = preprocess_image(image_base64, image_mime)

        # Search similar images in the database
        search_results = search_similar_images(searchable_vector, TOP_K)

        # Format the search results
        formatted_results = format_search_results(search_results)

    except Exception as e:
        return jsonify({"Error": str(e)}), 500

    # Return the results in JSON format
    return jsonify(formatted_results), 200

if __name__ == '__main__':
    app.run(debug=True)

# flask --app app run