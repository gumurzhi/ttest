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
;


class ServiceLocator {
    constructor() {
        this.rootFolder = __dirname.replace('app/lib', '');
        this.models = {};
        this.controllers = {};
        this.routes = {};
        this.services = {};
    }
    get helper(){
        return baseHelper;
    }

    get projectRoot() {
        return this.rootFolder;
    }

    getComponentsList() {
        return asyncReadDir(this.rootFolder + 'app/components')
    }

    getLogger(m) {
        return loggerLib(m)
    }

    initialize() {
        return this._loadComponents()
            .then(this._loadModels.bind(this))
            .then(() => db.connect())
           .then(() => {
               let migrations =  require('../helpers/migrations')
               return migrations();
           })
            .catch(err => {
                logger.error('ERROR:', err);
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
            try {
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
                    assertEx(!this.routes[fileName], `already have service ${fileName}`);
                    this.routes[fileName] = require(`${this.projectRoot}app/components/${componentFolder}/${listOfParts[i]}`);
                } else {
                    logger.error('broken fileName', fileName);
                }
            } catch (e) {
                logger.error(e)
            }
        }
    }

}

module.exports = new ServiceLocator();