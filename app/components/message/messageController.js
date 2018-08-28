const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , services = SL.services
    , assertEx = SL.helper.assertEx
;

class MessageController {

    addMessage(user, params, query, body){
        assertEx(user.id != params.recipientId, `you can't make deal with yourself`, 400);
        return params.dealId ? services.messageService.addMessage(user, params.dealId, params.recipientId, body ) : services.messageService.addMessageAndDeal(user, params.recipientId, body);
    }


}

module.exports = new MessageController();