const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get the auth header value: "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // JWT_SECRET should be set in your .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should have .id
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
