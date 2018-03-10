const routes = require('express').Router()
const User = require('./../db/user').User
const publicInformations = ["id", "email", "name", "forename", "surname", "role"]

/**
 * create a new user 
 */
routes.post('/', (req, res) => {

    // test body parameters
    if (req.body.email && req.body.password) {
        //test if user exists
        User.byEmail(req.body.email).then((user) => {
            if (user) throw new Error('user exists!')

            //generate and save new user
            User.save(req.body).then((data) => {
                res.json({ error: false, data: data })
            }).catch((err) => { res.redirect('/error/404/?message=' + err.message) })
        }).catch((err) => { res.redirect('/error/404/?message=' + err.message) })
    } else {
        res.redirect('/error/404/?message=' + new Error('email and password neaded!').message)
    }
})
/**
 * read user with special id
 */
routes.get('/:id', (req, res) => {
    User.byId(req.params.id).then((data) => {
        if (data) res.json({
            error: false,
            data: data
        })
        else {
            throw new Error('user not found!')
        }
    }).catch((err) => { res.redirect('/error/404/?message=' + err.message) })
})
/**
 * read group of users with limit and offset parameters
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    if (offset != NaN && limit != NaN) {
        User.getAll(limit, offset).then((data) => {
            res.json({
                error: false, data: data.toJSON()
            })
        })
    }
    else {
        next()
    }
})

/**
 * updates user informations
 * TODO: email verification
 * TODO: link to model
 */
routes.put('/:id', (req, res) => {
    User.forge({ id: req.params.id })
        .fetch({ columns: publicInformations })
        .then((user) => {
            user.save({
                email: req.body.email || user.get('email'),
                name: req.body.name || user.get('name'),
                forename: req.body.forename || user.get('forename'),
                surname: req.body.surname || user.get('surname'),
                password: req.body.password || user.get('password'),
                role: req.body.role || user.get('role')
            }).then((data) => {
                res.json({ error: false, data: data })
            }).catch((err) => { res.redirect('/error/404/?message=' + err.message) })
        })
        .catch((err) => { res.redirect('/error/404/?message=' + err.message) })
})

/**
 * deletes one user
 * TODO: link to model
 */
routes.delete('/:id', (req, res) => {
    User.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(function (user) {
            user.destroy()
                .then(() => { res.json({ error: false }) })
                .catch((err) => { res.redirect('/error/404/?message=' + err.message) })
        })
        .catch((err) => { res.redirect('/error/404/?message=' + err.message) })
})


module.exports = routes