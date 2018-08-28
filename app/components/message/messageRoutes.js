
module.exports = [
    {method: 'post', path: '/message/:recipientId', authRequired: true, middleware: 'messageController.addMessage'},
    {method: 'post', path: '/message/:recipientId/:dealId', authRequired: true, middleware: 'messageController.addMessage'},
];