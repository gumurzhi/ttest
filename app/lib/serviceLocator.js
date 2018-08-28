"use strict";
const fs = require('fs')
    , {promisify} = require('util')
    , asyncReadDir = promisify(fs.readdir)
    , Promise = require('bluebird')
    , loggerLib = require('./logger')
    , logger = loggerLib(module)
    , baseHelper = require('../helpers/baseHelper')
    , assertEx = baseHelper.assertEx
    , db = require('./db')
    , route = require('koa-route')
;


class ServiceLocator {
    constructor() {
        this.rootFolder = __dirname.replace('app/lib', '');
        this.models = {};
        this.controllers = {};
        this.routes = [];
        this.services = {};
    }

    get helper() {
        return baseHelper;
    }

    get projectRoot() {
        return this.rootFolder;
    }

    getComponentsList() {
        return asyncReadDir(this.rootFolder + 'app/components')
    }

    /*

            app.use(route.get('/app', function (ctx) {
                ctx.body = 'hello world'
            }));
     */

    loadRoutes(app, isAuthNeeded) {
        this.routes.filter(route => !!route.authRequired === !!isAuthNeeded)
            .forEach(rt => {
                let controllerPathParts = rt.middleware.split('.');
                assertEx(this.controllers[controllerPathParts[0]][controllerPathParts[1]], `no such controller: ${rt.middleware}`);
                app.use(route[rt.method](rt.path, async (ctx) => {
                    try {
                        ctx.body = await  this.controllers[controllerPathParts[0]][controllerPathParts[1]](ctx.state.user, ctx.request.params || {}, ctx.request.query || {}, ctx.request.body, ctx)
                    } catch (e) {
                        logger.error(e);
                        ctx.status = 500;
                    }

                }))
            })

    }

    getLogger(m) {
        return loggerLib(m)
    }

    initialize() {
        return this._loadComponents()
            .then(this._loadModels.bind(this))
            .then(() => db.connect())
            .then(() => {
                let migrations = require('../helpers/migrations');
                return migrations();
            })
            .catch(err => {
                logger.error('initialize ERROR:', err);
                throw err;
            });
    }

    async _loadComponents() {
        let components = await this.getComponentsList();
        return Promise.map(components, (component) => {
            return asyncReadDir(this.rootFolder + 'app/components/' + component)
                .then(list => this.loadSingleComponent(component, list))
        });
    }

    get dbInstanse() {
        let {Sequelize, sequelize} = db.getDB();
        return sequelize;
    }

    _loadModels() {
        let {Sequelize, sequelize} = db.getDB();
        for (let key in this.models) {
            this.models[key] = sequelize.import(this.models[key]);
        }
        for (let key in this.models) {
            if ('associate' in this.models[key]) this.models[key].associate(this.models);
            if ('initialize' in this.models[key]) this.models[key].initialize();
        }
    }

    loadSingleComponent(componentFolder, listOfParts) {
        assertEx(Array.isArray(listOfParts), 'Array expected');
        for (let i = 0; i < listOfParts.length; i++) {
            let fileName = listOfParts[i].replace('.js', '');
            if (fileName.includes('Model')) {
                assertEx(!this.models[fileName], `already have model ${fileName}`);
                this.models[fileName] = `${this.projectRoot}app/components/${componentFolder}/${listOfParts[i]}`;
            } else if (fileName.includes('Controller')) {
                assertEx(!this.controllers[fileName], `already have controller ${fileName}`);
                this.controllers[fileName] = require(`${this.projectRoot}app/components/${componentFolder}/${listOfParts[i]}`);
            } else if (fileName.includes('Service')) {
                assertEx(!this.services[fileName], `already have service ${fileName}`);
                this.services[fileName] = require(`${this.projectRoot}app/components/${componentFolder}/${listOfParts[i]}`);
            } else if (fileName.includes('Routes')) {
                let newRoutes = require(`${this.projectRoot}app/components/${componentFolder}/${listOfParts[i]}`);
                let exists = this.routes.filter(route => newRoutes.find(routeEl => routeEl.method == route.method && routeEl.path == route.path));
                assertEx(!exists.length, `this routes already exists:  ${JSON.stringify(exists)}`);
                this.routes = this.routes.concat(newRoutes);
            } else {
                logger.error('broken fileName', fileName);
            }
        }
    }

}

module.exports = new ServiceLocator();