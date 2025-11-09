import os
import sys
import warnings
# Suppress warnings before importing other modules
warnings.filterwarnings('ignore')

from flask import Flask, redirect, render_template, request, jsonify
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from PIL import Image
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
import pandas as pd

# Import warning suppression
try:
    from suppress_warnings import *
except ImportError:
    pass

# Import Agri Forecasting modules
from forecast_model import AgriYieldForecaster
from weather_api import get_current_weather, get_weather_by_coordinates
from utils import (
    get_irrigation_recommendation,
    suggest_crop_cycle,
    format_prediction_summary,
    generate_farming_tips,
    validate_input_parameters
)

# Load disease detection data
disease_info = pd.read_csv('disease_info.csv', encoding='cp1252')
supplement_info = pd.read_csv('supplement_info.csv', encoding='cp1252')

# Initialize disease detection model
model = CNN.CNN(39)
# Fix MODEL_PATH to use relative path
MODEL_PATH = os.path.join('Model', 'plant_disease_model_1_latest.pt')

if not os.path.exists(MODEL_PATH):
    print("Model file not found at:", MODEL_PATH)
    print("Please ensure the model file exists in the Model directory")
else:
    print("Model file found at:", MODEL_PATH)
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location='cpu'))
        model.eval()
        print("Disease detection model loaded successfully!")
    except Exception as e:
        print(f"Error loading disease detection model: {e}")

# Initialize Agri Forecasting
# Warnings are already suppressed by suppress_warnings module
forecaster = AgriYieldForecaster()
model_loaded = False
try:
    if forecaster.load_model():
        model_loaded = True
        print("Agri forecasting model loaded successfully!")
    else:
        print("No trained agri forecasting model found. Please run forecast_model.py first to train the model.")
except Exception as e:
    print(f"Error loading agri forecasting model: {e}")

def prediction(image_path):
    """Predict plant disease from image"""
    image = Image.open(image_path)
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224))
    output = model(input_data)
    output = output.detach().numpy()
    index = np.argmax(output)
    return index

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key')

# ==================== Auth: Flask-Login Setup ====================

class User(UserMixin):
    def __init__(self, id, username, name, password):
        self.id = id
        self.username = username
        self.name = name
        self.password = password

    def get_id(self):
        return str(self.id)


# Simple in-memory user store for testing
USERS = {
    'rutugandh': {'id': 1, 'username': 'rutugandh', 'name': 'Rutugandh Kulkarni', 'password': '1234'},
}

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    # Find user by id in USERS
    for u in USERS.values():
        if str(u['id']) == str(user_id):
            return User(u['id'], u['username'], u['name'], u['password'])
    return None

# ==================== Disease Detection Routes ====================

@app.route('/')
@login_required
def home_page():
    """Unified home page"""
    return render_template('home.html')

