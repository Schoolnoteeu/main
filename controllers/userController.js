// controllers/userController.js - Benutzer- und Dashboard-Logik
const authService = require('../services/authService'); // Authentifizierungsdienst für Passwortüberprüfung und -änderung
const emailService = require('../services/emailService'); // E-Mail-Service für Benachrichtigungen

const userController = {
  // Dashboard anzeigen
  showDashboard: async (req, res) => {
    try {
      const user = await authService.findUserById(req.session.userId); // Benutzer anhand der Session-ID finden
      
      if (!user) {
        // Benutzer existiert nicht mehr oder ist nicht aktiv
        req.session.destroy();
        return res.redirect('/');
      }
      
      const title = 'Dashboard'; // Titel für das Dashboard
      const activePage = 'dashboard'; // Aktive Seite für die Navigation
      
      res.render('dashboard', { 
        email: user.email, // E-Mail des Benutzers anzeigen
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Erste Anmeldung', // Zeigt das letzte Login-Datum an
        title, // Übergibt den Titel an die View
        activePage // Übergibt die aktive Seite an die View
      });
    } catch (error) {
      console.error('Fehler beim Anzeigen des Dashboards:', error);
      res.status(500).render('500', { returnUrl: '/' }); // Fehlerseite anzeigen
    }
  },
    
  // Stundenplan anzeigen
  showTimetable: async (req, res) => {
    try {
      const user = await authService.findUserById(req.session.userId); // Benutzer anhand der Session-ID finden
      
      if (!user) {
        // Benutzer existiert nicht mehr oder ist nicht aktiv
        req.session.destroy();
        return res.redirect('/');
      }
      
      const title = 'Stundenplan'; // Titel für den Stundenplan
      const activePage = 'timetable'; // Aktive Seite für die Navigation
      
      res.render('timetable', { 
        email: user.email, // E-Mail des Benutzers im Stundenplan anzeigen
        title, // Übergibt den Titel an die View
        activePage // Übergibt die aktive Seite an die View
      });
    } catch (error) {
      console.error('Fehler beim Anzeigen des Dashboards:', error);
      res.status(500).render('500', { returnUrl: '/' }); // Fehlerseite anzeigen
    }
  },
  
  // Profilseite anzeigen
  showProfile: async (req, res) => {
    try {
      const user = await authService.findUserById(req.session.userId); // Benutzer anhand der Session-ID finden
      
      if (!user) {
        req.session.destroy(); // Wenn der Benutzer nicht existiert, Session löschen
        return res.redirect('/');
      }
      
      const title = 'Dein Profil'; // Titel für das Profil
      const activePage = 'profile'; // Aktive Seite für die Navigation
      
      res.render('profile', { 
        user, // Benutzerdaten im Profil anzeigen
        title, // Übergibt den Titel an die View
        activePage, // Übergibt die aktive Seite an die View
        message: req.query.message || null, // Erfolgsnachricht falls vorhanden
        error: null // Fehlernachricht falls vorhanden
      });
    } catch (error) {
      console.error('Fehler beim Anzeigen des Profils:', error);
      res.status(500).render('500', { returnUrl: '/dashboard' }); // Fehlerseite anzeigen
    }
  },
  
  // Passwort ändern
  changePassword: async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body; // Die neuen und alten Passwörter aus dem Request

    // Validierung der Passwörter
    if (!currentPassword || !newPassword || !confirmPassword) {
      const title = 'Dein Profil';
      const activePage = 'profile';
      return res.render('profile', { 
        user: req.session.user,
        title,
        activePage,
        message: null,
        error: 'Bitte fülle alle Felder aus.'
      });
    }
    
    if (newPassword !== confirmPassword) {
      const title = 'Dein Profil';
      const activePage = 'profile';
      return res.render('profile', { 
        user: req.session.user,
        title,
        activePage,
        message: null,
        error: 'Die neuen Passwörter stimmen nicht überein.'
      });
    }
    
    if (newPassword.length < 8) {
      const title = 'Dein Profil';
      const activePage = 'profile';
      return res.render('profile', { 
        user: req.session.user,
        title,
        activePage,
        message: null,
        error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.'
      });
    }
    
    try {
      const user = await authService.findUserById(req.session.userId); // Benutzer anhand der Session-ID finden
      
      if (!user) {
        req.session.destroy(); // Benutzer existiert nicht mehr
        return res.redirect('/');
      }
      
      // Aktuelles Passwort überprüfen
      const passwordMatch = await authService.comparePassword(currentPassword, user.password);
      
      if (!passwordMatch) {
        const title = 'Dein Profil';
        const activePage = 'profile';
        return res.render('profile', { 
          user: req.session.user,
          title,
          activePage,
          message: null,
          error: 'Das aktuelle Passwort ist nicht korrekt.'
        });
      }
      
      // Passwort ändern
      await authService.changePassword(user.id, newPassword);
      
      // Benachrichtigung senden
      try {
        await emailService.sendPasswordChangedEmail(user.email);
      } catch (error) {
        console.error('Fehler beim Senden der Passwortänderungs-E-Mail:', error);
        // Fortfahren, auch wenn die E-Mail nicht gesendet werden konnte
      }
      
      // Nachricht anzeigen
      res.redirect('/profile?message=Dein Passwort wurde erfolgreich geändert.');
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      const title = 'Dein Profil';
      const activePage = 'profile';
      res.render('profile', { 
        user: req.session.user,
        title,
        activePage,
        message: null,
        error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
      });
    }
  }
};

module.exports = userController;
