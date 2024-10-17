import qrcode
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import os

# MongoDB connection setup
def connect_to_mongo():
    client = MongoClient("mongodb+srv://moumi17:km123@cluster0.nuu2n.mongodb.net/SystemLab?retryWrites=true&w=majority")
    db = client['SystemLab']  # Replace 'SystemLab' with your database name
    collection = db['qrcodes']  # Replace 'qrcodes' with your collection name
    return collection

# Function to generate QR code and store data in MongoDB
def generate_qr_code_and_store(system_id, latitude, longitude, range_value):
    # Create the URL with the changing number
    url = f"https://lab2.co/{system_id}"

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')

    # Define the directory path where the QR code image will be saved
    save_directory = r"D:\Lab Attendance System\Lab-Attendance\QRCodes\Lab2"
    
    # Create the directory if it doesn't exist
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # Save the QR code image in the specified directory
    img_filename = os.path.join(save_directory, f"lab2_{system_id}.png")
    img.save(img_filename)
    print(f"QR code saved as {img_filename} for URL: {url}")

    # Store data in MongoDB
    collection = connect_to_mongo()
    data = {
        "_id": ObjectId(),  # Automatically generate an ObjectId
        "qrCodeData": url,
        "systemId": f"lab2-{system_id}",
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "range": range_value
        }
    }
    try:
        # Check for existing QR code data
        existing_entry = collection.find_one({"qrCodeData": url})
        if existing_entry:
            print(f"Duplicate entry found for QR code data: {url}. This entry will not be stored.")
        else:
            collection.insert_one(data)
            print(f"Data stored in MongoDB: {data}")
    except Exception as e:
        print(f"An error occurred: {e}")
    

# Example: Generate QR codes and store corresponding data
for i in range(1, 81):
    system_id = f"system-{i}"  # Example systemId
    latitude = 11.02432494247204  # Random latitude for example
    longitude = 77.0036843671046  # Random longitude for example
    range_value = 50  # Example range in meters
    generate_qr_code_and_store(system_id, latitude, longitude, range_value)
