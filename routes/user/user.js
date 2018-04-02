const routes = require('express').Router()
const Organisation = require('./../../db/organisation').Organisation
const getDefaultOrganisationId = require('./../../db/organisation').getDefaultOrganisationId


/**
 * create a new user 
 * if the id is not set use DEFAULT organisation
 */
routes.post('/', (req, res) => {
        Organisation.findById(req.body.id || getDefaultOrganisationId(), (err, organisation) => {

            if (err) res.send(err)
            else {
                let user = new UserModel()
                user.email = req.body.email
                user.password = req.body.password
                user.alias = req.body.alias
                user.first_name = req.body.first_name
                user.last_name = req.body.last_name
                user.roles = req.body.roles
                organisation.users.push(user)
                organisation.save((err) => {
                    if (err) res.send(err)
                    else res.json({ message: 'user created!' })
                })
            }
        })
    })
    /**
     * read user with special id
     */
routes.get('/:id', (req, res) => {
        Organisation.findOne({ 'users._id': req.params.id }, (err, organisation) => {
            if (err) res.json(err.message)
            else { res.json(organisation.users.id(req.params.id)) }
        })
    })
    /**
     * read group of users with limit and offset parameters
     * TODO: Skip && Limit
     */
routes.get('/', (req, res, next) => {
    // let offset = parseInt(req.query.offset) || 0
    // let limit = parseInt(req.query.limit) || 10
    // UserModel.find().select('-password').skip(offset).limit(limit).exec((err, users) => {
    //     if (err) res.send(err)
    //     else res.json(users)
    // })
})

/**
 * updates user informations
 * TODO: email verification
 * TODO: link to model
 */
routes.put('/:id', (req, res) => {
    // UserModel.findById(req.params.id, function (err, user) {

    //     if (err) res.send(err)

    //     if (req.body.email) user.email = req.body.email
    //     if (req.body.password) user.password = req.body.password
    //     user.alias = req.body.alias
    //     user.first_name = req.body.first_name
    //     user.last_name = req.body.last_name
    //     user.role = req.body.role

    //     // save the user
    //     user.save(function (err) {
    //         if (err) res.send(err)

    //         res.json({ message: 'user updated!' })
    //     })
    // })
})

/**
 * deletes one user
 * TODO: link to model
 */
routes.delete('/:id', (req, res) => {

    // Organisation.findOne({ 'users._id': req.params.id }, (err, organisation) => {
    //     if (err) res.json(err.message)
    //     else {res.json(organisation.users.id(req.params.id))}
    // })
    // UserModel.remove({
    //     _id: req.params.id
    // }, (err, user) => {
    //     if (err) res.send(err)

    //     res.json({ message: 'Successfully deleted' })
    // })
})


module.exports = routes