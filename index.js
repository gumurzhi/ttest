"use strict";
//r
const SL = require('./app/lib/serviceLocator')
    , logger = SL.getLogger(module)
    , Koa = require('koa')
    , app = new Koa()
    , bodyParser = require('koa-bodyparser')
    , config = require('./config/appConfig')
    , session = require('koa-generic-session')
;

SL.initialize(app)
    .then(() => {
        const SequelizeStore = require('koa-generic-session-sequelize');

        app.use(bodyParser());

        SL.loadRoutes(app, false);

        app
            .use(SL.publicRouterInstance.routes())
            .use(SL.publicRouterInstance.allowedMethods());

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


        app.keys = ['very', 'secret', 'key'];


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
        app
            .use(SL.privateRouterInstance.routes())
            .use(SL.privateRouterInstance.allowedMethods());
// x-response-time

        app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });

        const port = config.serverPort || 3000;
        app.listen(port);
        logger.info(`started on port: ${port}`);
    })
    .catch(err => {
        logger.error('ERROR:', err);
    });
