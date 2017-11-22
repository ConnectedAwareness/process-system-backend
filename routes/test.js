const routes = require('express').Router()
const bookshelf = require('./../bookshelf')

//TABLES
const User = require('./../tables').User

routes.get('/', (req, res) => {
    new User().fetchAll()
        .then(function(users) {
            res.status(200).send(users.toJSON())
        }).catch(function(error) {
            console.log(error)
            res.status(400).send('An error occured')
        });
});

module.exports = routes