import io

import requests
import torch
from PIL import Image
from torchvision import transforms
from torchvision.models import resnet50, ResNet50_Weights  # Importing the ResNet50 model


def download_image(url):
    """
    Downloads an image from a URL and returns it as a PIL image.
    """
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad HTTP status

        # Create a BytesIO object from the response content
        image_stream = io.BytesIO(response.content)

        # Open the image using PIL and convert it to RGB format
        image = Image.open(image_stream).convert("RGB")

        return image

    except Exception as e:
        print(f"Error downloading image: {e}")
        return None


# def base64_image_decoder(image_base64):
#     """
#     Decode the Base64 string into an image.
#     :param image_base64: Base64-encoded image string
#     :return: rgb_image
#     """
#     try:
#         # Decode the Base64 string into bytes
#         image_bytes = base64.b64decode(image_base64)
#
#         # Create a BytesIO object from the decoded bytes
#         image_stream = io.BytesIO(image_bytes)
#
#         # Open the image using PIL (Pillow)
#         image = Image.open(image_stream)
#
#         rgb_image = image.convert("RGB")
#
#         # Print the image format and size
#         print(f"Image format: {image.format}, size: {image.size}")
#
#         return rgb_image  # Return the opened image for further processing
#
#     except Exception as e:
#         print(f"Error processing image: {e}")
#         return None


def generate_image_vector(original_image):
    """
    Generate a 2048-dimensional vector of images.

    parameters:
        model: Pre-trained ResNet50 model
        image_path (str): Image File Path

    Returns:
        numpy.ndarray: 2048-dimensional image vector
    """

    # Load the pre-trained ResNet50 model
    model = load_model()

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
        {"image_name": result[0], "product_id": result[1]}
        for result in search_results
    ]
    print("formatted json_response: ", formatted_results)

    # Return the formatted results
    return formatted_results

def load_model():
    """
    Loads the pre-trained ResNet50 model and sets it to evaluation mode.

    Returns:
        model: The loaded ResNet50 model.
    """
    # Use the recommended weights argument instead of pretrained
    weights = ResNet50_Weights.IMAGENET1K_V1  # Alternatively, use ResNet50_Weights.DEFAULT for the latest weights
    model = resnet50(weights=weights)  # Load the model with specified weights

    # Remove the last fully connected layer to get 2048-dimensional outputs
    model = torch.nn.Sequential(*list(model.children())[:-1])  # Keep all layers except the last one
    model.eval()  # Set the model to evaluation mode
    return model
