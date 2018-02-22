const passport = require('passport')
const routes = require('express').Router()
const LocalStrategy = require('passport-local').Strategy
const userConnection = require('../db/user')

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    process.nextTick(() => {
        userConnection.loginExists(email, password, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        })
    })
}));

routes.post('/', passport.authenticate('local', {
    failureRedirect: '/',
}), (req, res) => {
    res.json({ token: req.user.token })
})

module.exports = routes