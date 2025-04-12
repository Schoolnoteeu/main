// config/server.js - Server-Konfiguration und Middleware
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const { rateLimiter } = require('../middlewares/rateLimiter');

// Server-Konfiguration und Middleware
function configureServer(app) {
  // Sicherheitsheader
  
  // Body-Parser für URL-kodierte Daten und JSON
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Session-Konfiguration mit besserer Sicherheit
  app.use(session({
    secret: process.env.SESSION_SECRET || 'schoolnote-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 3600000, // 1 Stunde
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Nur in Produktion true
      sameSite: 'strict'
    }
  }));
  
  // Middleware für aktive Benutzer-Verfolgung
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
}

module.exports = {
  configureServer
};