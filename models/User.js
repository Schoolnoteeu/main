// models/User.js
const mongoose = require('mongoose');

// Rollenumfang
const roles = ['admin', 'teacher', 'student', 'principal'];

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  active: { type: Boolean, default: true },
  role: { 
    type: String, 
    enum: roles, 
    default: 'student', // Standardrolle
  },
  // Eine Person kann mehreren Klassen zugeordnet sein, z. B. bei Kursen
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

// Funktion zum Abrufen der Gesamtzahl der Benutzer
userSchema.statics.getUserCount = async function() {
  try {
    const count = await this.countDocuments(); // Zählt alle Dokumente in der User-Kollektion
    return count;
  } catch (err) {
    console.error('Fehler beim Abrufen der Benutzeranzahl:', err);
    throw err;
  }
};

// Funktion: Klasse hinzufügen
userSchema.statics.addClassToUser = async function(userId, classId) {
  try {
    const user = await this.findById(userId);
    if (!user) throw new Error('Benutzer nicht gefunden.');

    // Klasse nur hinzufügen, wenn sie noch nicht enthalten ist
    if (!user.classes.includes(classId)) {
      user.classes.push(classId);
      await user.save();
    }

    return user;
  } catch (err) {
    console.error('Fehler beim Hinzufügen der Klasse:', err);
    throw err;
  }
};

// Funktion: Klasse entfernen
userSchema.statics.removeClassFromUser = async function(userId, classId) {
  try {
    const user = await this.findById(userId);
    if (!user) throw new Error('Benutzer nicht gefunden.');

    // Klasse entfernen, falls vorhanden
    user.classes = user.classes.filter(c => c.toString() !== classId.toString());
    await user.save();

    return user;
  } catch (err) {
    console.error('Fehler beim Entfernen der Klasse:', err);
    throw err;
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
