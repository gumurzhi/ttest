const logger = require('../../../app/lib/logger')(module)
    , sinon = require('sinon')
    , assert = require('assert')
    , serviceLocator = require('../../../app/lib/serviceLocator')
;
let sandbox;
describe('flow.run.service tests', () => {
    before(() => {
    });
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('just fake call method', () => {
        serviceLocator.getLogger(module);
        logger.info(`it's fine`)
    })
    it('just fake call method', () => {
        serviceLocator.getLogger(module);
        fdfd
        logger.info(`it's fine`)
    })
});
