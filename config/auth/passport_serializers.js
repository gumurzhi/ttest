'use strict';

const passport = require('koa-passport')
    , SL = require('../../app/lib/serviceLocator')
    , models = SL.models
    , logger = SL.getLogger(module)
;

module.exports = function passportSerializersInit() {
    passport.serializeUser(function serializeUser(user, done) {
        if (!user) {
            return done(new Error('User undefined for serialize'));
        }
        logger.debug('Serialize user with id %s', user.id);
        let id = user.id;
        if (user.impersonated) {
            id = { 'id': user.id, 'impersonated': user.impersonated };
        }
        done(null, id);
    });

    passport.deserializeUser(function deserializeUser(id, done) {
        logger.debug('Deserialize user with id %j', id);
        models.userModel.find({
            where: {id}
        }).then(function (user) {
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        }).catch(function (err) {
            done(err);
        });
    });
};
