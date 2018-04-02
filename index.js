const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const passport = require('passport')
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
require('./db/db')
const Organisation = require('./db/organisation').Organisation

//passport middleware
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    //TODO: check multiple users
    Organisation.findOne({ 'users._id': id }, (err, organisation) => {
        if (err) done(err)
        else if (!res.json(organisation.users.id(id))) done(null, false)
        else done(null, res.json(organisation.users.id(id)))
    })
})

//""MIDDLEWARE""
const app = express()
app.use(cors())
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(passport.initialize())

/**
 * main resquest paths
 */
// ROUTES

app.use('/error', require('./routes/error/error'));
app.use('/login', require('./routes/auth/login'));
app.use(require('./routes/auth/tokencheck'))
app.use('/logout', require('./routes/auth/logout'));
app.use('/user', require('./routes/user/user'))
app.use('/organisation', require('./routes/organisation/organisation'))

// start server
app.all('*', (req, res) => {
    res.status(404).send('Request does not exist')
})
const server = app.listen(3000, () => { console.log('App listening on port 3000') })

module.exports = app