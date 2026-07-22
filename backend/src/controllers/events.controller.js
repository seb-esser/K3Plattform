const fs = require('fs');
const path = require('path');
const db = require('../db/db');
const { uploadsDir } = require('../middleware/upload');
const { ValidationError, requireFields, parseBool, parseNullableFloat } = require('../utils/validate');

const BOOLEAN_COLUMNS = new Set([
  'newsletter_distribute_private',
  'newsletter_distribute_public',
  'instagram_crosspost_facebook',
]);

const EDITABLE_COLUMNS = [
  'organizer',
  'start_date',
  'start_time',
  'end_date',
  'end_time',
  'publish_date',
  'lat',
  'lng',
  'newsletter_title',
  'newsletter_description',
  'newsletter_distribute_private',
  'newsletter_distribute_public',
  'instagram_caption',
  'instagram_crosspost_facebook',
  'whatsapp_caption',
  'editor_notes',
];

function getAttachmentsForEvents(eventIds) {
  if (eventIds.length === 0) return new Map();
  const placeholders = eventIds.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT * FROM event_attachments WHERE event_id IN (${placeholders})`)
    .all(...eventIds);
  const map = new Map();
  rows.forEach((row) => {
    const list = map.get(row.event_id) || [];
    list.push(serializeAttachment(row));
    map.set(row.event_id, list);
  });
  return map;
}

function serializeAttachment(row) {
  return {
    id: row.id,
    eventId: row.event_id,
    channel: row.channel,
    url: `/uploads/${row.filename}`,
    originalFilename: row.original_filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
  };
}

function serializeEvent(row, attachments) {
  return {
    id: row.id,
    organizer: row.organizer,
    startDate: row.start_date,
    startTime: row.start_time,
    endDate: row.end_date,
    endTime: row.end_time,
    publishDate: row.publish_date,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    newsletterTitle: row.newsletter_title,
    newsletterDescription: row.newsletter_description,
    newsletterDistributePrivate: !!row.newsletter_distribute_private,
    newsletterDistributePublic: !!row.newsletter_distribute_public,
    instagramCaption: row.instagram_caption,
    instagramCrosspostFacebook: !!row.instagram_crosspost_facebook,
    whatsappCaption: row.whatsapp_caption,
    editorNotes: row.editor_notes,
    reviewedByUserId: row.reviewed_by_user_id,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    attachments: attachments || [],
  };
}

function fetchEventWithAttachments(id) {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  if (!row) return null;
  const attachments = getAttachmentsForEvents([row.id]).get(row.id) || [];
  return serializeEvent(row, attachments);
}

function listPublished(req, res) {
  const rows = db.prepare("SELECT * FROM events WHERE status = 'published' ORDER BY start_date, start_time").all();
  const attachmentsByEvent = getAttachmentsForEvents(rows.map((r) => r.id));
  res.json(rows.map((row) => serializeEvent(row, attachmentsByEvent.get(row.id))));
}

function listPending(req, res) {
  const rows = db.prepare("SELECT * FROM events WHERE status = 'pending' ORDER BY created_at").all();
  const attachmentsByEvent = getAttachmentsForEvents(rows.map((r) => r.id));
  res.json(rows.map((row) => serializeEvent(row, attachmentsByEvent.get(row.id))));
}

function getById(req, res) {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Not found' });
  }
  const isEditor = req.user && ['editor', 'admin'].includes(req.user.role);
  if (row.status !== 'published' && !isEditor) {
    return res.status(404).json({ error: 'Not found' });
  }
  const attachments = getAttachmentsForEvents([row.id]).get(row.id) || [];
  res.json(serializeEvent(row, attachments));
}

function insertAttachmentsFromFiles(eventId, files) {
  if (!files) return;
  const insert = db.prepare(
    'INSERT INTO event_attachments (event_id, channel, filename, original_filename, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?)'
  );
  Object.entries(files).forEach(([fieldName, fileList]) => {
    const channel = fieldName.replace('_files', '');
    fileList.forEach((file) => {
      insert.run(eventId, channel, file.filename, file.originalname, file.mimetype, file.size);
    });
  });
}

function create(req, res, next) {
  try {
    requireFields(req.body, ['organizer', 'start_date', 'start_time', 'end_date', 'end_time', 'publish_date']);

    const lat = parseNullableFloat(req.body.lat);
    const lng = parseNullableFloat(req.body.lng);

    const info = db
      .prepare(
        `INSERT INTO events (
          organizer, start_date, start_time, end_date, end_time, publish_date,
          lat, lng, status,
          newsletter_title, newsletter_description, newsletter_distribute_private, newsletter_distribute_public,
          instagram_caption, instagram_crosspost_facebook,
          whatsapp_caption
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.body.organizer,
        req.body.start_date,
        req.body.start_time,
        req.body.end_date,
        req.body.end_time,
        req.body.publish_date,
        lat,
        lng,
        req.body.newsletter_title || null,
        req.body.newsletter_description || null,
        parseBool(req.body.newsletter_distribute_private) ? 1 : 0,
        parseBool(req.body.newsletter_distribute_public) ? 1 : 0,
        req.body.instagram_caption || null,
        parseBool(req.body.instagram_crosspost_facebook) ? 1 : 0,
        req.body.whatsapp_caption || null
      );

    insertAttachmentsFromFiles(info.lastInsertRowid, req.files);

    res.status(201).json(fetchEventWithAttachments(info.lastInsertRowid));
  } catch (err) {
    next(err);
  }
}

