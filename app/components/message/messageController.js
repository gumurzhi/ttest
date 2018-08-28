const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
;

class MessageController {

    addMessage(user, params, query, body){
        return params.dealId ? services.messageService.addMessage(user, params.dealId, params.recipientId, body ) : services.messageService.addMessageAndDeal(user, params.recipientId, body);
    }


}

module.exports = new MessageController();