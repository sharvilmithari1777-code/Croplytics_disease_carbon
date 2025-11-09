"""
Weather API Integration Module

This module provides functions to fetch real-time weather data for agricultural forecasting.
Currently implements mock data for development, with structure ready for real API integration.

Supported integrations (to be implemented):
- OpenWeatherMap API
- WeatherAPI
- AccuWeather API
"""

import requests
import random
from datetime import datetime
from typing import Dict, Optional

# Mock weather data for development
MOCK_WEATHER_DATA = {
    'Andhra Pradesh': {'temp': 28.5, 'rainfall': 850, 'humidity': 68},
    'Arunachal Pradesh': {'temp': 22.2, 'rainfall': 2100, 'humidity': 75},
    'Assam': {'temp': 23.1, 'rainfall': 1800, 'humidity': 76},
    'Bihar': {'temp': 26.2, 'rainfall': 1050, 'humidity': 56},
    'Chhattisgarh': {'temp': 26.0, 'rainfall': 1200, 'humidity': 59},
    'Delhi': {'temp': 25.5, 'rainfall': 700, 'humidity': 45},
    'Goa': {'temp': 27.4, 'rainfall': 2200, 'humidity': 74},
    'Gujarat': {'temp': 27.8, 'rainfall': 750, 'humidity': 48},
    'Haryana': {'temp': 24.2, 'rainfall': 950, 'humidity': 47},
    'Himachal Pradesh': {'temp': 21.0, 'rainfall': 1100, 'humidity': 50},
    'Jharkhand': {'temp': 23.4, 'rainfall': 1350, 'humidity': 62},
    'Jammu and Kashmir': {'temp': 9.5, 'rainfall': 650, 'humidity': 52},
    'Karnataka': {'temp': 23.7, 'rainfall': 850, 'humidity': 68},
    'Kerala': {'temp': 26.8, 'rainfall': 1800, 'humidity': 80},
    'Madhya Pradesh': {'temp': 25.2, 'rainfall': 1200, 'humidity': 52},
    'Maharashtra': {'temp': 26.7, 'rainfall': 2400, 'humidity': 67},
    'Manipur': {'temp': 20.4, 'rainfall': 1300, 'humidity': 74},
    'Meghalaya': {'temp': 17.9, 'rainfall': 2800, 'humidity': 81},
    'Mizoram': {'temp': 22.9, 'rainfall': 2000, 'humidity': 77},
    'Nagaland': {'temp': 18.3, 'rainfall': 1200, 'humidity': 74},
    'Odisha': {'temp': 26.4, 'rainfall': 1450, 'humidity': 72},
    'Puducherry': {'temp': 28.1, 'rainfall': 1200, 'humidity': 75},
    'Punjab': {'temp': 24.2, 'rainfall': 950, 'humidity': 47},
    'Sikkim': {'temp': 7.5, 'rainfall': 1100, 'humidity': 73},
    'Tamil Nadu': {'temp': 27.9, 'rainfall': 1250, 'humidity': 72},
    'Telangana': {'temp': 26.1, 'rainfall': 800, 'humidity': 60},
    'Tripura': {'temp': 25.2, 'rainfall': 2100, 'humidity': 75},
    'Uttar Pradesh': {'temp': 25.8, 'rainfall': 1000, 'humidity': 52},
    'Uttarakhand': {'temp': 18.0, 'rainfall': 1300, 'humidity': 56},
    'West Bengal': {'temp': 25.8, 'rainfall': 1550, 'humidity': 74}
}

# -------------------------------------------------------------------------
# Core Weather Functions
# -------------------------------------------------------------------------

def get_current_weather(state: str, api_key: Optional[str] = None, use_mock: bool = True) -> Dict:
    """Fetch current weather data for a given state."""
    if use_mock or api_key is None:
        return get_mock_weather(state)
    else:
        return get_openweather_data(state, api_key)


