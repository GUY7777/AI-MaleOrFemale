from tensorflow import keras
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np


# AI model load
model = keras.models.load_model('model.keras')

height = 128
width = 128
genders = { 0:"male", 1:"female"}

# Load and preprocess the image
def load_and_process_image(image):
    img = image.convert("RGB").resize((height, width))
    img = np.array([img_to_array(img)])
    # Normalize the image
    img /= 255.
    return img

# Predit function
def predict(image):
    img = load_and_process_image(image)
    prediction = model.predict(img)[0][0]
    chance = (1 - prediction)*100 if prediction < 0.5 else prediction*100
    # Print chance (debugging)
    print(genders[round(prediction)], ":", chance)
    return {"gender":genders[round(prediction)], "chance": chance}