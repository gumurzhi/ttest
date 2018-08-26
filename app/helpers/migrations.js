'use strict';

const SL = require('../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , Umzug    = require('umzug')
;

module.exports = function() {
    let sequelize = SL.dbInstanse;
    let umzug = new Umzug({
        storage:        'sequelize',
        storageOptions: { sequelize },
        migrations: {
            params:  [ sequelize.getQueryInterface(), sequelize.constructor ],
            path:    `${SL.projectRoot}/migrations`,
            pattern: /\.js$/
        }
    });
    return umzug.pending()
    .then(migrations => {
        if (!migrations.length) {
            return;
        }
        logger.info(`Please wait while ${migrations.length} migrations will be executed`);
        return umzug.execute({
            migrations: migrations.map(migration => migration.file),
            method:     'up'
        });
    })
    .then(migrations => {
        if (!migrations) {
            return logger.info('Data schema already up-to-date');
        }
        logger.info(`${migrations.length} migrations have been successfully applied`);
    })
    .catch(error => {
        logger.error(`Sequelize sync error: ${error.toString()}\n${error.stack}`);
        throw error;
    });
};
