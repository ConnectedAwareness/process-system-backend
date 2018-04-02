const routes = require('express').Router({ mergeParams: true })
const User = require('./../../db/user').User
const Organisation = require('./../../db/organisation').Organisation

routes.post('/', (req, res) => {
    Organisation.findOne({ 'users.token': req.user.token }, (err, organisation) => {
        let user = organisation.users[0]
        user.token = undefined
        organisation.save((err) => {
            res.json({message: 'token deleted!'})
        })
    })
})

module.exports = routes