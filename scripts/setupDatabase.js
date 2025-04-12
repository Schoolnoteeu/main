// scripts/setupDatabase.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function setupDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/schoolnote', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const testEmail = 'admin@schule.de';
    const testPassword = 'password123';

    const existing = await User.findOne({ email: testEmail });

    if (!existing) {
      const hashed = await bcrypt.hash(testPassword, 10);
      await User.create({
        email: testEmail,
        password: hashed,
        roles: ['admin']
      });
      console.log(`✅ Admin-Testnutzer erstellt: ${testEmail} / ${testPassword}`);
    } else {
      console.log('ℹ️ Testnutzer existiert bereits');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Fehler beim Setup:', err);
    process.exit(1);
  }
}

setupDatabase();
