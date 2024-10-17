import base64
import io

import numpy as np
import psycopg2
import torch
from PIL import Image
from fastapi import FastAPI, HTTPException
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from torchvision import models, transforms

app = FastAPI()

# Load the pre-trained ResNet-50 model
model = models.resnet50(pretrained=True)
model.eval()

# Image preprocessing steps to match the ResNet-50 model input requirements
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Database connection (PostgreSQL with pgvector)
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        dbname="imageSearch",
        user="root",
        password="root"
    )
    return conn

# Convert base64 encoded images to PIL Image format
def base64_to_image(base64_str: str) -> Image.Image:
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    return image

# Extract feature vectors from image
def extract_features(image: Image.Image) -> np.ndarray:
    img_tensor = preprocess(image).unsqueeze(0)  # 加上batch维度
    with torch.no_grad():
        features = model(img_tensor).numpy()
    return features

# Perform vector similarity queries in PostgreSQL using the pgvector extension
def find_top_similar_items(query_vector: np.ndarray, top_n: int = 20):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)


    query_vector_str = ','.join(map(str, query_vector.flatten()))

    # Use pgvector's vector distance query '<=>' to calculate cosine similarity
    sql = f"""
    SELECT product_id, feature_vector 
    FROM product_features 
    ORDER BY feature_vector <=> '[{query_vector_str}]' 
    LIMIT {top_n};
    """
    cursor.execute(sql)
    results = cursor.fetchall()
    conn.close()
    return results


class ImageSearchRequest(BaseModel):
    image_base64: str

@app.post("/image-search/")
async def image_search(request: ImageSearchRequest):
    try:

        image = base64_to_image(request.image_base64)

        query_vector = extract_features(image)

        top_similar_items = find_top_similar_items(query_vector)

        return {"top_similar_items": top_similar_items}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")
