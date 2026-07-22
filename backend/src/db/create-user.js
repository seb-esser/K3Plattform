require('dotenv').config();
const db = require('./db');
const { hashPassword } = require('../utils/password');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      args[key] = value;
      i += 1;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const { email, password, name } = args;
const role = args.role || 'editor';

if (!email || !password || !name) {
  console.error('Usage: node src/db/create-user.js --email you@example.com --password "..." --name "Your Name" [--role editor|admin]');
  process.exit(1);
}

if (!['editor', 'admin'].includes(role)) {
  console.error(`Invalid role "${role}". Must be "editor" or "admin".`);
  process.exit(1);
}

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing) {
  console.error(`A user with email ${email} already exists.`);
  process.exit(1);
}

db.prepare(
  'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
).run(email, hashPassword(password), name, role);

console.log(`Created ${role} account for ${email}.`);
