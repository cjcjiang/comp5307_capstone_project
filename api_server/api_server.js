/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');

/**
 * Load environment variables from .env file.
 */
// dotenv.config();
dotenv.load({ path: './app/config/.env' });

/**
 * Route handlers.
 */
const homepage = require('./app/routes/index.routes.js');
const user_routes = require('./app/routes/user.routes.js');
const blockchain_routes = require('./app/routes/blockchain.routes.js');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname,'app','views'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

/**
 * Set app routes.
 */
app.use('/', homepage);
app.use('/user', user_routes);
app.use('/blockchain', blockchain_routes);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('Press CTRL-C to stop\n');
});

module.exports = app;