from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import torch.nn.functional as F

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})
# Load your PyTorch model
model = torch.load('./best.pt')
model.eval()

# Define image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from the request
        image = request.files['image']
        img = Image.open(image).convert('RGB')
        img_tensor = preprocess(img)
        img_tensor = img_tensor.unsqueeze(0)  # Add batch dimension

        # Make prediction
        with torch.no_grad():
            output = model(img_tensor)

        # Apply softmax to get probabilities
        probabilities = F.softmax(output, dim=1)

        # Get the predicted class indices
        _, predicted_classes = torch.topk(probabilities, k=2)

        # Convert class indices to class labels
        class_labels = {0: 'No Hand', 1: 'Hand'}

        # Get detailed information for each detected object
        predictions = []
        for i, class_index in enumerate(predicted_classes.squeeze()):
            confidence = probabilities[0][class_index].item()

            # Assuming you have a function to get bounding box coordinates from the model
            bbox = get_bounding_box_from_model(model, img_tensor, class_index)

            # Create a prediction dictionary
            prediction = {
                "class": class_labels[class_index],
                "confidence": confidence,
                "bbox": {
                    "x": bbox[0],
                    "y": bbox[1],
                    "width": bbox[2],
                    "height": bbox[3],
                },
            }

            predictions.append(prediction)
        output = model(img_tensor)
        # print(output.shape)
        output_list = output.tolist()

        return jsonify({'result': 'success', 'predictions': output_list})
        # return jsonify({'result': 'success', 'predictions': predictions})
    except Exception as e:
        return jsonify({'result': 'error', 'message': str(e)})

def get_bounding_box_from_model(model, img_tensor, class_index):
    # Implement this function to get bounding box coordinates from your model
    # You'll need to extract the relevant information from the model's output
    # and convert it to the format (x, y, width, height) based on your model's design.
    # This might involve post-processing steps or accessing specific layers of the model.
    # The example assumes you have such a function, but you may need to customize it.

    # For simplicity, return a placeholder bounding box (modify this based on your needs)
    return [0, 0, 100, 100]

if __name__ == '__main__':
    app.run(debug=True, port=5000)

