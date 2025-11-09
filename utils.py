"""
Agricultural Utility Functions

This module contains helper functions for agricultural predictions and recommendations.
Extracted from app.py to keep the main application clean and modular.
"""

from typing import Dict, List, Optional


def get_irrigation_recommendation(rainfall_mm: float, crop_water_need: float = 40.0) -> str:
    """
    Provide irrigation recommendations based on rainfall and crop water needs
    
    Args:
        rainfall_mm (float): Total rainfall in millimeters
        crop_water_need (float): Crop water requirement in mm (default: 40mm daily)
    
    Returns:
        str: Irrigation recommendation message
    """
    # Convert monthly rainfall to daily average
    daily_rainfall = rainfall_mm / 30
    
    if daily_rainfall < crop_water_need:
        deficit = crop_water_need - daily_rainfall
        return f"💧 Irrigation needed: {deficit:.1f} mm more per day"
    elif daily_rainfall < crop_water_need * 1.2:
        return f"⚠️ Monitor closely: {daily_rainfall:.1f} mm rainfall (barely sufficient)"
    else:
        return "✅ No irrigation needed (rainfall sufficient)"


def suggest_crop_cycle(temp: float, rainfall: float) -> str:
    """
    Suggest appropriate crop cycle based on temperature and rainfall
    
    Args:
        temp (float): Average temperature in Celsius
        rainfall (float): Total rainfall in mm
    
    Returns:
        str: Crop cycle recommendation
    """
    # Define crop cycle recommendations based on climate conditions
    if temp < 20 and rainfall < 800:
        return "🌾 Winter Wheat → Plant in Nov-Dec, Harvest in Mar-Apr"
    elif 20 <= temp < 25 and 800 <= rainfall < 1200:
        return "🌾 Mixed Crops → Wheat/Barley in winter, Maize in summer"
    elif 25 <= temp < 30 and 1000 <= rainfall < 1800:
        return "🌾 Rice/Maize → Plant in Jun-Jul, Harvest in Oct-Nov"
    elif temp >= 30 and rainfall >= 1200:
        return "🌾 Rice (Intensive) → Kharif: Jun-Oct, Rabi: Nov-Mar"
    elif temp >= 28 and rainfall < 1000:
        return "🌾 Drought-Resistant → Millets, Sorghum, Cotton"
    elif temp < 25 and rainfall >= 1500:
        return "🌾 High-Moisture Crops → Rice, Sugarcane, Jute"
    else:
        return "🌱 Variable Conditions → Consult local agricultural extension office"


