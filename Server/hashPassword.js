import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// If this is for hashing a user password for seeding database
const password = "Minesh121*"; // Replace with the actual password you want to hash

const hashPassword = async () => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    console.log(`Hashed Password: ${hashed}`);
    return hashed;
  } catch (error) {
    console.error('Error hashing password:', error.message);
  }
};

hashPassword();
export default hashPassword;