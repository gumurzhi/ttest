"use strict";

const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , models = SL.models
    , assertEx = SL.helper.assertEx
;

class UserService{
    async isEmailExists(email){
        let user = await this.getByEmail(email);
        return !!user;
    }

    async addUser(user){
        logger.debug('try to create user',);
        assertEx(user.email, 'email expected');
        assertEx(!(await this.isEmailExists(user.email)));
        const savedUser = await models.userModel.create(user);
        logger.debug(`user ${JSON.stringify(savedUser)} \n  created`);
        return savedUser;
    }

    async getByEmail(email){
        return models.userModel.findOne({where: {email}});
    }

}

module.exports = new UserService();