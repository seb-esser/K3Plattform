const express = require('express');
const { authRequired, authOptional } = require('../middleware/auth');
const requireEditor = require('../middleware/requireEditor');
const { uploadSubmissionFiles, uploadAttachmentFiles } = require('../middleware/upload');
const eventsController = require('../controllers/events.controller');

const router = express.Router();

router.get('/events', eventsController.listPublished);
router.get('/events/pending', authRequired, requireEditor, eventsController.listPending);
router.get('/events/:id', authOptional, eventsController.getById);
router.post('/events', uploadSubmissionFiles, eventsController.create);
router.patch('/events/:id', authRequired, requireEditor, eventsController.update);
router.delete('/events/:id', authRequired, requireEditor, eventsController.remove);
router.post(
  '/events/:id/attachments',
  authRequired,
  requireEditor,
  uploadAttachmentFiles,
  eventsController.addAttachments
);
router.delete('/attachments/:id', authRequired, requireEditor, eventsController.removeAttachment);

module.exports = router;
