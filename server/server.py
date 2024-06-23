from flask import Flask, jsonify, request
from flask_cors import CORS
from ai import predict
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route("/api/predict", methods=["POST"])
def predictGender():
    try:
        data = request.json
        path_url = data.get("img_path")

        # Extract the base64 encoded image data
        _, encoded_data = path_url.split(",", 1)

        # Decode the base64 data
        decoded_data = base64.b64decode(encoded_data)

        # Convert bytes to PIL Image object
        image = Image.open(BytesIO(decoded_data))
        return jsonify(predict(image))
    except:
        return jsonify({"gender":"[there was an error]", "chance": 0})

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='0.0.0.0')