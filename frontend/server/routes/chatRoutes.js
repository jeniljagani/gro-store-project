const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');

router.route('/').post(chatWithAI);

module.exports = router;
