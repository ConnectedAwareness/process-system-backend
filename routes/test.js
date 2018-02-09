const routes = require('express').Router()

routes.get('/', (req, res) => {
    res.send('test2')
});

module.exports = routes