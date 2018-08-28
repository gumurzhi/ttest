"use strict";

const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
;

class UserController {

    addUser(user, params, query, body){
        return services.userService.addUser(body)
    }

}

module.exports = new UserController();