@app.route('/contact')
@login_required
def contact():
    """Contact page"""
    return render_template('contact-us.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page"""
    if request.method == 'POST':
        username = (request.form.get('username') or '').strip()
        password = (request.form.get('password') or '').strip()

        # Case-insensitive username lookup
        key = username.lower()
        user_rec = USERS.get(key) or USERS.get(username)
        if user_rec and password == user_rec['password']:
            user = User(user_rec['id'], user_rec['username'], user_rec['name'], user_rec['password'])
            login_user(user)
            next_url = request.args.get('next') or '/'
            return redirect(next_url)
        else:
            return redirect('/login?error=' + 'Invalid username or password')

    # GET
    error = request.args.get('error')
    success = request.args.get('success')
    return render_template('login.html', error=error, success=success)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Sign up page"""
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # TODO: Add actual user registration logic here
        # For now, this is a placeholder
        if username and email and password:
            # In a real app, you would create a new user in the database
            return redirect('/login?success=' + 'Account created successfully! Please login.')
        else:
            return redirect('/signup?error=' + 'Please fill in all fields')
    
    return render_template('signup.html')

@app.route('/disease-detection')
@login_required
def ai_engine_page():
    """Disease detection AI engine page"""
    return render_template('index.html')

@app.route('/mobile-device')
@login_required
def mobile_device_detected_page():
    """Mobile device page"""
    return render_template('mobile-device.html')

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    """Submit image for disease detection"""
    if request.method == 'POST':
        image = request.files['image']
        filename = image.filename
        file_path = os.path.join('static/uploads', filename)
        image.save(file_path)
        print(file_path)
        pred = prediction(file_path)
        title = disease_info['disease_name'][pred]
        description = disease_info['description'][pred]
        prevent = disease_info['Possible Steps'][pred]
        image_url = disease_info['image_url'][pred]
        supplement_name = supplement_info['supplement name'][pred]
        supplement_image_url = supplement_info['supplement image'][pred]
        supplement_buy_link = supplement_info['buy link'][pred]
        print("CSV Columns:", supplement_info.columns.tolist())
        return render_template('submit.html', title=title, desc=description, prevent=prevent,
                               image_url=image_url, pred=pred, sname=supplement_name,
                               simage=supplement_image_url, buy_link=supplement_buy_link)

@app.route('/market', methods=['GET', 'POST'])
@login_required
def market():
    """Market/supplements page"""
    return render_template('market.html',
                           supplement_image=list(supplement_info['supplement image']),
                           supplement_name=list(supplement_info['supplement name']),
                           disease=list(disease_info['disease_name']),
                           buy=list(supplement_info['buy link']))

# ==================== Agri Forecasting Routes ====================

@app.route('/yield-forecast')
@login_required
def yield_forecast_page():
    """Yield forecasting dashboard page"""
    return render_template('yield_forecast.html')

# Carbon Calculator page route (HTML page)
@app.route('/carbon-calculator')
@login_required
def carbon_calculator():
    return render_template('carbon_calculator.html')

@app.route('/predict', methods=['POST'])
def predict_yield():
    """Predict crop yield and return recommendations."""
    try:
        if not model_loaded:
            return jsonify({'error': 'Model not loaded. Please train the model first.', 'success': False})

        data = request.json or {}
        
        # Validate required fields quickly (use your util validation)
        validation = validate_input_parameters(data)
        if not validation['success']:
            return jsonify({'error': 'Invalid input', 'details': validation['errors'], 'success': False})

        # Build input_data dict (ensure numeric types)
        input_data = {
            'state': data.get('state', ''),
            'N': float(data.get('N', 0)),
            'P': float(data.get('P', 0)),
            'K': float(data.get('K', 0)),
            'pH': float(data.get('pH', 7)),
            'avg_temp_c': float(data.get('avg_temp_c', 25)),
            'total_rainfall_mm': float(data.get('total_rainfall_mm', 0)),
            'avg_humidity_percent': float(data.get('avg_humidity_percent', 50))
        }
        if 'year' in data:
            input_data['year'] = int(data['year'])

        # Predict
        prediction_raw = forecaster.predict(input_data)
        prediction = round(float(prediction_raw), 2)

        # Create the formatted summary (uses utils)
        summary = format_prediction_summary(prediction, input_data)

        # Farming tips (friendly list)
        farming_tips = generate_farming_tips(
            {'N': input_data['N'], 'P': input_data['P'], 'K': input_data['K'], 'pH': input_data['pH']},
            {'avg_temp_c': input_data['avg_temp_c'], 'total_rainfall_mm': input_data['total_rainfall_mm'],
             'avg_humidity_percent': input_data['avg_humidity_percent']}
        )

        # Return structured response (friendly for frontend)
        return jsonify({
            'success': True,
            'prediction': prediction,
            'yield_category': summary.get('yield_category'),
            'irrigation': summary.get('irrigation_advice'),
            'crop_cycle': summary.get('crop_cycle'),
            'soil_health': summary.get('soil_health'),
            'weather_risks': summary.get('weather_risks'),
            'farming_tips': farming_tips
        })

    except ValueError as e:
        return jsonify({'error': f'Invalid input data: {str(e)}', 'success': False})
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}', 'success': False})


@app.route('/weather/<state>')
def get_weather_data(state):
    """Get weather data for a specific state"""
    try:
        weather_data = get_current_weather(state)
        return jsonify({
            'weather_data': weather_data,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': f'Weather data error: {str(e)}',
            'success': False
        })

@app.route('/get_weather_by_coords')
def get_weather_by_coords():
    """Get weather data using latitude and longitude coordinates"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            return jsonify({
                'error': 'Latitude and longitude are required',
                'success': False
            })
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90):
            return jsonify({
                'error': 'Latitude must be between -90 and 90',
                'success': False
            })
        
        if not (-180 <= lon <= 180):
            return jsonify({
                'error': 'Longitude must be between -180 and 180',
                'success': False
            })
        
        # Get weather data by coordinates
        weather_data = get_weather_by_coordinates(lat, lon)
        
        return jsonify({
            'weather_data': weather_data,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': f'Weather data error: {str(e)}',
            'success': False
        })

