/**
 * This route will handle actions related to blockchain system.
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/blockchain.controller.js');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport.config.js');

router.get('/', passportConfig.isAuthenticated, controller.show_blockchain_api);
router.get('/create_new_asset', passportConfig.isAuthenticated, controller.show_create_new_asset);
router.post('/create_new_asset', passportConfig.isAuthenticated, controller.create_new_asset);
router.post('/transfer_asset', passportConfig.isAuthenticated, controller.transfer_asset);
router.post('/transaction_check', passportConfig.isAuthenticated, controller.transaction_check);

module.exports = router;