def get_soil_health_assessment(n: float, p: float, k: float, ph: float) -> Dict:
    """
    Assess soil health based on NPK values and pH
    
    Args:
        n (float): Nitrogen content in mg/kg
        p (float): Phosphorus content in mg/kg
        k (float): Potassium content in mg/kg
        ph (float): Soil pH value
    
    Returns:
        dict: Soil health assessment with recommendations
    """
    assessment = {
        'overall_health': 'Good',
        'recommendations': [],
        'nutrient_status': {}
    }
    
    # Assess Nitrogen levels
    if n < 200:
        assessment['nutrient_status']['nitrogen'] = 'Low'
        assessment['recommendations'].append("Add nitrogen fertilizers (urea/ammonium sulfate)")
    elif n > 400:
        assessment['nutrient_status']['nitrogen'] = 'High'
        assessment['recommendations'].append("Reduce nitrogen fertilizer, risk of leaf burn")
    else:
        assessment['nutrient_status']['nitrogen'] = 'Adequate'
    
    # Assess Phosphorus levels
    if p < 15:
        assessment['nutrient_status']['phosphorus'] = 'Low'
        assessment['recommendations'].append("Add phosphorus fertilizers (DAP/SSP)")
    elif p > 50:
        assessment['nutrient_status']['phosphorus'] = 'High'
        assessment['recommendations'].append("Reduce phosphorus, may cause zinc deficiency")
    else:
        assessment['nutrient_status']['phosphorus'] = 'Adequate'
    
    # Assess Potassium levels
    if k < 150:
        assessment['nutrient_status']['potassium'] = 'Low'
        assessment['recommendations'].append("Add potassium fertilizers (MOP/SOP)")
    elif k > 300:
        assessment['nutrient_status']['potassium'] = 'High'
        assessment['recommendations'].append("Reduce potassium fertilizer application")
    else:
        assessment['nutrient_status']['potassium'] = 'Adequate'
    
    # Assess pH levels
    if ph < 5.5:
        assessment['ph_status'] = 'Too Acidic'
        assessment['recommendations'].append("Add lime to increase pH (target: 6.0-7.0)")
    elif ph > 8.5:
        assessment['ph_status'] = 'Too Alkaline'
        assessment['recommendations'].append("Add sulfur or organic matter to reduce pH")
    elif 6.0 <= ph <= 7.5:
        assessment['ph_status'] = 'Optimal'
    else:
        assessment['ph_status'] = 'Acceptable'
    
    # Overall health assessment
    low_nutrients = sum([1 for status in assessment['nutrient_status'].values() if status == 'Low'])
    high_nutrients = sum([1 for status in assessment['nutrient_status'].values() if status == 'High'])
    ph_issues = assessment['ph_status'] in ['Too Acidic', 'Too Alkaline']
    
    if low_nutrients >= 2 or ph_issues:
        assessment['overall_health'] = 'Poor'
    elif low_nutrients == 1 or high_nutrients >= 1:
        assessment['overall_health'] = 'Fair'
    else:
        assessment['overall_health'] = 'Good'
    
    return assessment


def calculate_fertilizer_requirement(n: float, p: float, k: float, target_yield: float) -> Dict:
    """
    Calculate fertilizer requirements based on current soil status and target yield
    
    Args:
        n (float): Current nitrogen content
        p (float): Current phosphorus content  
        k (float): Current potassium content
        target_yield (float): Target crop yield
    
    Returns:
        dict: Fertilizer recommendations in kg/hectare
    """
    # Base fertilizer requirements (kg/hectare) for medium yield
    base_n = 120
    base_p = 60
    base_k = 40
    
    # Adjust based on target yield (assuming linear relationship)
    yield_factor = target_yield / 3000  # Assuming 3000 as average yield
    
    # Calculate requirements
    n_required = max(0, (base_n * yield_factor) - (n * 0.1))  # Convert mg/kg to approximate kg/ha
    p_required = max(0, (base_p * yield_factor) - (p * 0.2))
    k_required = max(0, (base_k * yield_factor) - (k * 0.15))
    
    return {
        'nitrogen_kg_per_ha': round(n_required, 1),
        'phosphorus_kg_per_ha': round(p_required, 1),
        'potassium_kg_per_ha': round(k_required, 1),
        'total_cost_estimate': round((n_required * 25 + p_required * 35 + k_required * 20), 2),  # Rough cost estimate
        'application_timing': {
            'nitrogen': 'Split application: 50% at sowing, 25% at tillering, 25% at flowering',
            'phosphorus': 'Full dose at sowing/transplanting',
            'potassium': 'Split application: 50% at sowing, 50% at flowering'
        }
    }


