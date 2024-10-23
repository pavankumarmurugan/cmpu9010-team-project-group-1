# Importing the necessary libraries
import logging  # Logging module
import os  # For working with files and directories

import psycopg2  # PostgreSQL database adapter
import torch  # PyTorch
import torchvision.transforms as transforms  # image transformation
from PIL import Image  # image processing library
from torchvision.models import resnet50, ResNet50_Weights  # Importing the ResNet50 model


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

def preprocess_image(image_path):
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

    image = Image.open(image_path).convert("RGB")  # Read images and convert to RGB format
    image_tensor = transform(image).unsqueeze(0)  # Add Batch Dimension
    return image_tensor

def generate_image_vector(model, image_path):
    """
    Generate a 2048-dimensional vector of images.

    parameters:
        model: Pre-trained ResNet50 model
        image_path (str): Image File Path

    Returns:
        numpy.ndarray: 2048-dimensional image vector
    """
    image_tensor = preprocess_image(image_path)  # Preprocessed images
    with torch.no_grad():  # Disable gradient calculation
        vector = model(image_tensor).numpy()  # Generate vectors using models and convert to numpy arrays
    return vector.flatten()  # Flatten vectors for easy storage

# Configure logging
logging.basicConfig(filename='image_vector_insertion.log', level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def insert_vector_to_db(connection, image_name, vector):
    """
    Inserts image vectors into a PostgreSQL database.

    parameters:
        connection: PostgreSQL Database Connection
        image_name (str): Image file name (no extension)
        vector (numpy.ndarray): 2048-dimensional image vector

    Returns:
        bool: True if the insertion is successful, False if there's a duplicate key error
    """

    try:
        cursor = connection.cursor()  # Create database cursor
        # Perform an insertion operation
        cursor.execute(
            "INSERT INTO image_info (image_name, image_path, vector) VALUES (%s, %s, %s)",
            (image_name, None, vector.tolist())  # image_path temporarily empty
        )
        connection.commit()  # Commit the transaction
        cursor.close()  # Close cursor
        return True  # Indicate successful insertion

    except psycopg2.errors.UniqueViolation:  # Catch the unique constraint violation error
        connection.rollback()  # Rollback the transaction
        logging.error(f"Duplicate entry for image_name: {image_name}. Skipping insertion.")
        print(f"Duplicate entry for image '{image_name}'. Skipping insertion.")
        return False  # Indicate failure due to duplicate key error

    except Exception as e:  # Catch any other database-related errors
        connection.rollback()  # Rollback the transaction
        logging.error(f"Error inserting image {image_name}: {str(e)}")
        print(f"Error inserting image '{image_name}': {str(e)}")
        return False  # Indicate failure

def count_subdirectories_and_images(image_dir):
    """
    Count the total number of subdirectories and images in the specified directory.

    Parameters:
        image_dir (str): Root directory of the image files

    Returns:
        total_subdirs (int): Total number of subdirectories
        total_images (int): Total number of images
    """
    total_subdirs = 0
    total_images = 0

    for root, dirs, files in os.walk(image_dir):
        # Count subdirectories
        total_subdirs += len(dirs)
        # Count image files (only .jpg, .jpeg, .png)
        total_images += len([file for file in files if file.endswith(('.jpg', '.jpeg', '.png'))])

    # print(f"Total number of subdirectories: {total_subdirs}")
    # print(f"Total number of images: {total_images}")

    return total_subdirs, total_images

# Example usage
# image_dir = '/Users/Tommy/AI/image-search/image-search-pgvector/image-test'
# subdirs, images = count_subdirectories_and_images(image_dir)
# print(f"Total number of subdirectories: {subdirs}")
# print(f"Total number of images: {images}")

def process_images_in_directory(image_dir, model, connection):
    """
    Recursively read all the images in the catalog and insert their vectors into the database.

    Parameters:
        image_dir (str): Root directory of the image files
        model: Pre-trained ResNet50 model
        connection: PostgreSQL database connection
    """
    for root, _, files in os.walk(image_dir):
        # Filter the files to include only images
        image_files = [file for file in files if file.endswith(('.jpg', '.jpeg', '.png'))]

        for file in image_files:
            image_path = os.path.join(root, file)  # Get the full image path
            print(f"Processing {image_path}...")  # Print the path of the image being processed

            vector = generate_image_vector(model, image_path)  # Generate image vectors

            image_name = os.path.splitext(file)[0]  # Use the file name (without extension) as the ID

            # Write to the database and check if insertion succeeded
            success = insert_vector_to_db(connection, image_name, vector)

            if not success:  # Skip to the next image if insertion failed due to duplication
                continue

# main embedding function
def main(image_dir):
    """
    main function that executes the entire process.

    parameters:
        image_dir (str): Root directory of the image file
    """
    # TODO: Add error handling: database connection error
    # Connecting to a PostgreSQL Database
    connection = psycopg2.connect(
        dbname='imageSearch',  # database name
        user='postgres',  # user ID
        password='test-postgres',  # cryptographic
        host='localhost',  # RDSTerminal node of the instance
        port='5432'  # PostgreSQL ports
    )

    model = load_model()  # Loading Models

    # count_subdirectories_and_images(image_dir)  # Count the number of subdirectories and images
    subdirs, images = count_subdirectories_and_images(image_dir)
    print(f"Total number of subdirectories: {subdirs}")
    print(f"Total number of images: {images}")

    process_images_in_directory(image_dir, model, connection)  # process image

    connection.close()  # Close the database connection


if __name__ == '__main__':
    # Execute the main function with the image directory as an argument
    main('/Users/Tommy/AI/image-search/clothing-images')  # Image directory path