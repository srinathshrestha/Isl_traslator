from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import cv2
import numpy as np
from ultralytics import YOLO
from io import BytesIO
import os

app = FastAPI()

# Serve static files (HTML, JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load your trained YOLOv8 model
model_path = os.path.join('model', 'emotion_sign_best.pt')
model = YOLO(model_path)

def preprocess_image(file: UploadFile):
    image_data = file.file.read()
    image_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image")
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image, image_rgb

def detect_sign_language(image_rgb):
    results = model(image_rgb)
    # print(results)
    return results

def get_sign_and_emotion(results):
    if not results or results[0].boxes.xyxy.numel() == 0:  # Correctly check if the tensor is empty
        return [], []  # Return empty lists if no detections

    result = results[0]
    detected_words = []
    detected_emotions = []

    for i in range(len(result.boxes.xyxy)):
        x1, y1, x2, y2 = result.boxes.xyxy[i].tolist()
        confidence = result.boxes.conf[i].item()
        class_idx = int(result.boxes.cls[i].item())
        label = result.names[class_idx]

        if '_' in label:
            word, emotion = label.split('_', 1)
        else:
            word, emotion = label, "unknown"

        detected_words.append(word)
        detected_emotions.append(emotion)

    return detected_words, detected_emotions


@app.get("/")
async def get_frontend():
    return FileResponse("static/index.html")

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    try:
        image, image_rgb = preprocess_image(file)
        results = detect_sign_language(image_rgb)
        detected_words, detected_emotions = get_sign_and_emotion(results)
        response = [{"word": word, "emotion": emotion} for word, emotion in zip(detected_words, detected_emotions)]
        return {"detections": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
