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
    describe('getComponentsList tests', () => {
        it('just call method', (done) => {
            serviceLocator.getComponentsList()
                .then(data =>{
                    assert(data.length > 0, 'there should be components');
                       done()
                    })
                    .catch(err =>{
                        logger.error('ERROR:', err);
                    });
        })
    })
    it('dfdfd', (done) => {
        serviceLocator.initialize()
            .then(data =>{
                   logger.info('data',data);

                })
            .then(() => {
                return serviceLocator.models.dealModel.create()
            })
            .then(data => {
                console.log(data);
                done();
            })
                .catch(err =>{
                    logger.error('ERROR:', err);
                });
    })
});
