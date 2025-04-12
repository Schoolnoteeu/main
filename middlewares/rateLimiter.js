// middlewares/rateLimiter.js - Rate-Limiting-Middleware
const rateLimit = require('express-rate-limit');

// Rate Limiter für Login-Versuche
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // 5 Versuche
  message: 'Zu viele Login-Versuche. Bitte versuche es später erneut.',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate Limiter für Passwortrücksetzung
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 3, // 3 Versuche
  message: 'Zu viele Anfragen zur Passwortrücksetzung. Bitte versuche es später erneut.',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate Limiter für die Registrierung
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 5, // 5 Versuche
  message: 'Zu viele Registrierungsversuche. Bitte versuche es später erneut.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  rateLimiter,
  passwordResetLimiter,
  registerLimiter
};