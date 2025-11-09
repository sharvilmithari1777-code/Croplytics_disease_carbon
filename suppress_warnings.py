"""
Warning suppression module
This module suppresses version compatibility warnings that don't affect functionality
"""
import warnings
import os

# Suppress sklearn version warnings (models are compatible)
try:
    from sklearn.exceptions import InconsistentVersionWarning
    warnings.filterwarnings('ignore', category=InconsistentVersionWarning)
except ImportError:
    pass

# Suppress XGBoost version warnings
warnings.filterwarnings('ignore', category=UserWarning, module='xgboost')

# Suppress other common warnings
warnings.filterwarnings('ignore', category=FutureWarning)
warnings.filterwarnings('ignore', category=DeprecationWarning)

# Set environment variable to suppress XGBoost warnings
os.environ['PYTHONWARNINGS'] = 'ignore::UserWarning:xgboost'

