const passport = require('koa-passport');

const fetchUser = (() => {
    // This is an example! Use password hashing in your project and avoid storing passwords in your code
    const user = {id: 1, username: 'admin', password: 'ch3ckers!'};
    return async function () {
        return user
    }
})();

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await fetchUser();
        done(null, user)
    } catch (err) {
        done(err)
    }
});

const BasicStrategy = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(function (username, password, done) {
    fetchUser()
        .then(user => {
            if (username === user.username && password === user.password) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
        .catch(err => done(err))
}))

