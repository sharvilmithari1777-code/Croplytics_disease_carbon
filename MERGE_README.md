# Merged Agricultural AI Platform

This is a unified website that combines two applications:
1. **Plant Disease Detection** - AI-powered plant disease identification from leaf images
2. **Agricultural Yield Forecasting** - ML-based crop yield prediction using soil and weather data

## Features

### Plant Disease Detection
- Upload leaf images to detect diseases
- Supports multiple crops: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato
- Provides disease information, prevention steps, and supplement recommendations
- Market page for purchasing recommended supplements

### Agricultural Yield Forecasting
- Predict crop yields based on soil NPK levels, pH, and weather conditions
- Get soil health assessments
- Receive irrigation recommendations
- Crop cycle suggestions
- Weather risk assessments
- Personalized farming tips

## Project Structure

```
Flask Deployed App/
├── app.py                      # Unified Flask application
├── CNN.py                      # Disease detection CNN model
├── forecast_model.py           # Yield forecasting ML model
├── utils.py                    # Agricultural utility functions
├── weather_api.py              # Weather data integration
├── requirements.txt            # All dependencies
├── disease_info.csv           # Disease information database
├── supplement_info.csv         # Supplement information
├── Model/                      # Disease detection model files
│   └── plant_disease_model_1_latest.pt
├── module/                     # Yield forecasting model files
│   ├── yield_forecast_model.pkl
│   ├── scaler.pkl
│   ├── label_encoders.pkl
│   └── feature_columns.pkl
├── data/                       # Agricultural datasets
│   ├── crop_yield.csv
│   ├── state_soil_data.csv
│   └── state_weather_data_1997_2020.csv
├── templates/                  # HTML templates
│   ├── base.html              # Base template with navigation
│   ├── home.html              # Unified home page
│   ├── index.html             # Disease detection page
│   ├── yield_forecast.html    # Yield forecasting page
│   ├── submit.html            # Disease detection results
│   ├── market.html            # Supplements marketplace
│   └── contact-us.html        # Contact page
└── static/
    └── uploads/               # Uploaded images directory
```

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ensure model files exist:**
   - Disease detection model: `Model/plant_disease_model_1_latest.pt`
   - Yield forecasting models: `module/*.pkl` (will be created when you train the model)

3. **Train the yield forecasting model (if needed):**
   ```bash
   python forecast_model.py
   ```
   This will create the model files in the `module/` directory.

## Running the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Routes

### Disease Detection Routes
- `/` - Home page with links to both features
- `/disease-detection` - Disease detection AI engine
- `/submit` - Process uploaded images (POST)
- `/market` - Supplements marketplace
- `/contact` - Contact page

### Yield Forecasting Routes
- `/yield-forecast` - Yield forecasting dashboard
- `/predict` - Predict crop yield (POST, JSON)
- `/states` - Get list of available states (JSON)
- `/soil-data/<state>` - Get soil data for a state (JSON)
- `/weather/<state>` - Get weather data for a state (JSON)
- `/model-info` - Get model information (JSON)
- `/health` - Health check endpoint (JSON)

## API Usage Examples

### Predict Yield
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Punjab",
    "N": 180,
    "P": 45,
    "K": 200,
    "pH": 6.8,
    "avg_temp_c": 26.5,
    "total_rainfall_mm": 950,
    "avg_humidity_percent": 60
  }'
```

### Get States
```bash
curl http://localhost:5000/states
```

### Get Soil Data
```bash
curl http://localhost:5000/soil-data/Punjab
```

### Get Weather Data
```bash
curl http://localhost:5000/weather/Punjab
```

## Notes

- The disease detection model must be present in `Model/plant_disease_model_1_latest.pt`
- The yield forecasting model will be automatically loaded from `module/` if available
- If the yield forecasting model is not found, you'll see a warning but the app will still run
- Weather data currently uses mock data. To use real weather API, update `weather_api.py` with your API key

## Troubleshooting

1. **Model not found errors:**
   - Ensure `Model/plant_disease_model_1_latest.pt` exists
   - Train the yield forecasting model if `module/` files are missing

2. **Import errors:**
   - Make sure all dependencies are installed: `pip install -r requirements.txt`
   - Check that `forecast_model.py`, `utils.py`, and `weather_api.py` are in the root directory

3. **Port already in use:**
   - Change the port in `app.py`: `app.run(debug=True, host='0.0.0.0', port=5001)`

## Features Integration

Both features are now accessible through:
- **Unified Navigation Bar** - Links to both features from any page
- **Home Page** - Showcases both applications with quick access buttons
- **Consistent UI** - Both features use the same base template for consistency

## Next Steps

1. Train the yield forecasting model if you haven't already
2. Test both features to ensure everything works
3. Customize the UI/UX as needed
4. Deploy to your preferred hosting platform

