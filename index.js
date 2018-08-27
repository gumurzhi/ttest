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
    .then(data => {
        const SequelizeStore = require('koa-generic-session-sequelize');

        app.use(bodyParser());

        app.use(session({
            store: new SequelizeStore(
                SL.dbInstanse,            // pass your sequelize object as the first arg
                {}                    // pass any config options for sequelizeStore as the second arg (see below)
            )
        }));

        const passport = require('koa-passport');
        // require('./config/auth/passport_serializers')();
        // require('./config/auth/passport_strategies')();
        require('./config/auth/auth');

        app.use(passport.initialize());
        app.use(passport.session());

        const route = require('koa-route');





        // POST /login
        // app.use(route.post('/login',
        //     passport.authenticate('basic', (err, user) => {
        //         console.log();
        //     })
        // ))
        //
//         //
//         app.use(async function (ctx, next) {
//             await new Promise((response, reject) => {
//                 passport.authenticate.call(passport, 'basic',  (err, user, info) => {
// console.log();
//                 })
//             })
//             await next();
//         })

        // app.use(async function (ctx, next) {
        // })
        // app.use(function (ctx, next) {
        //     if (ctx.isAuthenticated()) {
        //         return next()
        //     } else {
        //         ctx.status = 401
        //     }
        // })

        app.use(route.post('/login',
            passport.authenticate('basic', {
                successRedirect: '/app',
                failureRedirect: '/'
            })
        ))

        // app.use(route.get('/app', function (ctx) {
        //     passport.authenticate('basic',  (err, user, info) => {
        //         ctx.body = 'hello world'
        //     })
        // }));

//         app.use(async (ctx, next) => {
//             if (ctx.isAuthenticated()) {
//                 logger.debug('Found user\'s session. Basic Auth not used');
//                 await next();
//             }
//
//             logger.debug('User\'s session not found, try authenticate');
//          let a =  await passport.authenticate('basic',  async function (err, user, options) {
//                 if (err) {
//                     logger.error('Auth error: %s', JSON.stringify(err));
//                     if (err.name === 'TimeoutError') {
//                         let sequelize =  SL.dbInstanse;
//                         let pool = sequelize.connectionManager.pool;
//                         logger.warn(`Sequelize pool size: ${pool.size}, available: ${pool.available}, pending: ${pool.pending}`);
//                     }
//                     return ctx.status = 500;
//                 }
//
//                 try {
//                     if (user) {
//                         logger.debug('Basic Auth ok for user with id %s', user.id);
//                         return ctx.login(user);
//                     } else if (config.passport.forceBasicAuth) {
//                         logger.error('Error user auth with credentials: %s, error reason: %s', JSON.stringify(ctx.request.body), JSON.stringify(options));
//                         ctx.status = 401;
//                         ctx.set('WWW-Authenticate', 'Basic realm=":"');
//                         ctx.body = '';
//                     }
//                 } catch (e) {
//                     logger.error('Passport basic auth middleware login error: %s', e.toString());
//                     console.log('Passport basic auth middleware login error:', e.toString(), e.stack);
//                     ctx.status = 500;
//                 }
//
//                 logger.debug('Call next middleware');
//                 return next;
//
//             });
// console.log();
//         });


        app.use(async ctx => {
            ctx.isAuthenticated()
            ctx.isUnauthenticated()
            await ctx.login()
            ctx.logout()
            ctx.state.user
        })

        app.use(route.get('/app', function (ctx) {
            ctx.body = 'hello world'
        }));

        app.use(async (ctx, next) => {
            await next();
            const rt = ctx.response.get('X-Response-Time');
            console.log(`${ctx.method} ${ctx.url} - ${rt}`);
        });

// x-response-time

        app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });

// response

        app.use(async ctx => {
            ctx.body = 'Hello World';
        });

        app.listen(3000);
        logger.info(`started on port: ${3000}`);
    })
    .catch(err => {
        logger.error('ERROR:', err);
    });
