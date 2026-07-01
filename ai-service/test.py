import json
import requests

API_URL = "http://127.0.0.1:8000/summarize"

# Deliberately short — should trigger your 400 validation error
short_text = "This paper is about AI."

def main():
    print(f"Sending {len(short_text)} characters (should fail validation).")
    response = requests.post(API_URL, json={"text": short_text}, timeout=30)
    print(f"Status Code: {response.status_code}\n")

    print(json.dumps(response.json(), indent=2))

    if response.status_code == 400:
        print("\n✅ PASS — correctly rejected short text")
    else:
        print("\n❌ FAIL — expected 400, check your validation logic")

if __name__ == "__main__":
    main()