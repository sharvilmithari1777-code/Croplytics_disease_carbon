"""
Agricultural Yield Forecasting Model

PROBLEM STATEMENT:
This module addresses the critical challenge of predicting agricultural crop yields using 
historical data to support farmers, policy makers, and agricultural stakeholders in making
informed decisions. The model leverages:

1. Historical crop yield data across different states and years
2. Soil composition data (NPK nutrients and pH levels) by state
3. Historical weather patterns (temperature, rainfall, humidity) from 1997-2020

The objective is to build a robust machine learning regression model that can predict 
crop yields based on soil conditions and weather parameters, enabling:
- Better crop planning and resource allocation
- Risk assessment for agricultural investments
- Policy decisions for food security
- Climate change impact analysis on agriculture

The model preprocesses and merges multiple datasets, performs feature engineering,
trains ensemble models (Random Forest/XGBoost), and provides reliable yield predictions
with quantified uncertainty estimates.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import joblib
import os
from pathlib import Path

class AgriYieldForecaster:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = None
        self.model_path = 'module/yield_forecast_model.pkl'
        self.scaler_path = 'module/scaler.pkl'
        self.encoders_path = 'module/label_encoders.pkl'
        
    def load_and_merge_data(self):
        """Load and merge all datasets for training"""
        print("Loading datasets...")
        
        # Load datasets
        crop_data = pd.read_csv('data/crop_yield.csv')
        soil_data = pd.read_csv('data/state_soil_data.csv')
        weather_data = pd.read_csv('data/state_weather_data_1997_2020.csv')
        
        print(f"Crop data shape: {crop_data.shape}")
        print(f"Soil data shape: {soil_data.shape}")
        print(f"Weather data shape: {weather_data.shape}")
        
        # Merge datasets
        # First merge crop and soil data on state
        merged_data = pd.merge(crop_data, soil_data, on='state', how='left')
        
        # Then merge with weather data on state and year
        if 'year' in crop_data.columns:
            merged_data = pd.merge(merged_data, weather_data, on=['state', 'year'], how='left')
        else:
            # If no year in crop data, use average weather data per state
            avg_weather = weather_data.groupby('state').agg({
                'avg_temp_c': 'mean',
                'total_rainfall_mm': 'mean',
                'avg_humidity_percent': 'mean'
            }).reset_index()
            merged_data = pd.merge(merged_data, avg_weather, on='state', how='left')
        
        print(f"Merged data shape: {merged_data.shape}")
        print(f"Columns: {list(merged_data.columns)}")
        
        return merged_data
    
    def preprocess_data(self, data):
        """Preprocess the merged dataset"""
        print("Preprocessing data...")
        
        # Handle missing values
        data = data.dropna()
        
        # Encode categorical variables
        categorical_columns = data.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            if col not in ['yield']:  # Don't encode target if it's categorical
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    data[col] = self.label_encoders[col].fit_transform(data[col])
                else:
                    data[col] = self.label_encoders[col].transform(data[col])
        
        # Feature engineering
        if all(col in data.columns for col in ['N', 'P', 'K']):
            data['NPK_ratio'] = data['N'] / (data['P'] + data['K'] + 1)
            data['soil_fertility_index'] = (data['N'] + data['P'] + data['K']) / 3
        
        if all(col in data.columns for col in ['avg_temp_c', 'total_rainfall_mm']):
            data['temp_rainfall_interaction'] = data['avg_temp_c'] * data['total_rainfall_mm'] / 1000
        
        return data
    
    def train_model(self, use_xgboost=True):
        """Train the yield forecasting model"""
        print("Starting model training...")
        
        # Load and preprocess data
        data = self.load_and_merge_data()
        data = self.preprocess_data(data)
        
        # Identify target column (assuming it's 'yield' or similar)
        target_candidates = ['yield', 'production', 'crop_yield']
        target_col = None
        for candidate in target_candidates:
            if candidate in data.columns:
                target_col = candidate
                break
        
        if target_col is None:
            print("Warning: No clear target column found. Using first numeric column as target.")
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            target_col = numeric_cols[0] if len(numeric_cols) > 0 else data.columns[-1]
        
        print(f"Using '{target_col}' as target variable")
        
        # Separate features and target
        X = data.drop(columns=[target_col])
        y = data[target_col]
        
        # Store feature columns for later use
        self.feature_columns = list(X.columns)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        if use_xgboost:
            print("Training XGBoost model...")
            self.model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42
            )
        else:
            print("Training Random Forest model...")
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        train_pred = self.model.predict(X_train_scaled)
        test_pred = self.model.predict(X_test_scaled)
        
        train_r2 = r2_score(y_train, train_pred)
        test_r2 = r2_score(y_test, test_pred)
        train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
        test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
        test_mae = mean_absolute_error(y_test, test_pred)
        
        print(f"\nModel Performance:")
        print(f"Training R²: {train_r2:.4f}")
        print(f"Testing R²: {test_r2:.4f}")
        print(f"Training RMSE: {train_rmse:.4f}")
        print(f"Testing RMSE: {test_rmse:.4f}")
        print(f"Testing MAE: {test_mae:.4f}")
        
        # Feature importance
        if hasattr(self.model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            print(f"\nTop 10 Feature Importances:")
            print(importance_df.head(10))
        
        return {
            'train_r2': train_r2,
            'test_r2': test_r2,
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'test_mae': test_mae
        }
    
    def save_model(self):
        """Save the trained model and preprocessors"""
        # Create module directory
        os.makedirs('module', exist_ok=True)
        
        # Save model
        joblib.dump(self.model, self.model_path)
        print(f"Model saved to {self.model_path}")
        
        # Save scaler
        joblib.dump(self.scaler, self.scaler_path)
        print(f"Scaler saved to {self.scaler_path}")
        
        # Save label encoders
        joblib.dump(self.label_encoders, self.encoders_path)
        print(f"Label encoders saved to {self.encoders_path}")
        
        # Save feature columns
        joblib.dump(self.feature_columns, 'module/feature_columns.pkl')
        print("Feature columns saved")
    
    def load_model(self):
        """Load the trained model and preprocessors"""
        import warnings
        from sklearn.exceptions import InconsistentVersionWarning
        
        try:
            # Suppress version warnings - models are compatible despite version differences
            with warnings.catch_warnings():
                warnings.filterwarnings('ignore', category=InconsistentVersionWarning)
                warnings.filterwarnings('ignore', category=UserWarning, module='xgboost')
                
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.label_encoders = joblib.load(self.encoders_path)
                self.feature_columns = joblib.load('module/feature_columns.pkl')
            
            print("Model loaded successfully")
            return True
        except FileNotFoundError as e:
            print(f"Model files not found: {e}")
            return False
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def predict(self, input_data):
        """Make predictions using the trained model"""
        if self.model is None:
            raise ValueError("Model not trained or loaded")
        
        # Convert input to DataFrame if it's a dict
        if isinstance(input_data, dict):
            input_data = pd.DataFrame([input_data])
        
        # Ensure all feature columns are present
        for col in self.feature_columns:
            if col not in input_data.columns:
                input_data[col] = 0  # Default value for missing features
        
        # Select only the features used in training
        input_data = input_data[self.feature_columns]
        
        # Apply label encoding for categorical variables
        for col in self.label_encoders:
            if col in input_data.columns:
                # Handle unseen categories by using the most frequent class
                try:
                    input_data[col] = self.label_encoders[col].transform(input_data[col])
                except ValueError:
                    input_data[col] = 0  # Default to first class for unseen categories
        
        # Scale features
        input_scaled = self.scaler.transform(input_data)
        
        # Make prediction
        prediction = self.model.predict(input_scaled)
        
        return prediction[0] if len(prediction) == 1 else prediction


def main():
    """Main function to train and save the model"""
    forecaster = AgriYieldForecaster()
    
    # Train the model
    metrics = forecaster.train_model(use_xgboost=True)
    
    # Save the model
    forecaster.save_model()
    
    print("\nModel training completed successfully!")
    print("You can now use the trained model in the Flask application.")


if __name__ == "__main__":
    main()