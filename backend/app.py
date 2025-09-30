from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import os # Useful for managing environments

# --- Configuration ---
# Set up basic logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask App
app = Flask(__name__)

# IMPORTANT: Enable CORS to allow the React frontend (running on a different port/address) 
# to send requests to this Flask server. Replace * with the React URL in production.
CORS(app) 

# --- AI/Fusion Engine Logic Placeholder ---
# In a real-world scenario, you would load your trained model here once.
# Example: model = joblib.load('stress_model.pkl')

def run_fusion_engine_assessment(form_data):
    """
    Simulates the AI/ML 'Fusion Engine' processing the form data.
    In a real app, this function would run the predictive model 
    and potentially integrate real-time mood data.
    """
    # Extract data safely
    name = form_data.get('name', 'User')
    age_str = form_data.get('age', '0')
    previous_incident = form_data.get('previousIncident', '').lower()
    
    try:
        age = int(age_str)
    except ValueError:
        age = 0

    severity = "Low"
    recommendation = "Great to see you taking care of your mental health! Continue with routine wellness checks."

    # Simple logic based on inputs (Replace this with your actual ML prediction)
    score = 0
    if age >= 35:
        score += 2
    if "trauma" in previous_incident or "loss" in previous_incident:
        score += 3
    if form_data.get('healthIssues'):
        score += 2

    if score >= 5:
        severity = "High"
        recommendation = f"Hello {name}, your assessment suggests high stress risk. Please focus on personalized CBT videos and consider professional help."
    elif score >= 2:
        severity = "Medium"
        recommendation = f"Hello {name}, your stress level is moderate. We recommend exploring the Psychology Modules and using the Expert Charts feature."

    return {
        "severity": severity,
        "recommendation": recommendation
    }

# --- API Endpoint Definition ---

@app.route('/assess-stress', methods=['POST'])
def assess_stress():
    logging.info("Received POST request on /assess-stress")
    
    # Check if the request body is valid JSON
    if not request.is_json:
        logging.error("Request failed: Content-Type must be application/json")
        return jsonify({"error": "Content-Type must be application/json"}), 400

    try:
        # Get the JSON data sent from the React frontend
        request_data = request.get_json()
        logging.debug(f"Data received: {request_data}")
        
        # Run the AI/ML assessment
        assessment_result = run_fusion_engine_assessment(request_data)
        
        logging.info(f"Assessment complete. Severity: {assessment_result['severity']}")
        
        # Return the results as JSON back to the React frontend
        return jsonify(assessment_result), 200

    except Exception as e:
        # This catches any errors during data processing or AI execution
        logging.error(f"Internal server error during assessment: {e}", exc_info=True)
        return jsonify({"error": "Internal server error during assessment"}), 500

# --- Server Startup ---

if __name__ == '__main__':
    # Running on port 8000 as specified in your previous step (http://0.0.0.0:8000)
    # The debug=True flag is helpful for development (it reloads the server automatically)
    # The host='0.0.0.0' allows external connections if needed, though localhost is fine for testing.
    app.run(debug=True, host='0.0.0.0', port=8000)