/**
 * This module defines the Loginrequest with pasport authentification
 */

const passport = require('passport')
const routes = require('express').Router()
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const userModel = require('./../db/models').userModel

/**
 * generates a random String with length of 10 - 12 and chars from 0 to z
 */
const generateRandomString = () => Math.random().toString(36).substring(2)

/**
 * defines the crypto secret while starting the api
 */
const secret = generateRandomString()

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

/**
 * generates a new Token and saves it in the DB
 * @param {user object} user 
 * @param {*done function of passport} done 
 */
const updateToken = (user, done) => {
    const token = generateTokenFromId(user.id)
    userModel.forge({id: user.id}).fetch({require: true})
    .then((u) => {
      u.save({token: token})
      .then(() => {
          user.token = token
          return done(null, user)
      })
      .catch((err) => {done(err)});
    })
    .catch((err) => {done(err)});
}

// PASSPORT

/**
 * registrates the auth strategy to the pasport service
 */
passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    process.nextTick(() => {
        userModel.forge({email: email, password: password}).fetch().then((user)=>{
            if(!user) return done(null, false)
            return updateToken(user, done)
        })
    })
}));

// REST

/**
 * defines the login request with pasport authentification and returns the token
 */
routes.post('/', passport.authenticate('local', {
    failureRedirect: '/',
}), (req, res) => {
    res.json({ token: req.user.token })
})

module.exports = routes