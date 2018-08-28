const passport = require('koa-passport')
    , SL = require('../app/lib/serviceLocator')
    , models = SL.models
    , services = SL.services
;

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

passport.deserializeUser(async function (user, done) {
    try {
      //  const user = await fetchUser();
        done(null, user)
    } catch (err) {
        done(err)
    }
});

const BasicStrategy = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(function (email, password, done) {
    services.userService.getByEmail(email)
        .then(user => {
            if (user && user.comparePassword(password)) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
        .catch(err => done(err))
}));

