const app = require('express')()
const bodyParser = require('body-parser')
const bookshelf = require('./bookshelf')

// ROUTES
const test = require('./routes/test')

//""MIDDLEWARE""
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


//  Connect all the routes to the application
app.use('/', test);

// Turn on that server!
var server = app.listen(3000, () => {
    console.log('App listening on port 3000');
});

module.exports = app;