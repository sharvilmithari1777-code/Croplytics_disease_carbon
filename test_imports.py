"""
Test script to verify all imports work correctly
"""
print("Testing imports...")

try:
    import os
    print("[OK] os")
    
    from flask import Flask, render_template, request, jsonify
    print("[OK] Flask")
    
    from PIL import Image
    print("[OK] PIL/Pillow")
    
    import torch
    import torchvision.transforms.functional as TF
    print("[OK] torch, torchvision")
    
    import numpy as np
    print("[OK] numpy")
    
    import pandas as pd
    print("[OK] pandas")
    
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    print("[OK] scikit-learn")
    
    import xgboost as xgb
    print("[OK] xgboost")
    
    import joblib
    print("[OK] joblib")
    
    import requests
    print("[OK] requests")
    
    # Test importing our custom modules
    try:
        import CNN
        print("[OK] CNN module")
    except Exception as e:
        print(f"[WARNING] CNN module: {e}")
    
    try:
        from forecast_model import AgriYieldForecaster
        print("[OK] forecast_model module")
    except Exception as e:
        print(f"[WARNING] forecast_model module: {e}")
    
    try:
        from utils import get_irrigation_recommendation
        print("[OK] utils module")
    except Exception as e:
        print(f"[WARNING] utils module: {e}")
    
    try:
        from weather_api import get_current_weather
        print("[OK] weather_api module")
    except Exception as e:
        print(f"[WARNING] weather_api module: {e}")
    
    print("\n[SUCCESS] All core imports successful!")
    print("\nPython environment is ready!")
    
except ImportError as e:
    print(f"\n❌ Import error: {e}")
    print("Please check your installation.")

