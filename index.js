const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const LocalApiKeyStrategy = require('passport-localapikey').Strategy
const cookieParser = require('cookie-parser')
const userConnection = require('./db/user')

// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) { return next() }
//     res.send('unauthorized')
//         // res.redirect('/api/unauthorized')
// }

// ROUTES
const test = require('./routes/test')
const login = require('./routes/login')
const tokencheck = require('./routes/tokencheck')

//passport middleware

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    userConnection.findById(id, (err, user) => {
        done(err, user)
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

// app.use(flash())
// app.use(cookieParser());
app.use(passport.initialize())

app.use('/login', login)
app.use(tokencheck)
app.get('/', (req, res) => {
    // cookieParser()
    res.send('error')
})

// start server
app.all('*', (req, res) => {
    res.status(404).send('Request does not exist')
})
const server = app.listen(3000, () => { console.log('App listening on port 3000') })

module.exports = app