// controllers/adminController.js - Benutzer- und Dashboard-Logik
const { findUserById } = require('../services/authService'); 
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Funktion zur Abfrage der Benutzeranzahl
const getUserCount = async () => {
  try {
    const userCount = await User.getUserCount();
    return userCount;
  } catch (err) {
    console.error('Fehler:', err);
    throw err; // Fehler weitergeben
  }
};

const adminController = {
  // Benutzerliste anzeigen
  showUsers: async (req, res) => {
    try {
      const user = await findUserById(req.session.userId); // Admin-Benutzer abrufen
      const users = await User.find(); // Alle Benutzer abrufen
      res.render('admin/users', {
        user,
        email: user.email,
        users,
        activePage: 'users',  // Aktive Seite für das Menü
        title: 'Benutzerliste' // Titel der Seite
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
      res.status(500).render('500', {
        returnUrl: '/dashboard', // Rücksprunglink
        activePage: '',
        title: 'Fehler'
      });
    }
  },

  // Dashboard anzeigen
  showDashboard: async (req, res) => {
    try {
      const user = await findUserById(req.session.userId); // Admin-Benutzer abrufen
      const users = await User.find(); // Alle Benutzer abrufen
      const userCount = await getUserCount(); // Anzahl der Benutzer abrufen
      res.render('admin/dashboard', {  // Dashboard-Ansicht
        user,
        email: user.email,
        userCount, // Benutzeranzahl anzeigen
        activePage: 'dashboard', // Aktive Seite für das Menü
        title: 'Admin Dashboard' // Titel der Seite
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
      res.status(500).render('500', {
        returnUrl: '/dashboard', // Rücksprunglink
        activePage: '',
        title: 'Fehler'
      });
    }
  },

  // Fehlerseite anzeigen (für konsistente Fehlerbehandlung)
  showError: (req, res) => {
    res.status(404).render('404', {
      returnUrl: '/',
      activePage: '',
      title: 'Seite nicht gefunden'
    });
  }
};

module.exports = adminController;  // Korrektur: der Name des Controllers muss 'adminController' bleiben
