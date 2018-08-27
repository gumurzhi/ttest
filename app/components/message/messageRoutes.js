
module.exports = [
    {method: 'post', path: '/register1', authRequired: true, middleware: 'userController.test'},
   // {method: 'get', path: '/login1', authRequired: true, middleware: 'userController.login'}
];