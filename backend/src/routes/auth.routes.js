const express = require('express');
const { authRequired } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/auth/login', authController.login);
router.get('/auth/me', authRequired, authController.me);

module.exports = router;
