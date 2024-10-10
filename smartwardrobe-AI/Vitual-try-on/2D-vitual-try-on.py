

from gradio_client import Client, handle_file
import shutil
import os

# Initialize the client with the specific model on Hugging Face
client = Client("levihsu/OOTDiffusion")

# Define the function to call the API
def virtual_try_on(vton_img_url, garm_img_url, category=None, n_samples=1, n_steps=10, image_scale=2, seed=-1, api_name="/process_hd"):
    try:
        # Calling the predict function on the API
        result = client.predict(
            vton_img=handle_file(vton_img_url),
            garm_img=handle_file(garm_img_url),
            category=category,        # Optional category (e.g., "Upper-body")
            n_samples=n_samples,      # Number of samples to generate
            n_steps=n_steps,          # Number of diffusion steps
            image_scale=image_scale,  # Scaling factor for the output image
            seed=seed,                # Random seed for reproducibility, -1 for random
            api_name=api_name         # API endpoint to call
        )
        return result

    except Exception as e:
        print(f"Error during API call: {e}")
        return None

# Example calls to the API
# First API Call
result_1 = virtual_try_on(
    vton_img_url='https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/2e0cca23e744c036b3905c4b6167371632942e1c/model_1.png',
    garm_img_url='https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/180d4e2a1139071a8685a5edee7ab24bcf1639f5/03244_00.jpg',
    api_name="/process_hd"  # API for high-definition try-on process
)

# Print result from the first API call
print("Result from the first virtual try-on:", result_1)

# Second API Call
result_2 = virtual_try_on(
    vton_img_url='https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/aa9673ab8fa122b9c5cdccf326e5f6fc244bc89b/model_8.png',
    garm_img_url='https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/17c62353c027a67af6f4c6e8dccce54fba3e1e43/048554_1.jpg',
    category="Upper-body",  # Specify the category for this call
    api_name="/process_dc"  # API for another try-on process
)

# Step 4: Handle the result and copy the image to the current working directory
if result_2 and 'image' in result_2[0]:
    image_path = result_2[0]['image']
    print(f"Result image saved at: {image_path}")
    
    # Define the destination path for the image
    destination_path = "/Users/janezhang/final--project/pavan/output_image.webp"
    
    try:
        # Copy the image from the temporary folder to the current working directory
        shutil.copy(image_path, destination_path)
        print(f"Image copied to {destination_path}")
        
        # Check if the image exists in the new location
        if os.path.exists(destination_path):
            print(f"Image is now available at {destination_path}. You can open it to view the result.")
        else:
            print("Error: Image could not be copied to the current working directory.")
            
    except Exception as e:
        print(f"Error during image copy: {e}")
else:
    print("No valid image in the result.")
