// utils/tokenUtils.js - Token-Generierung und -Validierung
const crypto = require('crypto');

// Generiert ein einmaliges Token für die Passwortrücksetzung
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generiert einen sicheren CSRF-Token
function generateCSRFToken() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  generateToken,
  generateCSRFToken
};