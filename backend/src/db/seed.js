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

function seedPublishedEvent({ organizer, lat, lng, startTime, endTime, title, description }) {
  const existing = db.prepare("SELECT id FROM events WHERE organizer = ? AND status = 'published'").get(organizer);
  if (existing) {
    console.log(`Sample published event already exists: ${organizer}`);
    return;
  }
  const editor = db.prepare('SELECT id FROM users WHERE email = ?').get(SEED_EMAIL);
  db.prepare(
    `INSERT INTO events (
      organizer, start_date, start_time, end_date, end_time, publish_date,
      lat, lng, status, newsletter_title, newsletter_description,
      reviewed_by_user_id, reviewed_at
    ) VALUES (?, date('now'), ?, date('now'), ?, date('now'), ?, ?, 'published', ?, ?, ?, datetime('now'))`
  ).run(organizer, startTime, endTime, lat, lng, title, description, editor ? editor.id : null);
  console.log(`Seeded sample published event (${organizer} marker).`);
}

seedEditor();
seedPublishedEvent({
  organizer: 'KJR Weilheim Schongau',
  lat: 47.83970,
  lng: 11.14411,
  startTime: '10:00',
  endTime: '18:00',
  title: 'KJR Weilheim Schongau',
  description: 'KJRWMSOG',
});
seedPublishedEvent({
  organizer: 'Jugendrotkreuz Weilheim',
  lat: 47.8418761,
  lng: 11.1474433,
  startTime: '17:00',
  endTime: '19:00',
  title: 'Jugendrotkreuz (JRK) Weilheim',
  description:
    'Das Jugendrotkreuz Weilheim trifft sich regelmäßig am BRK-Kreisverband in der Johannes-Damrich-Straße 5. ' +
    'Kinder und Jugendliche lernen Erste Hilfe, Gemeinschaft und soziales Engagement spielerisch kennen. ' +
    'Ansprechpartner: Jenni Hanzlik, Michael Limbrunner. Kontakt: info@kvwm-sog.brk.de, Tel. 0881 9290-17.',
});
seedPublishedEvent({
  organizer: 'THW Jugend Weilheim',
  lat: 47.8295578,
  lng: 11.1252528,
  startTime: '18:00',
  endTime: '20:00',
  title: 'THW-Jugend Ortsverband Weilheim',
  description:
    'Die THW-Jugend am Ortsverband Weilheim (Holzhofstraße 34) trifft sich alle zwei Wochen donnerstags ' +
    '(außerhalb der Schulferien) von 18:00 bis 20:00 Uhr. Vermittelt werden technisches Wissen, Teamarbeit ' +
    'und Katastrophenschutz-Grundlagen. Ansprechpartner: Magnus Neumann, Tel. 0881 2662.',
});
