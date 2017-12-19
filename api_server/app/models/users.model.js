const mongoose = require('./database.js');
const jwt = require('jsonwebtoken');

const blockchain_adapter = require('../adapter/bigchaindb.adapter.js');

const user_schema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    private_key: String,
    public_key: String,
    producer: String
}, { timestamps: true });

/**
 * Helper method for validating user's password.
 */
user_schema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
    callback(candidatePassword===this.password);
};

const user_model = mongoose.model('User', user_schema);

const user_model_login_check = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    user_model.findOne({email: email.toLowerCase()}, function(err, user) {
        if (err) { res.json(err); }
        if (!user) {
            res.status(401).json({msg:"authentication fail, no such user found"});
        }else{
            user.comparePassword(password, (isMatch) => {
                if (isMatch) {
                    const payload = {email: user.email};
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                    res.json({msg: "Success! You are logged in.", token: token});
                }else{
                    res.status(401).json({msg:"passwords did not match"});
                }
            });
        }
    });
};

const user_model_passport_jwt_strategy = (jwt_payload, done) => {
    user_model.findOne({email: jwt_payload.email.toLowerCase()}, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
};

const user_model_signup = (req, res, next, email, password) => {
    const key_pair = blockchain_adapter.get_key_pair();
    const user = new user_model({
        email: email,
        password: password,
        private_key: key_pair.privateKey,
        public_key: key_pair.publicKey,
        producer: 'no'
    });
    user_model.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            console.log("existingUser in post signup.");
            return res.json({msg: 'existing user'});
        }
        user.save((err) => {
            if (err) { return next(err); }
            res.json({msg: 'signup success'});
        });
    });
};

const authorize_producer = (req, res) => {
    const user_email = req.user.email;
    const email = req.body.email;
    if(user_email==='admin'){
        user_model.findOneAndUpdate({email:email}, {producer:'yes'},() => {
            res.json({msg:'Authorization success.'})
        });
    }else{
        res.json({msg:'You are not allowed to authorize producer.'})
    }
};

module.exports = {
    user_model,
    user_model_passport_jwt_strategy,
    user_model_login_check,
    user_model_signup,
    authorize_producer
};