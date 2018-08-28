
module.exports = [
    {method: 'post', path: '/register', authRequired: false, middleware: 'userController.addUser'},
];