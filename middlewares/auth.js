// middlewares/auth.js
const User = require('../models/User');

// Middleware zur Authentifizierung - Prüft, ob der Benutzer eingeloggt ist
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  next();
};

// Middleware, die den aktuellen Benutzer lädt
const loadUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.locals.user = user;
      } else {
        // Benutzer existiert nicht mehr oder ist nicht aktiv
        req.session.destroy();
      }
    } catch (error) {
      console.error('Fehler beim Laden des Benutzers:', error);
    }
  }
  next();
};

// Middleware zur Vermeidung erneuter Authentifizierung
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = {
  requireAuth,
  loadUser,
  redirectIfAuthenticated,
};
