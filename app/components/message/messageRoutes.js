
module.exports = [
    {method: 'post', path: '/register1', authRequired: false, middleware: ['userController.addUser']},
    {method: 'get', path: '/login1', authRequired: false, middleware: ['userController.login']}
];