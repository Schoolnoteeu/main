// models/School.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
});

// Schule erstellen
schoolSchema.statics.createSchool = async function(data) {
  return await this.create(data);
};

// Schule bearbeiten
schoolSchema.statics.updateSchool = async function(schoolId, updateData) {
  return await this.findByIdAndUpdate(schoolId, updateData, { new: true });
};

// Schule löschen
schoolSchema.statics.deleteSchool = async function(schoolId) {
  return await this.findByIdAndDelete(schoolId);
};

// Alle Schulen abrufen
schoolSchema.statics.getAllSchools = async function() {
  return await this.find({});
};

const School = mongoose.model('School', schoolSchema);
module.exports = School;