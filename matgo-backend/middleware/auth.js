import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT tokens
 * Verifies the token from the Authorization header
 * Adds the decoded user info to the request object if valid
 */
export default function auth(req, res, next) {
  // Get token from Authorization header or cookie
  const authHeader = req.headers.authorization;
  const headerToken = authHeader ? authHeader.split(' ')[1] : null;
  const cookieToken = req.cookies ? req.cookies[process.env.COOKIE_NAME || 'matgo_token'] : null;
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'Access denied', message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'matgo_secret');

    // Ensure account is approved
    if (decoded && decoded.approved === false) {
      return res.status(403).json({ error: 'Account not approved', message: 'Please wait for account approval' });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token', message: error.message });
  }
}
