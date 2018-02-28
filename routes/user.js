const routes = require('express').Router()

routes.post('/', (req, res) => {
    res.send('post user')
})

routes.get('/', (req, res) => {
    res.send('get user')
})

module.exports = routes