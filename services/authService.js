const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

const authService = {
  // Passwort überprüfen
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  // Passwort hashen
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  // Einen neuen Benutzer erstellen mit einer Rolle
  async createUser(email, password, role = 'student') {
    const hashedPassword = await this.hashPassword(password);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    return user;
  },

  // Benutzer anhand der E-Mail finden
  async findUserByEmail(email) {
    return User.findOne({ email, active: true });
  },
  async findUserById(userId) {
    return User.findById(userId);
  },


  // Passwort zurücksetzen und Token speichern
  async saveResetToken(userId) {
    const token = generateToken();
    return token;
  },

  // Benutzerpasswort ändern
  async changePassword(userId, newPassword) {
    const hashedPassword = await this.hashPassword(newPassword);
    return User.findByIdAndUpdate(userId, { password: hashedPassword });
  },
};

module.exports = authService;
