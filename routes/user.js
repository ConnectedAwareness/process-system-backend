const routes = require('express').Router()
const userModel = require('./../db/models').userModel
const publicInformations = ["id", "email", "name", "forename", "surname", "role"]

const sendError = (res, status, err) => {
    res.status(status).json({
        error: true,
        data: { message: err.message }
    })
}

const generateObject = (datanames, req) => {
    const obj = {}
    datanames.forEach(name => {
        if (req.body[name]) obj[name] = req.body[name]
    })
    return obj
}

/**
 * create a new user 
 */
routes.post('/', (req, res) => {

    // test body parameters
    if (req.body.email && req.body.password) {
        //test if user exists
        userModel.forge({ email: req.body.email }).fetch().then((user) => {
            if (user) throw new Error('user exists!')

            //generate and save new user
            userModel.forge(generateObject(['email', 'password', 'name', 'forename', 'surname', 'role'], req)).save()
                .then((data) => {
                    res.json({ error: false, data: data })
                }).catch((err) => { sendError(res, 500, err) })
        }).catch((err) => { sendError(res, 500, err) })
    } else {
        sendError(res, 500, new Error('email and password neaded!'))
    }
})
/**
 * read user with special id
 */
routes.get('/:id', (req, res) => {
    userModel.forge({ id: req.params.id }).fetch({ columns: publicInformations }).then((data) => {
        if (data) res.json({
            error: false,
            data: data
        })
        else {
            throw new Error('user not found!')
        }
    }).catch((err) => { sendError(res, 500, err) })
})
/**
 * read group of users with limit and offset parameters
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    if (offset != NaN && limit != NaN) {
        userModel.query((qb) => {
            qb.limit(limit).offset(offset)
        }).fetchAll({ columns: publicInformations })
            .then((data) => {
                res.json({ error: false, data: data.toJSON() })
            })
    }
    else {
        next()
    }
})

/**
 * updates user informations
 * TODO: email verification
 */
routes.put('/:id', (req, res) => {
    userModel.forge({ id: req.params.id })
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
            }).catch((err) => { sendError(res, 500, err) })
        })
        .catch((err) => { sendError(res, 500, err) })
})

/**
 * deletes one user
 */
routes.delete('/:id', (req, res) => {
    userModel.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(function (user) {
            user.destroy()
                .then(() => { res.json({ error: false }) })
                .catch((err) => { sendError(res, 500, err) })
        })
        .catch((err) => { sendError(res, 500, err) })
})


module.exports = routes