@app.route('/states')
def get_states():
    """Get list of available states"""
    try:
        # Read soil data to get available states
        soil_data = pd.read_csv('data/state_soil_data.csv')
        states = sorted(soil_data['state'].unique().tolist())
        return jsonify({
            'states': states,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': f'Error loading states: {str(e)}',
            'success': False
        })

@app.route('/soil-data/<state>')
def get_soil_data(state):
    """Get soil data for a specific state"""
    try:
        soil_data = pd.read_csv('data/state_soil_data.csv')
        state_soil = soil_data[soil_data['state'] == state]
        
        if state_soil.empty:
            return jsonify({
                'error': f'No soil data found for state: {state}',
                'success': False
            })
        
        soil_info = {
            'N': float(state_soil['N'].iloc[0]),
            'P': float(state_soil['P'].iloc[0]),
            'K': float(state_soil['K'].iloc[0]),
            'pH': float(state_soil['pH'].iloc[0])
        }
        
        return jsonify({
            'soil_data': soil_info,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error loading soil data: {str(e)}',
            'success': False
        })

@app.route('/get_soil_by_coords')
def get_soil_by_coords():
    """Get soil information using latitude and longitude coordinates"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            return jsonify({
                'error': 'Latitude and longitude are required',
                'success': False
            })
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90):
            return jsonify({
                'error': 'Latitude must be between -90 and 90',
                'success': False
            })
        
        if not (-180 <= lon <= 180):
            return jsonify({
                'error': 'Longitude must be between -180 and 180',
                'success': False
            })
        
        # Approximate state detection based on coordinates (India-specific)
        # This is a simplified mapping - in production, use a proper geocoding service
        state = None
        if 15 <= lat <= 22 and 72 <= lon <= 80:
            state = 'Maharashtra'
        elif 28 <= lat <= 32 and 74 <= lon <= 77:
            state = 'Punjab'
        elif 9 <= lat <= 12 and 75 <= lon <= 78:
            state = 'Kerala'
        elif 22 <= lat <= 27 and 84 <= lon <= 88:
            state = 'West Bengal'
        elif 10 <= lat <= 14 and 76 <= lon <= 80:
            state = 'Tamil Nadu'
        elif 23 <= lat <= 27 and 80 <= lon <= 84:
            state = 'Uttar Pradesh'
        elif 12 <= lat <= 19 and 74 <= lon <= 78:
            state = 'Karnataka'
        elif 20 <= lat <= 24 and 72 <= lon <= 74:
            state = 'Gujarat'
        elif 18 <= lat <= 20 and 73 <= lon <= 75:
            state = 'Maharashtra'  # Mumbai region
        else:
            # Default to a common state if coordinates don't match
            state = 'Maharashtra'
        
        # Load soil data
        soil_data = pd.read_csv('data/state_soil_data.csv')
        state_soil = soil_data[soil_data['state'] == state]
        
        if state_soil.empty:
            return jsonify({
                'error': f'No soil data found for coordinates ({lat}, {lon})',
                'success': False
            })
        
        # Get available data
        row = state_soil.iloc[0]
        pH_value = float(row['pH']) if 'pH' in row and pd.notna(row['pH']) else None
        
        # Estimate soil type based on pH and region (simplified logic)
        if pH_value:
            if pH_value < 5.5:
                soil_type = 'Acidic'
            elif pH_value < 6.5:
                soil_type = 'Slightly Acidic'
            elif pH_value <= 7.5:
                soil_type = 'Neutral'
            elif pH_value <= 8.5:
                soil_type = 'Alkaline'
            else:
                soil_type = 'Highly Alkaline'
        else:
            soil_type = 'N/A'
        
        # Estimate organic carbon based on N content (simplified: N/10 gives approximate OC%)
        N_value = float(row['N']) if 'N' in row and pd.notna(row['N']) else None
        organic_carbon = (N_value / 10) if N_value else None
        
        # Estimate texture based on region (simplified)
        texture_map = {
            'Maharashtra': 'Black Soil / Regur',
            'Punjab': 'Alluvial',
            'Kerala': 'Laterite',
            'West Bengal': 'Alluvial',
            'Tamil Nadu': 'Red Soil',
            'Uttar Pradesh': 'Alluvial',
            'Karnataka': 'Red Soil',
            'Gujarat': 'Black Soil'
        }
        texture = texture_map.get(state, 'Mixed')
        
        # Build response
        soil_info = {
            'soil_type': soil_type,
            'pH': pH_value,
            'organic_carbon': organic_carbon,
            'texture': texture,
            'state': state,
            'N': N_value,
            'P': float(row['P']) if 'P' in row and pd.notna(row['P']) else None,
            'K': float(row['K']) if 'K' in row and pd.notna(row['K']) else None
        }
        
        return jsonify({
            'soil_data': soil_info,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error fetching soil data: {str(e)}',
            'success': False
        })

@app.route('/model-info')
def get_model_info():
    """Get information about the loaded model"""
    try:
        if not model_loaded:
            return jsonify({
                'error': 'No model loaded',
                'success': False
            })
        
        model_info = {
            'model_type': type(forecaster.model).__name__,
            'features': forecaster.feature_columns,
            'model_loaded': model_loaded
        }
        
        return jsonify({
            'model_info': model_info,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error getting model info: {str(e)}',
            'success': False
        })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'disease_model_loaded': os.path.exists(MODEL_PATH),
        'forecast_model_loaded': model_loaded,
        'success': True
    })

# ==================== Auth: Logout ====================

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/login')

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'success': False
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'success': False
    }), 500

if __name__ == '__main__':
    # Suppress warnings for cleaner output
    import warnings
    warnings.filterwarnings('ignore')
    
    # Check if models exist
    if not os.path.exists(MODEL_PATH):
        print("\n" + "="*60)
        print("WARNING: Disease detection model not found!")
        print(f"Expected at: {MODEL_PATH}")
        print("="*60 + "\n")
    
    if not model_loaded:
        print("\n" + "="*60)
        print("WARNING: No trained agri forecasting model found!")
        print("Please run the following command to train the model:")
        print("python forecast_model.py")
        print("="*60 + "\n")
    
    print("\n" + "="*60)
    print("Starting Flask application...")
    print("Server running on http://127.0.0.1:5000")
    print("Press CTRL+C to stop the server")
    print("="*60 + "\n")
    
    # Suppress Flask development server warning and werkzeug logs
    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    
    # Suppress the "development server" warning by monkey-patching
    import flask.cli
    original_show_server_banner = flask.cli.show_server_banner
    def silent_server_banner(*args, **kwargs):
        pass
    flask.cli.show_server_banner = silent_server_banner
    
    # Run the Flask application
    print("✓ Server is running!")
    print("✓ Open http://127.0.0.1:5000 in your browser")
    print("✓ Press CTRL+C to stop the server\n")
    sys.stdout.flush()
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    finally:
        # Restore original function
        flask.cli.show_server_banner = original_show_server_banner