def get_mock_weather(state: str) -> Dict:
    """Generate mock weather data for testing."""
    if state in MOCK_WEATHER_DATA:
        base_data = MOCK_WEATHER_DATA[state].copy()
    else:
        base_data = {'temp': 25.0, 'rainfall': 1000, 'humidity': 65}

    current_time = datetime.now()
    random.seed(current_time.day + current_time.hour)

    weather_data = {
        'avg_temp_c': round(base_data['temp'] + random.uniform(-2, 2), 1),
        'total_rainfall_mm': round(base_data['rainfall'] + random.uniform(-100, 100), 1),
        'avg_humidity_percent': round(base_data['humidity'] + random.uniform(-5, 5), 1),
        'timestamp': current_time.isoformat(),
        'source': 'mock_data',
        'state': state
    }

    # Ensure realistic bounds
    weather_data['avg_temp_c'] = max(0, min(50, weather_data['avg_temp_c']))
    weather_data['total_rainfall_mm'] = max(0, weather_data['total_rainfall_mm'])
    weather_data['avg_humidity_percent'] = max(10, min(100, weather_data['avg_humidity_percent']))

    return weather_data


def get_openweather_data(state: str, api_key: str) -> Dict:
    """Fetch weather data from OpenWeatherMap API."""
    try:
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {'q': f"{state},IN", 'appid': api_key, 'units': 'metric'}
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        weather_data = {
            'avg_temp_c': data['main']['temp'],
            'total_rainfall_mm': data.get('rain', {}).get('1h', 0) * 24,
            'avg_humidity_percent': data['main']['humidity'],
            'timestamp': datetime.now().isoformat(),
            'source': 'openweathermap',
            'state': state
        }
        return weather_data

    except requests.RequestException as e:
        print(f"API request failed: {e}")
        return get_mock_weather(state)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return get_mock_weather(state)


def validate_weather_data(weather_data: Dict) -> bool:
    """Validate weather data for completeness and realistic values."""
    required_fields = ['avg_temp_c', 'total_rainfall_mm', 'avg_humidity_percent']
    for field in required_fields:
        if field not in weather_data:
            return False
    temp = weather_data['avg_temp_c']
    rainfall = weather_data['total_rainfall_mm']
    humidity = weather_data['avg_humidity_percent']
    return (-10 <= temp <= 55) and (0 <= rainfall <= 5000) and (10 <= humidity <= 100)


# -------------------------------------------------------------------------
# Coordinate-based Weather Function
# -------------------------------------------------------------------------

def get_weather_by_coordinates(lat: float, lon: float, api_key: Optional[str] = None, use_mock: bool = True) -> Dict:
    """Fetch current weather data using latitude and longitude."""
    if use_mock or api_key is None:
        random.seed(int(lat * lon))
        return {
            'avg_temp_c': round(20 + random.uniform(-3, 5), 1),
            'total_rainfall_mm': round(1000 + random.uniform(-200, 200), 1),
            'avg_humidity_percent': round(60 + random.uniform(-10, 10), 1),
            'timestamp': datetime.now().isoformat(),
            'source': 'mock_data_latlon',
            'latitude': lat,
            'longitude': lon
        }

    try:
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'}
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        return {
            'avg_temp_c': data['main']['temp'],
            'total_rainfall_mm': data.get('rain', {}).get('1h', 0) * 24,
            'avg_humidity_percent': data['main']['humidity'],
            'timestamp': datetime.now().isoformat(),
            'source': 'openweathermap_latlon',
            'latitude': lat,
            'longitude': lon
        }

    except requests.RequestException as e:
        print(f"API request failed: {e}")
        return get_mock_weather("Default")


# -------------------------------------------------------------------------
# Test Function (for manual run)
# -------------------------------------------------------------------------

def main():
    """Test weather API functions."""
    test_states = ['Maharashtra', 'Punjab', 'Kerala', 'Rajasthan']

    print("Testing Weather API Functions")
    print("=" * 50)
    for state in test_states:
        print(f"\nWeather for {state}:")
        weather = get_current_weather(state)
        print(f"Temperature: {weather['avg_temp_c']}°C")
        print(f"Rainfall: {weather['total_rainfall_mm']}mm")
        print(f"Humidity: {weather['avg_humidity_percent']}%")
        print(f"Valid data: {validate_weather_data(weather)}")

    # Test latitude/longitude weather
    print("\nTesting weather by coordinates (example: Pune, Maharashtra)")
    lat, lon = 18.5204, 73.8567
    coord_weather = get_weather_by_coordinates(lat, lon)
    print(f"Temperature: {coord_weather['avg_temp_c']}°C")
    print(f"Rainfall: {coord_weather['total_rainfall_mm']}mm")
    print(f"Humidity: {coord_weather['avg_humidity_percent']}%")


# -------------------------------------------------------------------------
# Entry Point
# -------------------------------------------------------------------------

if __name__ == "__main__":
    main()

