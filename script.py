import requests
import time
import subprocess
import os

API_URL = "https://miliya-ai-task.onrender.com/get-calls"
LOCAL_FILE = r"F:\Interview\Miliya AI\Data.txt"  
INTERVAL = 5
notepad_opened = False  

print("Starting to poll API for new call data...")

while True:
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()

        if "calls" in data and data["calls"]:
            with open(LOCAL_FILE, "a", encoding="utf-8") as f:
                for line in data["calls"]:
                    f.write(line + "\n")
            print(f"Appended {len(data['calls'])} entries to {LOCAL_FILE}")

            if not notepad_opened:
                subprocess.Popen(["notepad.exe", LOCAL_FILE])
                notepad_opened = True

        time.sleep(INTERVAL)

    except requests.exceptions.RequestException as e:
        print("Error connecting to API:", e)
        time.sleep(INTERVAL)













# import requests
# import time

# API_URL = "https://miliya-ai-task.onrender.com/get-calls"

# LOCAL_FILE = "F:\Interview\Miliya AI\Data.txt" 

# INTERVAL = 5  

# print("Starting to poll API for new call data...")

# while True:
#     try:
#         response = requests.get(API_URL)
#         response.raise_for_status()

#         data = response.json()

#         # If there is new call data
#         if "calls" in data and data["calls"]:
#             with open(LOCAL_FILE, "a", encoding="utf-8") as f:
#                 for line in data["calls"]:
#                     f.write(line + "\n")
#             print(f"Appended {len(data['calls'])} entries to {LOCAL_FILE}")

#         time.sleep(INTERVAL)

#     except requests.exceptions.RequestException as e:
#         print("Error connecting to API:", e)
#         time.sleep(INTERVAL)
