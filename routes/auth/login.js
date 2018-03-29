/**
 * This module defines the Loginrequest with pasport authentification
 */

const passport = require('passport');
const routes = require('express').Router();
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const Organisation = require('./../../db/organisation').Organisation;

/**
 * generates a random String with length of 10 - 12 and chars from 0 to z
 */
const generateRandomString = () => Math.random().toString(36).substring(2);

/**
 * defines the crypto secret while starting the api
 */
const secret = generateRandomString();

/**
 * generates token from random String and user id
 * TODO: maybe there could be a timestamp in the String too
 * @param {user id} id 
 */
const generateTokenFromId = (id) => {
    return crypto.createHmac('sha256', secret)
        .update(generateRandomString() + '_' + id)
        .digest('hex');
}

// PASSPORT

/**
 * registrates the auth strategy to the pasport service
 */
passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    process.nextTick(() => {
        Organisation.findOne({ 'users.email': email, 'users.password': password }, (err, organisation) => {
            let user = organisation.users[0]
            const token = generateTokenFromId(user._id)
            if (err) return done(err)
            user.token = token

            // save the user
            user.save((err) => {
                if (err) return done(err)

                return done(null, user)
            })
        })
    })
}));

// REST

/**
 * local calls LocalStrategy from passport (Ammon)
 * defines the login request with pasport authentification and returns the token
 */
routes.post('/', passport.authenticate('local', {
    failureRedirect: '/',
}), (req, res) => {
    console.log('the post user function');
    res.json({ token: req.user.token })
});

module.exports = routes;