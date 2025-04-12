// config/database.js - Datenbankinitialisierung und -konfiguration
const mongoose = require('mongoose');

// MONGO_URI aus Umgebungsvariablen holen
const mongoURI = process.env.MONGO_URI; // Ersetze mit deiner URI

// Verbindung zu MongoDB herstellen
async function setupDatabase() {
  try {
    await mongoose.connect(mongoURI, {});
    console.log('MongoDB verbunden');
  } catch (err) {
    console.error('Fehler bei der Verbindung zu MongoDB:', err);
    process.exit(1); // Falls die Verbindung fehlschlägt, das Programm beenden
  }
}

// Exportiere setupDatabase
module.exports = { setupDatabase };
