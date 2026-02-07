import random
import time
from datetime import datetime
import json

REGIONS = ["LATAM", "EU"]
DEVICES = ["mobile", "desktop"]
FUNNEL_STEPS = ["signup", "deposit_payment_selection", "deposit_success"]

events = []

def generate_event(user_id):
    region = random.choice(REGIONS)
    device = random.choice(DEVICES)

    for step in FUNNEL_STEPS:
        timestamp = datetime.utcnow().isoformat() + "Z"

        # POST-FIX BEHAVIOR
        if region == "LATAM" and device == "mobile" and step == "deposit_payment_selection":
            success_prob = 0.70          # improved from 0.55
            behavior_signal = random.choices(
                ["none", "hesitation"],
                weights=[0.8, 0.2]
            )[0]
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

        if not success:
            break

for user_id in range(1, 251):
    generate_event(user_id)
    time.sleep(0.01)

with open("events_post_fix.json", "w") as f:
    json.dump(events, f, indent=2)

print("Post-fix events generated")
