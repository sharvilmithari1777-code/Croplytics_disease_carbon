// ==================== Global Utilities ====================

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initAnimations();
    initUploadZone();
    initFormValidation();
    initMobileMenu();
});

// ==================== Navigation ====================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
}

// ==================== Scroll Animations ====================

function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.glass-card, .feature-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ==================== Image Upload ====================

function initUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.querySelector('.preview-container');
    const previewImage = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeFile');
    const uploadForm = document.getElementById('uploadForm');
    
    if (!uploadZone || !fileInput) return;
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop events
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    // Remove file
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearPreview();
        });
    }
    
    function handleFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showAlert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showAlert('File size must be less than 10MB', 'error');
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage) previewImage.src = e.target.result;
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = formatFileSize(file.size);
            if (previewContainer) previewContainer.classList.add('active');
            uploadZone.classList.add('hidden');
        };
        reader.readAsDataURL(file);
        
        // Create a new FileList-like object to preserve the file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
    }
    
    function clearPreview() {
        if (previewContainer) previewContainer.classList.remove('active');
        uploadZone.classList.remove('hidden');
        if (previewImage) previewImage.src = '';
        fileInput.value = '';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// ==================== Form Validation ====================

function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Clear previous errors
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
            
            // Validate required fields
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input, 'This field is required');
                }
            });
            
            // Validate email fields
            form.querySelectorAll('input[type="email"]').forEach(input => {
                if (input.value && !isValidEmail(input.value)) {
                    isValid = false;
                    showFieldError(input, 'Please enter a valid email address');
                }
            });
            
            // Validate password fields
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirm_password"]');
            
            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    isValid = false;
                    showFieldError(confirmPassword, 'Passwords do not match');
                }
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

function showFieldError(input, message) {
    input.classList.add('error');
    const error = document.createElement('div');
    error.className = 'error-message text-error mt-1';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== Alert System ====================

function showAlert(message, type = 'info') {
    // Remove existing alerts
    document.querySelectorAll('.alert-toast').forEach(el => el.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-toast`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    
    alert.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:auto;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// ==================== Loading State ====================

function showLoading() {
    let loader = document.querySelector('.loading');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'loading';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }
    loader.classList.add('active');
}

function hideLoading() {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.classList.remove('active');
    }
}

// ==================== Auth Page Toggle ====================

function toggleAuthForm(formType) {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    
    if (formType === 'register') {
        if (loginSection) loginSection.style.display = 'none';
        if (registerSection) registerSection.style.display = 'block';
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (registerSection) registerSection.style.display = 'none';
    }
}

// ==================== Weather Data Fetching ====================

async function fetchWeatherData(state) {
    try {
        const response = await fetch(`/weather/${encodeURIComponent(state)}`);
        const data = await response.json();
        
        if (data.success && data.weather_data) {
            return data.weather_data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`/get_weather_by_coords?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        
        if (data.success && data.weather_data) {
            return data.weather_data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        return null;
    }
}

// ==================== Soil Data Fetching ====================

async function fetchSoilData(state) {
    try {
        const response = await fetch(`/soil-data/${encodeURIComponent(state)}`);
        const data = await response.json();
        
        if (data.success && data.soil_data) {
            return data.soil_data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching soil data:', error);
        return null;
    }
}

// ==================== Geolocation ====================

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
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
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// ==================== Yield Prediction ====================

async function predictYield(formData) {
    showLoading();
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        hideLoading();
        
        if (data.success) {
            return data;
        } else {
            showAlert(data.error || 'Prediction failed', 'error');
            return null;
        }
    } catch (error) {
        hideLoading();
        showAlert('Error making prediction. Please try again.', 'error');
        console.error('Prediction error:', error);
        return null;
    }
}

// ==================== Carbon Calculator ====================

function calculateCarbonFootprint(data) {
    // Simple carbon footprint calculation based on farming inputs
    // This is a simplified model - real calculations would be more complex
    
    const {
        landArea = 0,
        fertilizerKg = 0,
        pesticideKg = 0,
        fuelLiters = 0,
        electricityKwh = 0,
        irrigationType = 'none'
    } = data;
    
    // Carbon emission factors (kg CO2 equivalent per unit)
    const FERTILIZER_FACTOR = 4.5;  // kg CO2e per kg fertilizer
    const PESTICIDE_FACTOR = 25;    // kg CO2e per kg pesticide
    const DIESEL_FACTOR = 2.68;     // kg CO2e per liter diesel
    const ELECTRICITY_FACTOR = 0.5; // kg CO2e per kWh (varies by region)
    
    // Irrigation factors (kg CO2e per hectare)
    const IRRIGATION_FACTORS = {
        'none': 0,
        'drip': 50,
        'sprinkler': 150,
        'flood': 300
    };
    
    // Calculate emissions
    const fertilizerEmissions = fertilizerKg * FERTILIZER_FACTOR;
    const pesticideEmissions = pesticideKg * PESTICIDE_FACTOR;
    const fuelEmissions = fuelLiters * DIESEL_FACTOR;
    const electricityEmissions = electricityKwh * ELECTRICITY_FACTOR;
    const irrigationEmissions = (IRRIGATION_FACTORS[irrigationType] || 0) * landArea;
    
    const totalEmissions = fertilizerEmissions + pesticideEmissions + 
                          fuelEmissions + electricityEmissions + irrigationEmissions;
    
    // Calculate per hectare if land area provided
    const perHectare = landArea > 0 ? totalEmissions / landArea : 0;
    
    return {
        total: Math.round(totalEmissions * 100) / 100,
        perHectare: Math.round(perHectare * 100) / 100,
        breakdown: {
            fertilizer: Math.round(fertilizerEmissions * 100) / 100,
            pesticide: Math.round(pesticideEmissions * 100) / 100,
            fuel: Math.round(fuelEmissions * 100) / 100,
            electricity: Math.round(electricityEmissions * 100) / 100,
            irrigation: Math.round(irrigationEmissions * 100) / 100
        }
    };
}

// ==================== Utility Functions ====================

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

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Animate counter
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Export functions for use in other scripts
window.showAlert = showAlert;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.predictYield = predictYield;
window.calculateCarbonFootprint = calculateCarbonFootprint;
window.fetchWeatherData = fetchWeatherData;
window.fetchSoilData = fetchSoilData;
window.getCurrentLocation = getCurrentLocation;
