const passport = require('../config/passport');

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        error: 'Authentication error',
        details: 'An error occurred during authentication'
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required',
        details: 'Please log in to access this resource'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Middleware for optional authentication (guest-friendly)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue as guest
    req.user = null;
    return next();
  }

  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        error: 'Authentication error',
        details: 'An error occurred during authentication'
      });
    }

    // Set user if valid token, otherwise continue as guest
    req.user = user || null;
    next();
  })(req, res, next);
};

module.exports = {
  requireAuth,
  optionalAuth
};