/* ================================================
   CROPLYTICS - JavaScript Interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initNavigation();
  initFormValidation();
  initFileUpload();
  initAnimations();
  initDarkMode();
});

/* ================================================
   NAVIGATION
   ================================================ */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.navbar-nav');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

/* ================================================
   FORM VALIDATION
   ================================================ */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
    
    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(input);
      });
      
      input.addEventListener('input', function() {
        clearError(input);
      });
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  let isValid = true;
  let errorMessage = '';
  
  // Required check
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Password validation
  if (type === 'password' && value && input.dataset.minLength) {
    const minLength = parseInt(input.dataset.minLength);
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `Password must be at least ${minLength} characters`;
    }
  }
  
  // Confirm password
  if (input.dataset.confirm) {
    const confirmInput = document.querySelector(input.dataset.confirm);
    if (confirmInput && value !== confirmInput.value) {
      isValid = false;
      errorMessage = 'Passwords do not match';
    }
  }
  
  if (!isValid) {
    showError(input, errorMessage);
  } else {
    clearError(input);
  }
  
  return isValid;
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  input.classList.add('error');
  
  let errorEl = formGroup.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    formGroup.appendChild(errorEl);
  }
  errorEl.textContent = message;
  errorEl.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
}

function clearError(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  input.classList.remove('error');
  const errorEl = formGroup.querySelector('.form-error');
  if (errorEl) {
    errorEl.remove();
  }
}

/* ================================================
   FILE UPLOAD
   ================================================ */
function initFileUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  
  uploadAreas.forEach(area => {
    const input = area.querySelector('.upload-input');
    const preview = document.querySelector('.preview-container');
    const previewImage = document.querySelector('.preview-image');
    const fileName = document.querySelector('.file-name');
    
    if (!input) return;
    
    // Click to upload
    area.addEventListener('click', () => input.click());
    
    // Drag and drop
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });
    
    area.addEventListener('dragleave', () => {
      area.classList.remove('dragover');
    });
    
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0], input, preview, previewImage, fileName);
      }
    });
    
    // Input change
    input.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0], input, preview, previewImage, fileName);
      }
    });
  });
}

function handleFileSelect(file, input, preview, previewImage, fileName) {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showNotification('Please select a valid image file (JPG, PNG, GIF, WEBP)', 'error');
    return;
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showNotification('File size must be less than 10MB', 'error');
    return;
  }
  
  // Create a new DataTransfer to set files on input
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
  
  // Show preview
  if (preview && previewImage) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      preview.classList.add('active');
    };
    reader.readAsDataURL(file);
  }
  
  // Update file name
  if (fileName) {
    fileName.textContent = file.name;
  }
  
  showNotification('Image selected successfully!', 'success');
}

/* ================================================
   ANIMATIONS
   ================================================ */
function initAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  // Stagger animation for cards
  const cardContainers = document.querySelectorAll('.quick-actions, .product-grid');
  cardContainers.forEach(container => {
    const cards = container.children;
    Array.from(cards).forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');
    });
  });
}

/* ================================================
   DARK MODE (already default, but toggle if needed)
   ================================================ */
function initDarkMode() {
  // Dark mode is default, but this allows for theme switching if needed
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
    
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }
}

/* ================================================
   NOTIFICATIONS
   ================================================ */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto dismiss
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/* ================================================
   WEATHER DATA
   ================================================ */
async function fetchWeatherData(state) {
  try {
    const response = await fetch(`/weather/${encodeURIComponent(state)}`);
    const data = await response.json();
    
    if (data.success) {
      return data.weather_data;
    } else {
      throw new Error(data.error || 'Failed to fetch weather data');
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    showNotification('Failed to fetch weather data', 'error');
    return null;
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`/get_weather_by_coords?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    
    if (data.success) {
      return data.weather_data;
    } else {
      throw new Error(data.error || 'Failed to fetch weather data');
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

/* ================================================
   SOIL DATA
   ================================================ */
async function fetchSoilData(state) {
  try {
    const response = await fetch(`/soil-data/${encodeURIComponent(state)}`);
    const data = await response.json();
    
    if (data.success) {
      return data.soil_data;
    } else {
      throw new Error(data.error || 'Failed to fetch soil data');
    }
  } catch (error) {
    console.error('Soil fetch error:', error);
    showNotification('Failed to fetch soil data', 'error');
    return null;
  }
}

async function fetchSoilByCoords(lat, lon) {
  try {
    const response = await fetch(`/get_soil_by_coords?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    
    if (data.success) {
      return data.soil_data;
    } else {
      throw new Error(data.error || 'Failed to fetch soil data');
    }
  } catch (error) {
    console.error('Soil fetch error:', error);
    return null;
  }
}

/* ================================================
   YIELD PREDICTION
   ================================================ */
async function predictYield(inputData) {
  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Prediction failed');
    }
  } catch (error) {
    console.error('Prediction error:', error);
    showNotification('Failed to get prediction', 'error');
    return null;
  }
}

/* ================================================
   GEOLOCATION
   ================================================ */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/* ================================================
   UTILITY FUNCTIONS
   ================================================ */
function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in templates
window.Croplytics = {
  showNotification,
  fetchWeatherData,
  fetchWeatherByCoords,
  fetchSoilData,
  fetchSoilByCoords,
  predictYield,
  getCurrentLocation,
  formatNumber,
  debounce,
  throttle
};
