import random
import time
from datetime import datetime
import json

# -------------------------
# CONSTANTS
# -------------------------
REGIONS = ["LATAM", "EU"]
DEVICES = ["mobile", "desktop"]
FUNNEL_STEPS = ["signup", "deposit_payment_selection", "deposit_success"]

# -------------------------
# RAW EVENT STORAGE
# -------------------------
events = []

def generate_event(user_id):
    region = random.choice(REGIONS)
    device = random.choice(DEVICES)

    for step in FUNNEL_STEPS:
        timestamp = datetime.utcnow().isoformat() + "Z"

        # Inject friction ONLY here
        if region == "LATAM" and device == "mobile" and step == "deposit_payment_selection":
            success_prob = 0.55
            behavior_signal = random.choice(
                ["rage_click", "hesitation", "repeated_attempt"]
            )
        else:
            success_prob = 0.85
            behavior_signal = "none"

        success = random.random() < success_prob

        event = {
            "user_id": f"u_{user_id}",
            "timestamp": timestamp,
            "region": region,
            "device": device,
            "funnel_step": step,
            "behavior_signal": behavior_signal if not success else "none",
            "success": success
        }

        events.append(event)

        # user drops out of funnel on failure
        if not success:
            break

# -------------------------
# SIMULATE USERS
# -------------------------
for user_id in range(1, 251):  # 250 users
    generate_event(user_id)
    time.sleep(random.uniform(0.01, 0.02))  # fast for demo

print(f"Generated {len(events)} raw events")

# -------------------------
# SAVE EVENTS TO FILE
# -------------------------
with open("events.json", "w") as f:
    json.dump(events, f, indent=2)

print("events.json file created successfully")
