
/**
 * This Module defines the authentification with a token called apikey
 * It is called every time exept when login
 */

const passport = require('passport')
const routes = require('express').Router()
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
const Organisation = require('./../db/organisation').Organisation

/**
 * registrates the auth strategy to the pasport service
 * TODO: apikey nicht in body bei get
 */
passport.use(new LocalApiKeyStrategy({}, (apikey, done) => {
    process.nextTick(() => {
        Organisation.findOne({ 'users.token': apikey }, (err, organisation) => {
            if (err) return done(err)
            if (!organisation || !organisation.users[0]) return done(null, false)
            return done(null, organisation.users[0])
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
routes.all('*', (req, res, next) => {
    req.body.apikey = req.headers.apikey
    passport.authenticate('localapikey')(req, res, next);
})
module.exports = routes