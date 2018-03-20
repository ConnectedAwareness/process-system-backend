const routes = require('express').Router()
const UserModel = require('./../db/user').UserModel

/**
 * create a new user 
 */
routes.post('/', (req, res) => {
    let user = new UserModel()
    user.email = req.body.email
    user.password = req.body.password
    user.alias = req.body.alias
    user.first_name = req.body.first_name
    user.last_name = req.body.last_name
    user.role = req.body.role
    user.save((err) => {
        if (err) res.send(err)
        else res.json({ message: 'user created!' })
    })
})
/**
 * read user with special id
 */
routes.get('/:id', (req, res) => {
    UserModel.findById(req.params.id).select('-password').exec((err, user) => {
        if (err) res.send(err)
        else res.json(user)
    })
})
/**
 * read group of users with limit and offset parameters
 * TODO: Skip && Limit
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    UserModel.find().select('-password').skip(offset).limit(limit).exec((err, users) => {
        if (err) res.send(err)
        else res.json(users)
    })
})

/**
 * updates user informations
 * TODO: email verification
 * TODO: link to model
 */
routes.put('/:id', (req, res) => {
    UserModel.findById(req.params.id, function (err, user) {

        if (err) res.send(err)

        if (req.body.email) user.email = req.body.email
        if (req.body.password) user.password = req.body.password
        user.alias = req.body.alias
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.role = req.body.role

        // save the user
        user.save(function (err) {
            if (err) res.send(err)

            res.json({ message: 'user updated!' })
        })
    })
})

/**
 * deletes one user
 * TODO: link to model
 */
routes.delete('/:id', (req, res) => {
    UserModel.remove({
        _id: req.params.id
    }, (err, user) => {
        if (err) res.send(err)

        res.json({ message: 'Successfully deleted' })
    })
})


module.exports = routes