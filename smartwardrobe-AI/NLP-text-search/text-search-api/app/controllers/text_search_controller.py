from flask import Blueprint, request, jsonify
from app.services.text_search_service import perform_search

# Define a blueprint, similar to a sub-route
search_bp = Blueprint('textsearch', __name__)

@search_bp.route('/textsearch', methods=['POST'])
def search():
    try:
        # Retrieve search keywords from the request
        data = request.get_json()
        search_query = data.get('query', '')

        if not search_query:
            return jsonify({"error": "Search query is required"}), 400

        # Call the search functionality in the service layer
        results = perform_search(search_query)

        # Return the search results
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
