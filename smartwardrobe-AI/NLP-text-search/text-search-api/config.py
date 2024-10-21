import os

class Config:
    DATABASE = {
        'dbname': os.getenv('DB_NAME', 'imageSearch'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', 'root'),
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
    }
