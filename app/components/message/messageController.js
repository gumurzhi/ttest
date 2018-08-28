const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
;

class MessageController {

    addMessage(user, params, query, body){
        params.dealId = 44;
        return params.dealId ? services.messageService.addMessage(user, params.dealId, params.recipientId, body ) : services.messageService.addMessageAndDeal(user, params.recipientId, body);
      //  return services.userService.addUser(body)
        //    return {a: 3443}
    }


}

module.exports = new MessageController();