'use strict';

const passport = require('koa-passport')
    , SL = require('../../app/lib/serviceLocator')
    , models = SL.models
    , logger = SL.getLogger(module)
    ,LocalStrategy = require('passport-local').Strategy
    ,BasicStrategy = require('passport-http').BasicStrategy
;

function login(username, password, req, done) {
    models.userModel.find({
        where:   {username: username.toLowerCase(), active: true}
    }).then(function (user) {
        if (!user) {
            logger.error(`User with username: ${username} was not found.`);
            return done(null, false, { message: 'User not found' });
        }
        user.comparePassword(password)
        .then(function (isSame) {
            if (isSame) {
                done(null, user);
            } else {
                logger.error(`User with id: ${user.id}, failed to login.`);
                done(null, false, { message: 'Incorrect password' });
            }
        }).catch(done);
    }).catch(done);
}

module.exports = function passportStrategiesInit() {
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        logger.debug('Passport local strategy with: "%s / %s"', username, password);
        login(username, password, req, done);
    }
));

    passport.use('basic', new BasicStrategy({passReqToCallback: true}, function (req, username, password, done) {
        logger.debug('Passport Basic strategy with: "%s / %s"', username, password);
        login(username, password, req, done);
    }));
};
