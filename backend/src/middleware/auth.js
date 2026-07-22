const db = require('../db/db');
const { verifyToken } = require('../utils/jwt');

function loadUserFromHeader(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return null;
  }
  const user = db.prepare('SELECT id, email, name, role, is_active FROM users WHERE id = ?').get(payload.sub);
  if (!user || !user.is_active) {
    return null;
  }
  return user;
}

function authRequired(req, res, next) {
  const user = loadUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = user;
  next();
}

function authOptional(req, res, next) {
  req.user = loadUserFromHeader(req);
  next();
}

module.exports = { authRequired, authOptional };
