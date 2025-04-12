const User = require('../models/User');

// Zugriffsbeschränkung auf bestimmte Rolle
const requireRole = (role) => {
  return async (req, res, next) => {
    if (!req.session.userId) return res.redirect('/');

    try {
      const user = await User.findById(req.session.userId);
      if (!user) return res.redirect('/');
      if (user.role !== role) return res.status(403).send('Keine Berechtigung');

      next();
    } catch (err) {
      console.error('Fehler bei der Rollenüberprüfung:', err);
      return res.status(500).send('Fehler bei der Anfrage');
    }
  };
};

// Rolle immer ins Template einfügen
const injectUserRole = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.locals.user = user; // <-- Jetzt überall in den Views verfügbar
        res.locals.role = user.role; // Optional direkt als Kurzform
      }
    } catch (error) {
      console.error('Fehler beim Setzen der Benutzerrolle:', error);
    }
  }
  next();
};

module.exports = { requireRole, injectUserRole };
