const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
;

class DealController {

    getMy(user, params, query, body){
        return services.dealService.getMy(user.id)
    }


}

module.exports = new DealController();