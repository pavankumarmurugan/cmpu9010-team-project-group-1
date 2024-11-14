from transformers import CLIPProcessor, CLIPModel
import torch
from PIL import Image
import os
import numpy as np
import pickle
import faiss
import cv2
from sklearn.cluster import KMeans
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"


# Initialize CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Paths to save pickled data
pickle_file = 'clip_image_features.pkl'
faiss_index_file = 'clip_faiss_index.index'

# Initialize global variables
image_features = {}  # Store features globally
image_data = []      # Store image metadata globally

# Feature extraction function using CLIP
def extract_clip_features(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            features = model.get_image_features(**inputs)
        return features.numpy().flatten()
    except (IOError, Image.UnidentifiedImageError) as e:
        print(f"Skipping invalid image {image_path}: {e}")
        return None

# Extract dominant color using OpenCV
def get_dominant_color(image_path):
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pixels = np.float32(image.reshape(-1, 3))
    _, labels, palette = cv2.kmeans(pixels, 1, None,
                                    criteria=(cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0),
                                    attempts=10, flags=cv2.KMEANS_RANDOM_CENTERS)
    dominant_color = palette[0]  # Returns as [R, G, B]
    return tuple(dominant_color)

# Tagging for pattern/style using CLIP with specific prompts
def get_style_tags(image_path):
    tags = ["solid color", "striped", "logo", "graphic"]
    image = Image.open(image_path).convert("RGB")
    inputs = processor(text=tags, images=image, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1)  # Get probabilities
    best_tag = tags[probs.argmax()]  # Select highest probability tag
    return best_tag

# Function to process images, extract features, and build FAISS index
def get_clip_image_features(image_directory):
    global image_features, image_data  # Access the global variables

    # Check if features have already been computed and saved
    if os.path.exists(pickle_file):
        print("Loading CLIP image features from pickle file...")
        with open(pickle_file, 'rb') as f:
            image_features, image_data = pickle.load(f)
    else:
        print("Extracting features for images...")
        image_features = {}
        image_data = []

        # Process each image in the directory
        for image_name in os.listdir(image_directory):
            if image_name.endswith(('.jpg', '.jpeg', '.png')):
                print(f"Processing image: {image_name}")
                image_path = os.path.join(image_directory, image_name)

                # Extract CLIP features
                features = extract_clip_features(image_path)
                if features is None:
                    # Skip this image if features could not be extracted
                    continue

                # Store features and extract additional attributes
                image_features[image_name] = features
                dominant_color = get_dominant_color(image_path)
                style_tag = get_style_tags(image_path)

                # Append metadata for each valid image
                image_data.append({
                    "image_name": image_name,
                    "clip_embedding": features,
                    "color": dominant_color,
                    "style": style_tag
                })

        # Save features and metadata to a pickle file
        with open(pickle_file, 'wb') as f:
            pickle.dump((image_features, image_data), f)
        print("Features and metadata saved to pickle file.")

    # Convert features dictionary to a matrix for FAISS
    feature_matrix = np.array(list(image_features.values()))

    # Normalize features for cosine similarity
    feature_matrix = np.array([x / np.linalg.norm(x) for x in feature_matrix])

    # Build FAISS index with cosine similarity
    d = feature_matrix.shape[1]
    index = faiss.IndexFlatIP(d)  # Inner product for cosine similarity
    index.add(feature_matrix)

    # Save the FAISS index
    faiss.write_index(index, faiss_index_file)
    print("FAISS index saved to file.")

    return index, image_data, feature_matrix

# Directory where your images are stored
image_directory = '/Users/salilluley/workspace/recommendation_sytem/image'
faiss_index, image_data, feature_matrix = get_clip_image_features(image_directory)

# Clustering for grouping similar items
def cluster_features(feature_matrix, num_clusters=10):
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    labels = kmeans.fit_predict(feature_matrix)
    return labels

# Assign each image a cluster label
cluster_labels = cluster_features(feature_matrix)
if len(cluster_labels) != len(image_data):
    print("Error: The number of cluster labels does not match the number of images.")
else:
    for i, image in enumerate(image_data):
        image['cluster'] = int(cluster_labels[i])  # Convert to int for clarity

# Update pickle file to include cluster labels
with open(pickle_file, 'wb') as f:
    pickle.dump((image_features, image_data), f)
print("Updated image data with clusters saved to pickle file.")
