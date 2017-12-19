const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const user_model = require('../models/users.model.js');

/**
 * JWT Strategy Configuration.
 */
const jwt_options = {};
jwt_options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwt_options.secretOrKey = process.env.JWT_SECRET;
const configured_JwtStrategy = new JwtStrategy(jwt_options, (jwt_payload, done) =>{
    user_model.user_model_passport_jwt_strategy(jwt_payload, done);
});

/**
 * Implement JWT Strategy with passport.
 */
passport.use(configured_JwtStrategy);

/**
 * Authentication middleware.
 */
exports.isAuthenticated = passport.authenticate('jwt', { session: false });
