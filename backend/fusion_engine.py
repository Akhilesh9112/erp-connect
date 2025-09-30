from flask import Flask, jsonify, request
from flask_cors import CORS 
import random
import logging

# --- Configuration and Initialization ---
logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
# CRITICAL: Enable CORS for React
CORS(app) 

# --- FUSION HELPER FUNCTIONS (Simplified) ---

def determine_decision(score):
    """Maps the raw score (0-20) to a level and recommendation."""
    
    if score < 5:
        return {'level': 'Low', 'recommendation': 'Baseline: Focus on wellness videos and daily mindfulness.'}
    elif score < 12:
        return {'level': 'Moderate', 'recommendation': 'Suggestion: Explore coping exercises in the Psychology Modules and try grounding techniques.'}
    elif score < 17:
        return {'level': 'High', 'recommendation': 'ALERT: Suggest immediate break/support and personalized CBT modules.'}
    else:
        return {'level': 'Critical', 'recommendation': 'URGENT: High Risk. Please seek professional advice immediately.'}


# --- CRITICAL STRESS ASSESSMENT SCORING (High-Resilience) ---

def calculate_form_score(form_data):
    """
    Defensively converts form data into a single raw score (0-20). 
    This function has maximum error handling to prevent 500 crashes.
    """
    score = 0
    
    # --- 1. Safely handle 'age' (The most likely crash point) ---
    age_input = str(form_data.get('age', 0))
    try:
        # Converts any input (number or string) to int safely
        age = int(age_input.strip() or 0) 
    except (ValueError, TypeError):
        age = 0 
    
    if age > 35: score += 5
    
    # --- 2. Safely handle text fields ---
    # Ensure these are always clean, lowercase strings.
    previous_incident = str(form_data.get('previousIncident', '')).lower()
    health_issues = str(form_data.get('healthIssues', '')).lower()
    
    if "stress" in previous_incident or "trauma" in previous_incident: 
        score += 5
    if health_issues and "chronic" in health_issues:
        score += 5
    
    # Add a random element
    score += random.randint(0, 5) 
    
    return min(20, score)


# --- REST API ENDPOINT (For React Frontend fetch) ---

@app.route('/assess-stress', methods=['POST'])
def assess_stress_rest():
    logging.info("Received REST POST request from React /assess-stress")
    
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    try:
        form_data = request.get_json()
        
        # 1. Calculate the raw stress score
        total_stress_score = calculate_form_score(form_data)
        
        # 2. Determine the severity and recommendation
        decision = determine_decision(total_stress_score)
        
        # 3. Return the result to React
        return jsonify({
            "severity": decision['level'],
            "recommendation": decision['recommendation']
        }), 200

    except Exception as e:
        # If it still crashes here, the error message will be printed to the terminal
        logging.error(f"FATAL 500 Error in assess_stress_rest: {e}", exc_info=True)
        return jsonify({"error": "Internal server error during assessment."}), 500

# --- Default Root Route ---
@app.route('/')
def dashboard_view():
    return jsonify({"status": "AI Fusion Engine is running (REST mode). Use /assess-stress POST endpoint."}), 200

# --- Server Startup ---
if __name__ == '__main__':
    logging.info("--- AI FUSION ENGINE STARTING (Minimal REST) ---")
    logging.info("React Frontend Endpoint: http://localhost:8000/assess-stress")
    
    # Run the server on the specified port
    app.run(debug=True, host='0.0.0.0', port=8000)