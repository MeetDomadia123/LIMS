import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, X, User, Mail, Lock, CreditCard, Loader2 } from 'lucide-react';
import { validateEmail, validatePassword, validateAadhar, validateImage, validateFullName } from '../utils/validation';
import { showToast } from '../components/Toast';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    aadharNumber: '',
    aadharImage: null,
    role: ''
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access and user management' },
    { value: 'lab-technician', label: 'Lab Technician', description: 'QR scanning for inward inventory' },
    { value: 'researcher', label: 'Researcher', description: 'Inventory search and management' },
    { value: 'manufacturing-engineer', label: 'Manufacturing Engineer', description: 'QR scanning for outward inventory' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return validateFullName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'aadharNumber':
        return validateAadhar(value);
      case 'aadharImage':
        return validateImage(value);
      default:
        return { isValid: true, message: '' };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImage(file);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, aadharImage: validation.message }));
        return;
      }

      setFormData(prev => ({ ...prev, aadharImage: file }));
      setErrors(prev => ({ ...prev, aadharImage: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, aadharImage: null }));
    setImagePreview(null);
    setErrors(prev => ({ ...prev, aadharImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key === 'aadharImage' && formData[key]) {
        const validation = validateField(key, formData[key]);
        if (!validation.isValid) {
          newErrors[key] = validation.message;
        }
      } else if (key !== 'aadharImage') {
        const validation = validateField(key, formData[key]);
        if (!validation.isValid) {
          newErrors[key] = validation.message;
        }
      }
    });

    // Check required fields
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.aadharImage) {
      newErrors.aadharImage = 'Aadhar image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Use real API instead of mockAuth
      const response = await fetch('http://localhost:3001/api/registration/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.fullName.toLowerCase().replace(/\s+/g, ''), // Generate username from name
          email: formData.email,
          password: formData.password,
          first_name: formData.fullName.split(' ')[0],
          last_name: formData.fullName.split(' ').slice(1).join(' '),
          requested_role: formData.role,
          reason: `Registration request for ${formData.role} role`
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast.success(result.message);
        navigate('/login', { 
          state: { 
            message: "Registration request submitted! You'll be notified after admin approval." 
          }
        });
      } else {
        showToast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our inventory management system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                />
              </div>
              {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
            </div>

            {/* Aadhar Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Image * (JPG/JPEG/PNG, Max 2MB)
              </label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                    id="aadhar-upload"
                  />
                  <label
                    htmlFor="aadhar-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      errors.aadharImage ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload Aadhar image</p>
                    <p className="text-xs text-gray-400">JPG, JPEG, PNG up to 2MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aadhar preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errors.aadharImage && <p className="mt-1 text-sm text-red-600">{errors.aadharImage}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.role === role.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          formData.role === role.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {formData.role === role.value && (
                            <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{role.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;