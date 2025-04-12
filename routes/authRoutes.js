// routes/authRoutes.js - Authentifizierungsrouten
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middlewares/auth');
const { rateLimiter, passwordResetLimiter, registerLimiter } = require('../middlewares/rateLimiter');


// Login-Seite anzeigen
router.get('/', redirectIfAuthenticated, authController.showLogin);

// Login-Formular verarbeiten
router.post('/login', rateLimiter, authController.login);

// Abmelden
router.get('/logout', authController.logout);

// Passwort vergessen Seite
router.get('/forgot-password', redirectIfAuthenticated, authController.showForgotPassword);

// Passwort vergessen - E-Mail senden
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

// Passwort zurücksetzen Seite anzeigen
router.get('/reset-password/:token', redirectIfAuthenticated, authController.showResetPassword);

// Passwort zurücksetzen verarbeiten
router.post('/reset-password/:token', authController.resetPassword);

// Registrierungsseite
router.get('/register', redirectIfAuthenticated, authController.showRegister);

// Registrierungsformular verarbeiten
router.post('/register', registerLimiter, authController.register);

module.exports = router;