def get_weather_risk_assessment(temp: float, rainfall: float, humidity: float) -> Dict:
    """
    Assess weather-related risks for crop production
    
    Args:
        temp (float): Average temperature in Celsius
        rainfall (float): Total rainfall in mm
        humidity (float): Average humidity percentage
    
    Returns:
        dict: Weather risk assessment
    """
    risks = []
    risk_level = 'Low'
    
    # Temperature risks
    if temp < 10:
        risks.append("Frost risk - protect sensitive crops")
        risk_level = 'High'
    elif temp > 40:
        risks.append("Heat stress - provide shade/irrigation")
        risk_level = 'High'
    elif temp > 35:
        risks.append("High temperature - monitor crop stress")
        risk_level = 'Medium'
    
    # Rainfall risks
    if rainfall < 500:
        risks.append("Drought conditions - irrigation critical")
        risk_level = 'High' if risk_level != 'High' else 'High'
    elif rainfall > 2500:
        risks.append("Excess rainfall - drainage and fungal disease risk")
        risk_level = 'High' if risk_level != 'High' else 'High'
    elif rainfall > 2000:
        risks.append("High rainfall - monitor for waterlogging")
        risk_level = 'Medium' if risk_level == 'Low' else risk_level
    
    # Humidity risks
    if humidity > 85:
        risks.append("High humidity - fungal disease risk")
        risk_level = 'Medium' if risk_level == 'Low' else risk_level
    elif humidity < 30:
        risks.append("Low humidity - plant water stress")
        risk_level = 'Medium' if risk_level == 'Low' else risk_level
    
    # Combined conditions
    if temp > 30 and humidity > 80:
        risks.append("Hot & humid - pest and disease pressure")
        risk_level = 'High'
    
    if not risks:
        risks.append("Favorable weather conditions")
    
    return {
        'risk_level': risk_level,
        'risks': risks,
        'recommendations': get_weather_recommendations(temp, rainfall, humidity)
    }


def get_weather_recommendations(temp: float, rainfall: float, humidity: float) -> List[str]:
    """
    Get weather-based agricultural recommendations
    
    Args:
        temp (float): Average temperature
        rainfall (float): Total rainfall
        humidity (float): Average humidity
    
    Returns:
        list: List of recommendations
    """
    recommendations = []
    
    if temp > 35:
        recommendations.append("Install shade nets or increase irrigation frequency")
        recommendations.append("Schedule field operations for early morning or late evening")
    
    if rainfall < 600:
        recommendations.append("Install drip irrigation system for water efficiency")
        recommendations.append("Apply mulch to conserve soil moisture")
    
    if rainfall > 2000:
        recommendations.append("Ensure proper field drainage")
        recommendations.append("Apply preventive fungicide sprays")
    
    if humidity > 80:
        recommendations.append("Improve air circulation between crop rows")
        recommendations.append("Monitor for pest and disease outbreak")
    
    if temp < 15:
        recommendations.append("Use row covers or polytunnels for protection")
        recommendations.append("Delay sowing until soil temperature rises")
    
    return recommendations


def format_prediction_summary(prediction: float, input_data: Dict, weather_data: Optional[Dict] = None) -> Dict:
    """
    Format a comprehensive prediction summary
    
    Args:
        prediction (float): Predicted yield value
        input_data (dict): Input parameters used for prediction
        weather_data (dict, optional): Weather information
    
    Returns:
        dict: Formatted summary with all recommendations
    """
    summary = {
        'predicted_yield': prediction,
        'yield_category': get_yield_category(prediction),
        'irrigation_advice': get_irrigation_recommendation(input_data.get('total_rainfall_mm', 0)),
        'crop_cycle': suggest_crop_cycle(input_data.get('avg_temp_c', 25), input_data.get('total_rainfall_mm', 1000)),
        'soil_health': get_soil_health_assessment(
            input_data.get('N', 200),
            input_data.get('P', 30),
            input_data.get('K', 200),
            input_data.get('pH', 7)
        ),
        'weather_risks': get_weather_risk_assessment(
            input_data.get('avg_temp_c', 25),
            input_data.get('total_rainfall_mm', 1000),
            input_data.get('avg_humidity_percent', 65)
        )
    }
    
    if weather_data:
        summary['weather_data'] = weather_data
    
    return summary


def get_yield_category(yield_value: float) -> str:
    """
    Categorize yield value
    
    Args:
        yield_value (float): Predicted yield
    
    Returns:
        str: Yield category
    """
    if yield_value < 1500:
        return "Low Yield"
    elif yield_value < 3000:
        return "Medium Yield"
    elif yield_value < 4500:
        return "Good Yield"
    else:
        return "Excellent Yield"


