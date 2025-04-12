const User = require('../models/User');
const authService = require('../services/authService');
const emailService = require('../services/emailService');

const authController = {
  // Login-Seite anzeigen
  showLogin: (req, res) => {
    const message = req.query.message || null;
    res.render('login', { error: null, message });
  },

  // Login-Formular verarbeiten
  login: async (req, res) => {
    const { email, password } = req.body;

    // Einfache Validierung
    if (!email || !password) {
      return res.render('login', { error: 'Bitte gib deine E-Mail und dein Passwort ein.', message: null });
    }

    try {
      // Benutzer in der Datenbank suchen
      const user = await User.findOne({ email });

      if (!user) {
        return res.render('login', { error: 'E-Mail oder Passwort ist ungültig.', message: null });
      }

      // Passwort überprüfen
      const passwordMatch = await authService.comparePassword(password, user.password);

      if (!passwordMatch) {
        return res.render('login', { error: 'E-Mail oder Passwort ist ungültig.', message: null });
      }

      // Session erstellen
      req.session.userId = user._id;
      req.session.email = user.email;
      req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role, // Speichern der Benutzerrolle
      };

      // Cookie-Lebensdauer anpassen, wenn "Angemeldet bleiben" aktiv ist
      req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 Tage

      // Weiterleitung je nach Rolle
      return res.redirect('/dashboard');
    } catch (error) {
      console.error('Login-Fehler:', error);
      res.render('login', { error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.', message: null });
    }
  },

  // Abmelden
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Fehler beim Abmelden:', err);
      }
      res.redirect('/');
    });
  },

  // Passwort vergessen Seite anzeigen
  showForgotPassword: (req, res) => {
    res.render('forgot-password', { message: null });
  },

  // Passwort vergessen - E-Mail senden
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      // Prüfen, ob die E-Mail existiert
      const user = await User.findOne({ email });

      // Aus Sicherheitsgründen immer die gleiche Meldung anzeigen
      const message = 'Wenn deine E-Mail-Adresse in unserem System gefunden wird, erhältst du einen Link zum Zurücksetzen deines Passworts.';

      if (!user) {
        return res.render('forgot-password', { message });
      }

      // Token generieren und in der Datenbank speichern
      const resetToken = await authService.saveResetToken(user._id);

      // E-Mail senden
      await emailService.sendPasswordResetEmail(email, resetToken);

      res.render('forgot-password', { message });
    } catch (error) {
      console.error('Fehler bei der Passwortrücksetzung:', error);
      res.render('forgot-password', {
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      });
    }
  },

  // Passwort zurücksetzen Seite anzeigen
  showResetPassword: async (req, res) => {
    const { token } = req.params;

    try {
      // Token validieren
      const tokenData = await authService.validateResetToken(token);

      if (!tokenData) {
        return res.render('reset-password', {
          token: null,
          error: 'Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.',
        });
      }

      res.render('reset-password', { token, error: null });
    } catch (error) {
      console.error('Fehler beim Überprüfen des Tokens:', error);
      res.render('reset-password', {
        token: null,
        error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      });
    }
  },

  // Passwort zurücksetzen verarbeiten
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validierung
    if (!password || !confirmPassword) {
      return res.render('reset-password', {
        token,
        error: 'Bitte fülle alle Felder aus.',
      });
    }

    if (password !== confirmPassword) {
      return res.render('reset-password', {
        token,
        error: 'Die Passwörter stimmen nicht überein.',
      });
    }

    if (password.length < 8) {
      return res.render('reset-password', {
        token,
        error: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
      });
    }

    try {
      // Token validieren
      const tokenData = await authService.validateResetToken(token);

      if (!tokenData) {
        return res.render('reset-password', {
          token: null,
          error: 'Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.',
        });
      }

      // Passwort ändern
      await authService.changePassword(tokenData.userId, password);

      // Token als verwendet markieren
      await authService.markTokenAsUsed(tokenData._id);

      // Zum Login weiterleiten
      res.redirect('/?message=Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.');
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      res.render('reset-password', {
        token,
        error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      });
    }
  },

  // Registrierungsseite anzeigen
  showRegister: (req, res) => {
    res.render('register', { error: null });
  },

  // Registrierungsformular verarbeiten
  register: async (req, res) => {
    const { email, password, confirmPassword, agreeTerms } = req.body;

    // Einfache Validierung
    if (!email || !password || !confirmPassword) {
      return res.render('register', { error: 'Alle Felder müssen ausgefüllt werden.' });
    }

    if (password !== confirmPassword) {
      return res.render('register', { error: 'Die Passwörter stimmen nicht überein.' });
    }

    if (!agreeTerms) {
      return res.render('register', { error: 'Du musst den Nutzungsbedingungen zustimmen.' });
    }

    // Passwort-Stärke prüfen
    if (password.length < 8) {
      return res.render('register', { error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' });
    }

    try {
      // Prüfen, ob die E-Mail bereits existiert
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.render('register', { error: 'Diese E-Mail-Adresse wird bereits verwendet.' });
      }

      // Benutzer erstellen
      const user = await authService.createUser(email, password);

      // Willkommens-E-Mail senden
      try {
        await emailService.sendWelcomeEmail(email);
      } catch (error) {
        console.error('Fehler beim Senden der Willkommens-E-Mail:', error);
        // Fortfahren, auch wenn die E-Mail nicht gesendet werden konnte
      }

      // Automatisch einloggen
      req.session.userId = user._id;
      req.session.email = user.email;
      req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role, // Speichern der Benutzerrolle
      };

      // Weiterleitung je nach Rolle
      if (user.role === 'admin') {
        return res.redirect('/admin-dashboard');
      } else {
        return res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      res.render('register', { error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.' });
    }
  },

  // Middleware für Rollen-Überprüfung
  checkRole: (role) => {
    return (req, res, next) => {
      if (req.session.user && req.session.user.role === role) {
        return next();
      }
      return res.redirect('/unauthorized'); // Weiterleitung, wenn der Benutzer keine Berechtigung hat
    };
  },
};

module.exports = authController;
