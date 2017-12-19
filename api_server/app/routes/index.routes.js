const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller.js');

router.get('/', controller.show_homepage);

module.exports = router;

