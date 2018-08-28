
module.exports = [
    {method: 'get', path: '/deals/my', authRequired: true, middleware: 'dealController.getMy'}
];