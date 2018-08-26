const log4js = require('log4js');
let a = require('../../config/log4js');
log4js.configure(a);
/**
 *
 * @param  m
 * @returns {Logger}
 */
module.exports = (m) => {
    let filename = m.filename.match(/([A-Za-z0-9\.]+)$/)[0];
    return log4js.getLogger(filename ? filename : m.filename);
};