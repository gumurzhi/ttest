"use strict";

const SL = require('./app/lib/serviceLocator')
    , logger = SL.getLogger(module)
    , Koa = require('koa')
    , app = new Koa()
    , bodyParser = require('koa-bodyparser')
    //   , session = require('koa-session')\


    , session = require('koa-generic-session')
    , passport = require('koa-passport')
;


SL.initialize(app)
    .then(() => {
        const SequelizeStore = require('koa-generic-session-sequelize');

        app.use(bodyParser());

        app.use(session({
            store: new SequelizeStore(
                SL.dbInstanse,            // pass your sequelize object as the first arg
                {}                    // pass any config options for sequelizeStore as the second arg (see below)
            )
        }));

        const passport = require('koa-passport');
        require('./config/auth');

        app.use(passport.initialize());
        app.use(passport.session());

        const route = require('koa-route');
        app.keys = ['very', 'secret', 'key'];


        SL.loadRoutes(app, false);
        app.use(async function passportBasicAuthCheck(ctx, next) {
            if (ctx.isAuthenticated()) {
                logger.debug('Found user\'s session. Basic Auth not used');
                return  next();
            }

            logger.debug('User\'s session not found, try authenticate');

            await passport.authenticate('basic', async function (err, user, options) {
                if (err) {
                    logger.error('Auth error: %s', JSON.stringify(err));
                    return ctx.status = 500;
                }

                try {
                    if (user) {
                        logger.debug('Basic Auth ok for user with id %s', user.id);
                        await ctx.login(user);
                    } else {
                       return ctx.status = 401;
                    }
                } catch (e) {
                    logger.error('Passport basic auth middleware login error: %s', e.toString());
                    console.log('Passport basic auth middleware login error:', e.toString(), e.stack);
                    ctx.status = 500;
                }

                logger.debug('Call next middleware');
                 await next();

            })(ctx);
        });

        SL.loadRoutes(app, true);

// x-response-time

        app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });

        app.listen(3000);
        logger.info(`started on port: ${3000}`);
    })
    .catch(err => {
        logger.error('ERROR:', err);
    });
