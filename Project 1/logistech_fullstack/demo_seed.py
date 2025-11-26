import requests
import time
import random

API_URL = "http://localhost:8000"

def seed_data():
    print("Seeding data...")
    
    # 1. Add Packages to Conveyor
    packages = [
        {"tracking_id": "PKG_001", "size": 12, "destination": "New York"},
        {"tracking_id": "PKG_002", "size": 4, "destination": "Los Angeles"},
        {"tracking_id": "PKG_003", "size": 55, "destination": "Chicago"},
        {"tracking_id": "PKG_004", "size": 150, "destination": "Houston"},
        {"tracking_id": "PKG_005", "size": 8, "destination": "Miami"},
    ]
    
    for p in packages:
        try:
            requests.post(f"{API_URL}/packages", json=p)
            print(f"Added {p['tracking_id']}")
            time.sleep(0.5)
        except Exception as e:
            print(f"Error adding package: {e}")

    print("Seeding complete! Check the Dashboard.")

if __name__ == "__main__":
    seed_data()
