// server.js - Haupteinstiegspunkt der Anwendung
require('dotenv').config(); // Lade Umgebungsvariablen aus .env Datei

const express = require('express');
const path = require('path');
const { configureServer } = require('./config/server');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { setupDatabase } = require('./config/database');
const { injectUserRole } = require('./middlewares/role'); // Rolle und Benutzerrollen-Middleware

// Express App initialisieren
const app = express();

setupDatabase();


// Server-Konfiguration (Middleware, Session, etc.)
configureServer(app);

// EJS als Template-Engine festlegen
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// Routen einbinden
app.use('/', authRoutes);
app.use(injectUserRole);
app.use('/', userRoutes);
app.use('/', adminRoutes);

// 404 - Nicht gefunden
app.use((req, res) => {
  res.status(404).render('404', { returnUrl: '/' });
});

// 500 - Serverfehler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { returnUrl: '/' });
});

// Server starten
const PORT = process.env.PORT || 25566;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});