import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user data (id, role) for later use
    next();
  } catch (err) {
    console.error('❌ Invalid Token');
    res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};
export default verifyToken;