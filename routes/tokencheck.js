const passport = require('passport')
const routes = require('express').Router()
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
const userConnection = require('../db/user')

/**
 * TODO: apikey nicht in body bei get
 */
passport.use(new LocalApiKeyStrategy((apikey, done) => {
    process.nextTick(() => {
        userConnection.tokenExists(apikey, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        })
    })
}))

/**
 * checks if the user of the token exists
 * TODO: should check if the token ist out of date
 * 
 * if incorrect: return error => the user has to login
 * if correct: give the user information to the requested service
 */

routes.all('*', passport.authenticate('localapikey'), (req, res, next) => {
    next()
})
module.exports = routes