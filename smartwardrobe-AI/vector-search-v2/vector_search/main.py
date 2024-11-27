from flask import Flask

app = Flask(__name__)

def create_app():
    # Register routes
    from vector_search.controllers.test_controller import test_bp
    app.register_blueprint(test_bp)

    from vector_search.controllers.text_search_controller import search_bp
    app.register_blueprint(search_bp)

    from vector_search.controllers.image_search_controller import search_im
    app.register_blueprint(search_im)

    return app

# Create a Flask application
app = create_app()

if __name__ == '__main__':
    # vector_search.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
