"use strict";

const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
    , assertEx = SL.helper.assertEx
;

class UserController {

    addUser(user, params, query, body){
        assertEx(body.firstname && body.lastname && body.email && body.password, `firstname, lastname, email, password expected`, 400);
        return services.userService.addUser(body)
    }

}

module.exports = new UserController();