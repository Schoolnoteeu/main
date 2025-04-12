// services/emailService.js - Dienste für E-Mail-Versand
const { transporter, sender, baseUrl } = require('../config/email');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const emailService = {
  // Lade und kompiliere eine E-Mail-Vorlage
  async loadTemplate(templateName) {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return handlebars.compile(templateContent);
  },

  // Lade und kompiliere eine Text-Vorlage
  async loadTextTemplate(templateName) {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.txt`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return handlebars.compile(templateContent);
  },

  // Sendet eine E-Mail mit Vorlagen
  async sendTemplatedEmail(to, subject, templateName, data) {
    try {
      const htmlTemplate = await this.loadTemplate(templateName);
      const textTemplate = await this.loadTextTemplate(templateName);
      
      const mailOptions = {
        from: sender,
        to: to,
        subject: subject,
        text: textTemplate(data),
        html: htmlTemplate(data)
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`E-Mail mit Vorlage '${templateName}' wurde an ${to} gesendet`);
      return true;
    } catch (error) {
      console.error(`Fehler beim Senden der E-Mail mit Vorlage '${templateName}':`, error);
      throw error;
    }
  },

  // Sendet eine Passwortrücksetzungs-E-Mail
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    
    return this.sendTemplatedEmail(
      email,
      'Passwort zurücksetzen - SchoolNote',
      'password-reset',
      { resetUrl }
    );
  },

  // Sendet eine Willkommens-E-Mail nach der Registrierung
  async sendWelcomeEmail(email) {
    const loginUrl = `${baseUrl}/`;
    
    return this.sendTemplatedEmail(
      email,
      'Willkommen bei SchoolNote!',
      'welcome',
      { loginUrl }
    );
  },
  
  // Sendet eine Benachrichtigung bei Passwortänderung
  async sendPasswordChangedEmail(email) {
    return this.sendTemplatedEmail(
      email,
      'Dein Passwort wurde geändert - SchoolNote',
      'password-changed',
      {}
    );
  }
};

module.exports = emailService;