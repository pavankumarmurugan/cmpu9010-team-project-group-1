import torch  # PyTorch

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
