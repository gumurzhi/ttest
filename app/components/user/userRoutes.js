
module.exports = [
    {method: 'post', path: '/register', authRequired: false, middleware: ['userController.addUser']},
    {method: 'get', path: '/login', authRequired: false, middleware: ['userController.login']}
];