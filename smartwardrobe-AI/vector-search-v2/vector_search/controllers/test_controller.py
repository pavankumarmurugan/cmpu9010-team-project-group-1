from flask import Blueprint, jsonify

test_bp = Blueprint('test', __name__)
# Test Route
@test_bp.route('/')
def hello_world():
    return jsonify({"message": "Hello, this is your Flask API!"})