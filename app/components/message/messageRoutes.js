
module.exports = [
    {method: 'post', path: '/message/:recipientId', authRequired: true, middleware: 'messageController.addMessage'},
    {method: 'post', path: '/:recipientId/message/:dealId', authRequired: true, middleware: 'messageController.addMessage'},
];