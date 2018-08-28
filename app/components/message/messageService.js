"use strict";

const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , models = SL.models
    , services = SL.services
    , assertEx = SL.helper.assertEx
;

class MessageService{
    async addMessageAndDeal(sender, recipientId, message){
        recipientId = 'e55bd465-0734-460f-abf2-2d0457d8548a';
        const receiver = await services.userService.getById(recipientId);
        assertEx(!!receiver, `no recipient with such id: ${recipientId}`);
       let newDeal =  await services.dealService.addDeal();
       message.sender_id = sender.id;
       message.receiver_id = receiver.id;
       message.deal_id = newDeal.id;
       return models.messageModel.create(message)
    }
    async addMessage(user, dealId, receiverId, message ){
        receiverId = 'cd720887-e399-47f3-a042-6619f9edaa15'
        user.id = 'e55bd465-0734-460f-abf2-2d0457d8548a';
        dealId = '952b7cf2-af13-4954-96c3-efc9c2a743b6';
        const receiver = await services.userService.getById(receiverId);
        assertEx(!!receiver, `no recipient with such id: ${receiverId}`);
        const deal = await services.dealService.getByIdIncMessages(dealId, user.id);
        assertEx(!!deal, `no open deal with such id: ${dealId}`);
        if(message.price < 0) {
            deal.setDataValue('state', 'rejected');
            await  deal.save();
        }
        if(deal.messages.find((msg) => msg.price == message.price)){
            deal.setDataValue('state', 'closed');
            await  deal.save();
        }
        message.sender_id = user.id;
        message.receiver_id = receiverId;
        message.deal_id = deal.id;
        return models.messageModel.create(message)
    }
}

module.exports = new MessageService();