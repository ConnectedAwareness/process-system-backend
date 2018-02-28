const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
const bookshelf = require('./db/bookshelf')
const userModel = require('./db/models').userModel

// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) { return next() }
//     res.send('unauthorized')
//         // res.redirect('/api/unauthorized')
// }

// ROUTES
const login = require('./routes/login')
const tokencheck = require('./routes/tokencheck')
const user = require('./routes/user')
const organisation = require('./routes/organisation')

//passport middleware

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    //TODO: check multiple users
    userModel.forge({id: id}).fetch().then((user)=>{
        if(!user) done(null, false)
        done(null, user)
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