import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Lock, Phone, MapPin, CreditCard, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
// Fixed import path to match your CSS file
import './App.css';

const App = () => {
  const [currentRoute, setCurrentRoute] = useState('form');
  const [submittedData, setSubmittedData] = useState(null);

  const navigateToSuccess = (data) => {
    setSubmittedData(data);
    setCurrentRoute('success');
  };

  const navigateToForm = () => {
    setCurrentRoute('form');
  };

  return (
    <div className="app-container">
      {/* Background elements */}
      <div className="bg-elements">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>
      
      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      {currentRoute === 'form' ? (
        <RegistrationForm onSuccess={navigateToSuccess} />
      ) : (
        <SuccessPage data={submittedData} onBack={navigateToForm} />
      )}
    </div>
  );
};

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    countryCode: '+91',
    phoneNumber: '',
    country: '',
    city: '',
    panNo: '',
    aadharNo: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const countries = [
    { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'] },
    { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'] },
    { code: 'UK', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool'] },
    { code: 'CA', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'] }
  ];

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      
      case 'username':
        return value.trim().length < 3 ? 'Must be at least 3 characters' : 
               !/^[a-zA-Z0-9_]+$/.test(value) ? 'Only letters, numbers, and underscores allowed' : '';
      
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
      
      case 'password':
        return value.length < 8 ? 'Must be at least 8 characters' :
               !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 'Must contain uppercase, lowercase, and number' : '';
      
      case 'phoneNumber':
        return !/^\d{10}$/.test(value) ? 'Must be exactly 10 digits' : '';
      
      case 'country':
        return !value ? 'Please select a country' : '';
      
      case 'city':
        return !value ? 'Please select a city' : '';
      
      case 'panNo':
        return !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? 'Invalid PAN format (e.g., ABCDE1234F)' : '';
      
      case 'aadharNo':
        return !/^\d{12}$/.test(value) ? 'Must be exactly 12 digits' : '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' && { city: '' })
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      onSuccess(formData);
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => {
      const value = formData[key];
      return value.trim() !== '' && validateField(key, value) === '';
    });
  };

  const selectedCountry = countries.find(c => c.code === formData.country);
  const cities = selectedCountry ? selectedCountry.cities : [];

  const getStepFields = (step) => {
    switch(step) {
      case 1: return ['firstName', 'lastName', 'username', 'email'];
      case 2: return ['password', 'countryCode', 'phoneNumber'];
      case 3: return ['country', 'city', 'panNo', 'aadharNo'];
      default: return [];
    }
  };

  const isStepValid = (step) => {
    const stepFields = getStepFields(step);
    return stepFields.every(field => {
      const value = formData[field];
      return value.trim() !== '' && validateField(field, value) === '';
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {/* Header */}
        <div className="form-header">
          <Sparkles className="header-icon" size={48} />
          <h1 className="header-title">Create Your Account</h1>
          <p className="header-subtitle">Join us for an amazing experience</p>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-steps">
              {[1, 2, 3].map((step) => (
                <div key={step} className="progress-step">
                  <div className={`step-circle ${
                    currentStep > step ? 'completed' : 
                    currentStep === step ? 'active' : 'inactive'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`step-line ${
                      currentStep > step ? 'completed' : 'inactive'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="progress-labels">
              <span className="progress-label">Personal</span>
              <span className="progress-label">Security</span>
              <span className="progress-label">Identity</span>
            </div>
          </div>
        </div>

        <div className="form-content">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="step-header">
                <User className="step-icon" size={32} />
                <h2 className="step-title">Personal Information</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Choose a unique username"
                />
                {errors.username && (
                  <p className="error-message">
                    <AlertCircle className="error-icon" size={16} />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail className="label-icon" size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="error-message">
                    <AlertCircle className="error-icon" size={16} />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Security & Contact */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-header">
                <Lock className="step-icon" size={32} />
                <h2 className="step-title">Security & Contact</h2>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock className="label-icon" size={16} />
                  Password *
                </label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-message">
                    <AlertCircle className="error-icon" size={16} />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="label-icon" size={16} />
                  Phone Number *
                </label>
                <div className="phone-container">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="form-input form-select country-code-select"
                  >
                    {countryCodes.map(cc => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code} ({cc.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input phone-input ${errors.phoneNumber ? 'error' : ''}`}
                    placeholder="1234567890"
                    maxLength="10"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="error-message">
                    <AlertCircle className="error-icon" size={16} />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Location & Identity */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="step-header">
                <CreditCard className="step-icon" size={32} />
                <h2 className="step-title">Location & Identity</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <MapPin className="label-icon" size={16} />
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input form-select ${errors.country ? 'error' : ''}`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.country}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!formData.country}
                    className={`form-input form-select ${errors.city ? 'error' : ''} ${!formData.country ? 'disabled' : ''}`}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    name="panNo"
                    value={formData.panNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.panNo ? 'error' : ''}`}
                    placeholder="ABCDE1234F"
                    style={{ textTransform: 'uppercase' }}
                    maxLength="10"
                  />
                  {errors.panNo && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.panNo}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.aadharNo ? 'error' : ''}`}
                    placeholder="123456789012"
                    maxLength="12"
                  />
                  {errors.aadharNo && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" size={16} />
                      {errors.aadharNo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="nav-button nav-button-secondary"
              >
                <ArrowLeft className="nav-button-icon left" size={18} />
                Previous
              </button>
            )}

            <div style={{ flex: 1 }}></div>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className={`nav-button ${
                  isStepValid(currentStep) ? 'nav-button-primary' : ''
                }`}
              >
                Next
                <ArrowRight className="nav-button-icon right" size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`nav-button ${
                  isFormValid() ? 'nav-button-success' : ''
                }`}
              >
                <Sparkles className="nav-button-icon left" size={18} />
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = ({ data, onBack }) => {
  const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' }
  ];

  const getCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  return (
    <div className="form-container">
      <div className="form-card success-container">
        {/* Success Header */}
        <div className="success-header">
          <CheckCircle className="success-icon" size={64} />
          <h1 className="success-title">Welcome Aboard! 🎉</h1>
          <p className="success-subtitle">Your account has been created successfully</p>
        </div>

        <div className="form-content">
          <div className="data-container">
            <h2 className="data-title">
              <User className="data-title-icon" size={24} />
              Your Registration Details
            </h2>
            
            <div className="data-grid">
              <div className="data-card">
                <span className="data-label">Full Name</span>
                <p className="data-value">{data.firstName} {data.lastName}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">Username</span>
                <p className="data-value">@{data.username}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">
                  <Mail className="data-label-icon" size={16} />
                  Email
                </span>
                <p className="data-value">{data.email}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">
                  <Phone className="data-label-icon" size={16} />
                  Phone
                </span>
                <p className="data-value">{data.countryCode} {data.phoneNumber}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">
                  <MapPin className="data-label-icon" size={16} />
                  Location
                </span>
                <p className="data-value">{data.city}, {getCountryName(data.country)}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">PAN Number</span>
                <p className="data-value">{data.panNo}</p>
              </div>
              
              <div className="data-card">
                <span className="data-label">Aadhar Number</span>
                <p className="data-value">{data.aadharNo.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}</p>
              </div>
            </div>
          </div>

          <div className="form-navigation" style={{ justifyContent: 'center' }}>
            <button
              onClick={onBack}
              className="nav-button nav-button-primary"
            >
              <ArrowLeft className="nav-button-icon left" size={18} />
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;