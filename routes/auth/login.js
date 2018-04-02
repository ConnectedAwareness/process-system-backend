/**
 * This module defines the Loginrequest with pasport authentification
 */

const passport = require('passport');
const routes = require('express').Router();
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const Organisation = require('./../../db/organisation').Organisation;
const User = require('./../../db/user').User;

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
            if (!organisation) return done(null, false)
            let user = organisation.users[0]
            if (err) return done(err)
            user.token = generateTokenFromId(user._id)
            // save the user
            organisation.save((err) => {
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
    failureRedirect: '/error/login',
}), (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            alias: req.user.alias,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            roles: req.user.roles,
            token: req.user.token
        }
    })
});

module.exports = routes;