export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' };
  if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  if (!/(?=.*[A-Z])/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  if (!/(?=.*\d)/.test(password)) return { isValid: false, message: 'Password must contain at least one number' };
  if (!/(?=.*[!@#$%^&*])/.test(password)) return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  return { isValid: true, message: '' };
};

export const validateAadhar = (aadharNumber) => {
  if (!aadharNumber) return { isValid: false, message: 'Aadhar number is required' };
  const cleanAadhar = aadharNumber.toString().replace(/\s/g, '');
  if (!/^\d{12}$/.test(cleanAadhar)) return { isValid: false, message: 'Aadhar number must be exactly 12 digits' };
  return { isValid: true, message: '' };
};

export const validateImage = (file) => {
  if (!file) return { isValid: false, message: 'Aadhar image is required' };
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Please upload a JPG, JPEG, or PNG image' };
  }
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return { isValid: false, message: 'Image size must be less than 2MB' };
  }
  
  return { isValid: true, message: '' };
};

export const validateFullName = (name) => {
  if (!name) return { isValid: false, message: 'Full name is required' };
  if (name.trim().length < 2) return { isValid: false, message: 'Full name must be at least 2 characters long' };
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return { isValid: false, message: 'Full name can only contain letters and spaces' };
  return { isValid: true, message: '' };
};