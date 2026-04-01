import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development_only';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // Attach user info to request
    next();
  });
};

export const isHost = (req, res, next) => {
  if (req.user.role !== 'host') {
    return res.status(403).json({ error: 'Access denied. Host role required.' });
  }
  next();
};
