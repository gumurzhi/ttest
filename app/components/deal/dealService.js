"use strict";

const SL = require('../../lib/serviceLocator')
    , logger = SL.getLogger(module)
    , models = SL.models
    , assertEx = SL.helper.assertEx
;

class DealService {
    addDeal() {
        return models.dealModel.create();
    }

    getByIdIncMessages(dealId, receiverId) {
        return models.dealModel.findOne({
                where: {id: dealId, state: 'open'}, include: [
                    {model: models.messageModel, as: 'messages', where: {receiver_id: receiverId}}
                ],
            }
        )
    }

    async getMy() {
        let messages = await SL.dbInstanse.query(
            `select
	"messages"."date",
	CONCAT("users".firstname,  CONCAT(' ',"users".lastname)) as sender,	
	'me' as receiver,
	text as message,
	price,
	deal_id
from
	messages
join "users" on sender_id = "users".id 
where receiver_id = 'e55bd465-0734-460f-abf2-2d0457d8548a'
union
select
	"messages"."date",
	'me' as sender,
	CONCAT("users".firstname,  CONCAT(' ',"users".lastname)) as receiver,	
	text as message,
	price,
	deal_id
from
	messages
join "users" on receiver_id = "users".id 
where sender_id = 'e55bd465-0734-460f-abf2-2d0457d8548a'
order by "date" asc
`
        );
         messages = JSON.parse(JSON.stringify(messages[0]));
        let deals = messages.reduce((res, cur) => {
            let dealId = cur.deal_id;
            delete  cur.deal_id;
            if(!res[dealId]){
                res[dealId] = [cur];
            } else  res[dealId].push(cur);
            return res;
        }, {});
        deals = Object.keys(deals).map(dealId => deals[dealId]);

return deals;
    }
}

module.exports = new DealService();