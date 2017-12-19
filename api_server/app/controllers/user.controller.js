/**
 * This controller will realize functions related to users' accounts.
 */
const user_model = require('../models/users.model.js');

/**
 * GET /
 * Show user profile.
 */
exports.show_user_profile = (req, res) => {
    res.json({
        msg:'user has logged in',
        user_profile:req.user
    });
};

/**
 * POST /login
 * Log in using email and password.
 */
exports.post_login = (req, res) => {
    user_model.user_model_login_check(req,res);
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.post_signup = (req, res, next) => {
    user_model.user_model_signup(req, res, next, req.body.email, req.body.password);
};

/**
 * POST /authorize_producer
 * Authorize a new producer.
 */
exports.authorize_producer = (req, res) => {
    user_model.authorize_producer(req, res);
};
