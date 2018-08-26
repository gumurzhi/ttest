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


SL.initialize()
    .then(data => {
        const SequelizeStore = require('koa-generic-session-sequelize');

        app.use(session({
            store: new SequelizeStore(
                 SL.dbInstanse,            // pass your sequelize object as the first arg
                {}                    // pass any config options for sequelizeStore as the second arg (see below)
            )
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
