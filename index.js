const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
const mongoose = require('mongoose');
const Organisation = require('./db/organisation').Organisation

// ROUTES
const login = require('./routes/login')
const tokencheck = require('./routes/tokencheck')
const user = require('./routes/user')
const organisation = require('./routes/organisation')

//passport middleware



mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected with database!')
});

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    //TODO: check multiple users
    Organisation.findOne({ 'users._id': id }, (err, organisation) => {
        if (err) done(err)
        else if(!res.json(organisation.users.id(id))) done(null, false)
        else done(null, res.json(organisation.users.id(id)))
    })
})

//""MIDDLEWARE""
const app = express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(passport.initialize())

/**
 * main resquest paths
 */
const validErrorCodes = [404, 505] // TODO: find other soltion to check error codes
app.all('/error/:id', (req, res) => {
    let code;
    validErrorCodes.forEach(c => {
        if (c == req.params.id) code = c
    })
    if (code) {
        res.status(code).json({ error: req.query.message })
    } else {
        res.status(404).json({
            error: 'Invalid status code ' + req.params.id
        })
    }
})
app.use('/login', login)
app.use(tokencheck)
app.use('/user', user)
app.use('/organisation', organisation)

// start server
app.all('*', (req, res) => {
    res.status(404).send('Request does not exist')
})
const server = app.listen(3000, () => { console.log('App listening on port 3000') })

module.exports = app