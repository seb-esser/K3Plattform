const db = require('../db/db');
const { verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

function serializeUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken(user);
  res.json({ token, user: serializeUser(user) });
}

function me(req, res) {
  res.json(serializeUser(req.user));
}

module.exports = { login, me };
