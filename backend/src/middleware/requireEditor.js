function requireEditor(req, res, next) {
  if (!req.user || !['editor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Editor role required' });
  }
  next();
}

module.exports = requireEditor;
