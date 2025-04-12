// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String },
  year: { type: Number },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  created_at: { type: Date, default: Date.now },
});

// Klasse erstellen
classSchema.statics.createClass = async function(data) {
  return await this.create(data);
};

// Klasse bearbeiten
classSchema.statics.updateClass = async function(classId, updateData) {
  return await this.findByIdAndUpdate(classId, updateData, { new: true });
};

// Klasse löschen
classSchema.statics.deleteClass = async function(classId) {
  return await this.findByIdAndDelete(classId);
};

// Alle Klassen abrufen
classSchema.statics.getAllClasses = async function() {
  return await this.find({}).populate('school');
};

// Alle Klassen einer bestimmten Schule abrufen
classSchema.statics.getClassesBySchool = async function(schoolId) {
  return await this.find({ school: schoolId }).populate('school');
};


const Class = mongoose.model('Class', classSchema);
module.exports = Class;
