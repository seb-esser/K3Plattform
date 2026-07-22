require('dotenv').config();
const db = require('./db');
const { hashPassword } = require('../utils/password');

const SEED_EMAIL = 'editor@k3plattform.local';
const SEED_PASSWORD = 'editor123!';
const SEED_NAME = 'Beispiel Redakteur:in';

function seedEditor() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(SEED_EMAIL);
  if (existing) {
    console.log(`Editor account already exists: ${SEED_EMAIL}`);
    return;
  }
  db.prepare(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
  ).run(SEED_EMAIL, hashPassword(SEED_PASSWORD), SEED_NAME, 'editor');

  console.log('--- LOCAL DEV ONLY: seeded editor account ---');
  console.log(`  email:    ${SEED_EMAIL}`);
  console.log(`  password: ${SEED_PASSWORD}`);
  console.log('Change or remove this before any non-local deployment.');
}

function seedSampleEvent() {
  const existing = db.prepare("SELECT id FROM events WHERE organizer = ? AND status = 'published'").get('KJR Weilheim Schongau');
  if (existing) {
    console.log('Sample published event already exists.');
    return;
  }
  const editor = db.prepare('SELECT id FROM users WHERE email = ?').get(SEED_EMAIL);
  db.prepare(
    `INSERT INTO events (
      organizer, start_date, start_time, end_date, end_time, publish_date,
      lat, lng, status, newsletter_title, newsletter_description,
      reviewed_by_user_id, reviewed_at
    ) VALUES (?, date('now'), '10:00', date('now'), '18:00', date('now'), ?, ?, 'published', ?, ?, ?, datetime('now'))`
  ).run(
    'KJR Weilheim Schongau',
    47.83970,
    11.14411,
    'KJR Weilheim Schongau',
    'KJRWMSOG',
    editor ? editor.id : null
  );
  console.log('Seeded sample published event (KJR Weilheim Schongau marker).');
}

seedEditor();
seedSampleEvent();
