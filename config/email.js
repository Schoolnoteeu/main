// config/email.js - E-Mail-Konfiguration
const nodemailer = require('nodemailer');

// E-Mail-Transporter erstellen
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true für 465, false für andere
  auth: {
    user: process.env.SMTP_USER || 'benutzer@example.com',
    pass: process.env.SMTP_PASS || 'passwort'
  }
});

// Absender-E-Mail-Adresse
const sender = process.env.EMAIL_FROM || 'SchoolNote <noreply@schoolnote.de>';

// Basis-URL für Links in E-Mails
const baseUrl = `https://${process.env.APP_HOST}`;

module.exports = {
  transporter,
  sender,
  baseUrl
};