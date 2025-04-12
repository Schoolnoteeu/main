const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Admin-Controller importieren
const { requireAuth } = require('../middlewares/auth'); // Authentifizierungs-Middleware
const { requireRole, injectUserRole } = require('../middlewares/role'); // Rolle und Benutzerrollen-Middleware



// Admin-Dashboard anzeigen
router.get('/admin', requireAuth, requireRole('admin'), adminController.showDashboard); // Admin-Dashboard anzeigen

// Benutzerübersicht anzeigen
router.get('/admin/users', requireAuth, requireRole('admin'), adminController.showUsers); // Alle Benutzer anzeigen

// Fehlerseite für den Admin-Bereich anzeigen (optional)
router.get('/admin/error', requireAuth, requireRole('admin'), adminController.showError); // Fehlerseite

module.exports = router;