function update(req, res, next) {
  try {
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    const patch = {};
    EDITABLE_COLUMNS.forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(req.body, column)) {
        let value = req.body[column];
        if (BOOLEAN_COLUMNS.has(column)) {
          value = parseBool(value) ? 1 : 0;
        } else if (column === 'lat' || column === 'lng') {
          value = parseNullableFloat(value);
        }
        patch[column] = value;
      }
    });

    const statusChanging = Object.prototype.hasOwnProperty.call(req.body, 'status');
    let nextStatus = existing.status;
    if (statusChanging) {
      nextStatus = req.body.status;
      if (!['pending', 'published', 'rejected'].includes(nextStatus)) {
        throw new ValidationError(`Invalid status: ${nextStatus}`);
      }
      if (nextStatus === 'published') {
        const finalLat = Object.prototype.hasOwnProperty.call(patch, 'lat') ? patch.lat : existing.lat;
        const finalLng = Object.prototype.hasOwnProperty.call(patch, 'lng') ? patch.lng : existing.lng;
        if (finalLat === null || finalLat === undefined || finalLng === null || finalLng === undefined) {
          throw new ValidationError('lat/lng required to publish an event');
        }
      }
    }

    const columns = Object.keys(patch);
    const setClauses = columns.map((column) => `${column} = ?`);
    const values = columns.map((column) => patch[column]);

    setClauses.push('updated_at = datetime(\'now\')');

    if (statusChanging) {
      setClauses.push('status = ?');
      values.push(nextStatus);
      setClauses.push('reviewed_by_user_id = ?');
      values.push(req.user.id);
      setClauses.push('reviewed_at = datetime(\'now\')');
    }

    if (setClauses.length > 0) {
      db.prepare(`UPDATE events SET ${setClauses.join(', ')} WHERE id = ?`).run(...values, req.params.id);
    }

    res.json(fetchEventWithAttachments(req.params.id));
  } catch (err) {
    next(err);
  }
}

function remove(req, res) {
  const existing = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Not found' });
  }
  const attachments = db.prepare('SELECT filename FROM event_attachments WHERE event_id = ?').all(existing.id);
  attachments.forEach((attachment) => {
    const filePath = path.join(uploadsDir, attachment.filename);
    fs.rm(filePath, { force: true }, () => {});
  });
  db.prepare('DELETE FROM events WHERE id = ?').run(existing.id);
  res.status(204).send();
}

function addAttachments(req, res, next) {
  try {
    const existing = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }
    const channel = req.body.channel;
    if (!['newsletter', 'instagram', 'whatsapp'].includes(channel)) {
      throw new ValidationError('channel must be one of: newsletter, instagram, whatsapp');
    }
    const files = req.files || [];
    const insert = db.prepare(
      'INSERT INTO event_attachments (event_id, channel, filename, original_filename, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const inserted = files.map((file) => {
      const info = insert.run(existing.id, channel, file.filename, file.originalname, file.mimetype, file.size);
      return serializeAttachment({
        id: info.lastInsertRowid,
        event_id: existing.id,
        channel,
        filename: file.filename,
        original_filename: file.originalname,
        mime_type: file.mimetype,
        size_bytes: file.size,
      });
    });
    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
}

function removeAttachment(req, res) {
  const attachment = db.prepare('SELECT * FROM event_attachments WHERE id = ?').get(req.params.id);
  if (!attachment) {
    return res.status(404).json({ error: 'Not found' });
  }
  const filePath = path.join(uploadsDir, attachment.filename);
  fs.rm(filePath, { force: true }, () => {});
  db.prepare('DELETE FROM event_attachments WHERE id = ?').run(attachment.id);
  res.status(204).send();
}

module.exports = {
  listPublished,
  listPending,
  getById,
  create,
  update,
  remove,
  addAttachments,
  removeAttachment,
};
