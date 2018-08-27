const config = require('../../config/appConfig')
    ,logger = require('./logger')(module)
    , Sequelize = require('sequelize')
;

let reconnectTimeout = 1000
    ,firstConnect = 1
    ,timestamp
;

function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

class Db {
    constructor(){
     this.sequelize = new Sequelize(
         config.postgres.database,
         config.postgres.username,
         config.postgres.password,
         config.postgres
     )
    }
    getDB() {
        return {sequelize: this.sequelize, Sequelize}
    }
    connect() {
        logger.debug(`Connecting to ${config.postgres.database} database at host: ${config.postgres.host}, port: ${config.postgres.port}`);
        return this.sequelize.authenticate.call(this.sequelize)
            .then(() => {
                if (firstConnect) {
                    logger.debug('Database connected');
                    firstConnect = false;
                } else {
                    logger.debug(`Database connection re-established after ${new Date(new Date() - timestamp).getSeconds()} seconds`);
                    reconnectTimeout = 1000;
                }
                this.sequelize.connectionManager.getConnection()
                    .then(connection => {
                        connection.on('end', () => {
                            timestamp = new Date();
                            logger.debug('Database disconnected');
                            connect();
                        })
                    })
                    .catch(err => {
                        logger.error('sequelize.connectionManager.getConnection got ERROR:', err)
                    })
            })
            .catch(() => {
                logger.error(`Database connection failed. Try again after ${reconnectTimeout / 1000} seconds`);
                reconnectTimeout *= 2;
                return delay(reconnectTimeout)
                    .then(() => this.connect());
            });
    }
}


module.exports = new Db();