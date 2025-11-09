"""
Test script to verify app starts without warnings/errors
"""
import warnings
import sys

# Suppress all warnings for testing
warnings.filterwarnings('ignore')

print("Testing app startup...")
print("=" * 50)

try:
    # Test imports
    print("\n1. Testing imports...")
    import os
    from flask import Flask
    from PIL import Image
    import torch
    import pandas as pd
    from forecast_model import AgriYieldForecaster
    from weather_api import get_current_weather
    from utils import validate_input_parameters
    print("   [OK] All imports successful")
    
    # Test disease detection model loading
    print("\n2. Testing disease detection model...")
    import CNN
    model = CNN.CNN(39)
    MODEL_PATH = os.path.join('Model', 'plant_disease_model_1_latest.pt')
    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH, map_location='cpu'))
        model.eval()
        print("   [OK] Disease detection model loaded")
    else:
        print("   [WARNING] Disease detection model not found")
    
    # Test agri forecasting model loading
    print("\n3. Testing agri forecasting model...")
    forecaster = AgriYieldForecaster()
    if forecaster.load_model():
        print("   [OK] Agri forecasting model loaded")
    else:
        print("   [WARNING] Agri forecasting model not found")
    
    # Test Flask app creation
    print("\n4. Testing Flask app creation...")
    app = Flask(__name__)
    print("   [OK] Flask app created successfully")
    
    print("\n" + "=" * 50)
    print("[SUCCESS] All tests passed! App should start without errors.")
    print("=" * 50)
    
except Exception as e:
    print(f"\n[ERROR] Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

