import os
import json

# Adjusted path to point to the images directory
IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), "../images/slide_media")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../images.json")

# Get a list of image files
image_files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

# Save to JSON
with open(OUTPUT_FILE, "w") as f:
    json.dump(image_files, f)

print(f"Updated {OUTPUT_FILE} with {len(image_files)} images.")
