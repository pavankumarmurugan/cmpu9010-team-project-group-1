import base64
import io

import torch
from PIL import Image
from torchvision import transforms

from image_search.model import load_model


def preprocess_image(image_base64, image_mime):
    """
    1. Decode a Base64 string to a PIL image.
    2. generate a 2048-dimensional vector of images.
    3. Search for similar images in the database.
    """

    # Decode the Base64 image
    original_image = base64_image_decoder(image_base64)

    # Load the pre-trained ResNet50 model
    model = load_model()

    # Generate a 2048-dimensional vector of images
    searchable_vector = generate_image_vector(model, original_image)

    return searchable_vector

def base64_image_decoder(image_data):
    try:
        # Decode the Base64 string into bytes
        image_bytes = base64.b64decode(image_data)

        # Create a BytesIO object from the decoded bytes
        image_stream = io.BytesIO(image_bytes)

        # Open the image using PIL (Pillow)
        image = Image.open(image_stream)

        rgb_image = image.convert("RGB")

        # Print the image format and size
        print(f"Image format: {image.format}, size: {image.size}")

        return rgb_image  # Return the opened image for further processing

    except Exception as e:
        print(f"Error processing image: {e}")
        return None

def generate_image_vector(model, original_image):
    """
    Generate a 2048-dimensional vector of images.

    parameters:
        model: Pre-trained ResNet50 model
        image_path (str): Image File Path

    Returns:
        numpy.ndarray: 2048-dimensional image vector
    """
    image_tensor = process_image(original_image)  # Preprocessed images to get image_tensor
    with torch.no_grad():  # Disable gradient calculation
        image_vector = model(image_tensor).numpy()  # Generate vectors using models and convert to numpy arrays

    # extra vector processing for pgsql querying
    flattened_image_vector = image_vector.flatten()  # Flatten vectors for easy storage
    vector_str = ','.join(map(str, flattened_image_vector))  # Create a string of comma-separated values
    formated_vector_str = f'[{vector_str}]'  # Format the string as a list

    return formated_vector_str


def process_image(original_image):
    """
    Preprocess the image.

    parameters:
        image_path (str): Image File Path

    Returns:
        torch.Tensor: Preprocessed image tensor
    """
    # Defining Image Transformation Operations
    transform = transforms.Compose([
        transforms.Resize(256),  # Resizing images
        transforms.CenterCrop(224),  # Center Cropped Image
        transforms.ToTensor(),  # Converting images to tensors
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),  # standardization
    ])

    # rgb_image = Image.open(original_image).convert("RGB")  # Read images and convert to RGB format

    image_tensor = transform(original_image).unsqueeze(0)  # Add Batch Dimension
    return image_tensor

def format_search_results(search_results):
    """
    Format the search results into a list of dictionaries.

    Parameters:
        search_results (list): List of tuples containing article_id, product_code, and distance.

    Returns:
        dict: JSON-compatible dictionary with the formatted results.
    """
    print("original search_results: ", search_results)

    # Format the results to match the required JSON structure
    formatted_results = [
        {"article_id": result[0], "product_code": result[1]}
        for result in search_results
    ]
    print("formatted json_response: ", formatted_results)

    # Return the formatted results
    return formatted_results
