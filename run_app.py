"""
Production-ready script to run the Flask app
This script suppresses warnings and provides cleaner output
"""
import os
import sys
import warnings
import logging

# Suppress all warnings
warnings.filterwarnings('ignore')

# Suppress Flask/Werkzeug logging
logging.getLogger('werkzeug').setLevel(logging.ERROR)
os.environ['WERKZEUG_RUN_MAIN'] = 'true'

# Import and run the app
if __name__ == '__main__':
    print("\n" + "="*60)
    print("Agricultural AI Platform")
    print("="*60)
    print("\nStarting server...")
    print("Access the application at: http://127.0.0.1:5000")
    print("Press CTRL+C to stop the server\n")
    print("="*60 + "\n")
    
    # Import app after setting up environment
    from app import app
    
    # Run without reloader to avoid duplicate output
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        use_reloader=False,
        threaded=True
    )

