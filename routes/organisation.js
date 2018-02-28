const routes = require('express').Router()
// const userConnection = require('../db/user')

routes.post('/', (req, res) => {
    res.send('post organisation')
})

routes.get('/', (req, res) => {
    res.send('get organisation')
})

module.exports = routes