const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

// Dashboard anzeigen
router.get('/dashboard', requireAuth, userController.showDashboard);

// Stundenplan anzeigen
router.get('/timetable', requireAuth, userController.showTimetable);

// Profilseite anzeigen
router.get('/profile', requireAuth, userController.showProfile);

// Passwort ändern
router.post('/change-password', requireAuth, userController.changePassword);

module.exports = router;
