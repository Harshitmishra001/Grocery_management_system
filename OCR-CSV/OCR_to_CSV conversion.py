import requests
import json
import pandas as pd
import re
from datetime import datetime, timedelta

# Expiration days based on item type
EXPIRATION_DAYS = {
    "Eggs": 14,      # Eggs last about 2 weeks
    "Milk": 7,       # Milk lasts about a week
    "Bread": 5,      # Bread lasts about 5 days
    "Apple": 30,     # Apples last about a month
    "Banana": 5,     # Bananas last about 5 days
    "Chicken": 3,    # Chicken lasts about 3 days
    "Fish": 2,       # Fish lasts about 2 days
    "Cheese": 14,    # Cheese lasts about 2 weeks
    "Yogurt": 10,    # Yogurt lasts about 10 days
}

DEFAULT_EXPIRATION_DAYS = 7  # If an item isn't in the dictionary, set a default

def extract_text_from_receipt(image_path):
    api_url = "https://api.ocr.space/parse/image"
    
    with open(image_path, "rb") as image_file:
        response = requests.post(api_url,
            files={"file": image_file},
            data={
                "apikey": "helloworld",  # Replace with your API key
                "language": "eng",
                "isOverlayRequired": False
            }
        )

    result = response.json()
    
    if result["IsErroredOnProcessing"]:
        raise ValueError("❌ OCR API failed. Try another image.")

    extracted_text = result["ParsedResults"][0]["ParsedText"]
    
    if not extracted_text.strip():
        raise ValueError("❌ No text detected in the receipt.")
    
    return extracted_text

def process_receipt_text(ocr_text, user_id):
    # Regex pattern to extract item, quantity, and price
    pattern = r"([A-Za-z\s]+)\s-\s(\d+)\s-\s(\d+)\srupees"
    
    grocery_data = []
    for match in re.findall(pattern, ocr_text):
        item_name = match[0].strip()
        quantity = int(match[1].strip())
        price = int(match[2].strip())

        purchase_date = datetime.today().strftime('%Y-%m-%d')
        expiration_days = EXPIRATION_DAYS.get(item_name, DEFAULT_EXPIRATION_DAYS)  # Get expiration days from dict
        expiration_date = (datetime.today() + timedelta(days=expiration_days)).strftime('%Y-%m-%d')  
        
        # Ask user for daily usage input
        daily_usage = float(input(f"Enter daily usage for {item_name} (in units): "))
        
        grocery_data.append([item_name, price, purchase_date, expiration_date, daily_usage])

    save_to_csv(user_id, grocery_data)

def save_to_csv(user_id, items):
    filename = f"user_{user_id}_grocery.csv"
    columns = ["Item", "Price", "Purchase Date", "Estimated Expiry Date", "Item Usage"]

    try:
        existing_df = pd.read_csv(filename)
        df = pd.DataFrame(items, columns=columns)
        updated_df = pd.concat([existing_df, df], ignore_index=True)
    except FileNotFoundError:
        updated_df = pd.DataFrame(items, columns=columns)

    updated_df.to_csv(filename, index=False)
    print(f"✅ Data saved to {filename}")

# Example usage
image_path = "/kaggle/input/anotherone/harshit_updated222.png"
user_id = 12345

try:
    ocr_text = extract_text_from_receipt(image_path)
    print("🔍 OCR Extracted Text:\n", ocr_text)
    
    process_receipt_text(ocr_text, user_id)
except ValueError as e:
    print(e)