def validate_input_parameters(data: Dict) -> Dict:
    """
    Validate input parameters for prediction
    
    Args:
        data (dict): Input parameters
    
    Returns:
        dict: Validation result with success status and errors if any
    """
    errors = []
    
    # Check required fields
    required_fields = ['N', 'P', 'K', 'pH', 'avg_temp_c', 'total_rainfall_mm', 'avg_humidity_percent']
    for field in required_fields:
        if field not in data or data[field] is None:
            errors.append(f"Missing required field: {field}")
    
    try:
        # Validate ranges
        if 'N' in data and (float(data['N']) < 0 or float(data['N']) > 1000):
            errors.append("Nitrogen value should be between 0-1000 mg/kg")
        
        if 'P' in data and (float(data['P']) < 0 or float(data['P']) > 200):
            errors.append("Phosphorus value should be between 0-200 mg/kg")
        
        if 'K' in data and (float(data['K']) < 0 or float(data['K']) > 1000):
            errors.append("Potassium value should be between 0-1000 mg/kg")
        
        if 'pH' in data and (float(data['pH']) < 0 or float(data['pH']) > 14):
            errors.append("pH value should be between 0-14")
        
        if 'avg_temp_c' in data and (float(data['avg_temp_c']) < -10 or float(data['avg_temp_c']) > 60):
            errors.append("Temperature should be between -10°C to 60°C")
        
        if 'total_rainfall_mm' in data and (float(data['total_rainfall_mm']) < 0 or float(data['total_rainfall_mm']) > 5000):
            errors.append("Rainfall should be between 0-5000 mm")
        
        if 'avg_humidity_percent' in data and (float(data['avg_humidity_percent']) < 0 or float(data['avg_humidity_percent']) > 100):
            errors.append("Humidity should be between 0-100%")
    
    except ValueError as e:
        errors.append("Invalid numeric values provided")
    
    return {
        'success': len(errors) == 0,
        'errors': errors
    }


def generate_farming_tips(soil_data: Dict, weather_data: Dict) -> List[str]:
    """
    Generate personalized farming tips based on soil and weather conditions
    
    Args:
        soil_data (dict): Soil parameter data
        weather_data (dict): Weather condition data
    
    Returns:
        list: List of farming tips
    """
    tips = []
    
    # Soil-based tips
    n_level = float(soil_data.get('N', 200))
    p_level = float(soil_data.get('P', 30))
    k_level = float(soil_data.get('K', 200))
    ph_level = float(soil_data.get('pH', 7))
    
    if n_level < 200:
        tips.append("🌿 Consider organic nitrogen sources like compost or vermicompost for sustainable soil improvement")
    
    if ph_level < 6.0:
        tips.append("🧪 Apply agricultural lime 2-3 months before planting to improve soil pH")
    elif ph_level > 8.0:
        tips.append("🧪 Add organic matter or sulfur to reduce soil alkalinity")
    
    # Weather-based tips
    temp = float(weather_data.get('avg_temp_c', 25))
    rainfall = float(weather_data.get('total_rainfall_mm', 1000))
    humidity = float(weather_data.get('avg_humidity_percent', 65))
    
    if temp > 32 and humidity > 75:
        tips.append("🦠 High temperature and humidity favor disease development - ensure good field ventilation")
    
    if rainfall < 700:
        tips.append("💧 Consider drought-tolerant crop varieties and water-efficient irrigation methods")
    elif rainfall > 1800:
        tips.append("🌊 Ensure adequate drainage and consider raised bed cultivation")
    
    # General tips
    tips.append("📅 Plan crop rotation to maintain soil health and reduce pest buildup")
    tips.append("🌱 Use certified seeds and follow recommended spacing for optimal yield")
    
    return tips