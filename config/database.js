// config/database.js - Datenbankinitialisierung und -konfiguration
const mongoose = require('mongoose');

// MONGO_URI aus Umgebungsvariablen holen
const mongoURI = process.env.MONGO_URI || 'mongodb://schoolnote:9VxeX9mYqcyF2kwF6FMRGk5NW3ExLcPrfFWfji@2.56.244.13:25567/schoolnote'; // Ersetze mit deiner URI

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
