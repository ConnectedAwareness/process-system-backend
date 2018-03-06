const routes = require('express').Router()
const organisationModel = require('./../db/models').organisationModel

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
 * TODO: create connector automaticaly
 * create one organisation
 */
routes.post('/', (req, res) => {

    // test body parameters
    if (req.body.name && req.body.coordinator_id) {
        //test if user exists
        organisationModel.forge({ name: req.body.name }).fetch().then((user) => {
            if (user) throw new Error('organisation exists!')

            organisationModel.forge({ id: req.body.coordinator_id }).fetch({ columns: ['id'] }).then((data) => {
                if (!data) {
                    throw new Error('user not found!')
                }
                organisationModel.forge(generateObject(['name', 'coordinator_id'], req)).save()
                    .then((data) => {
                        res.json({ error: false, data: data })
                    }).catch((err) => { sendError(res, 500, err) })
            }).catch((err) => { sendError(res, 500, err) })
            //generate and save new user
        }).catch((err) => { sendError(res, 500, err) })
    } else {
        sendError(res, 500, new Error('name and coordinator_id neaded!'))
    }
})

/**
 * read one organisation
 */
routes.get('/:id', (req, res) => {
    organisationModel.forge({ id: req.params.id }).fetch().then((data) => {
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
 * read multiple organisation
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    if (offset != NaN && limit != NaN) {
        organisationModel.query((qb) => {
            qb.limit(limit).offset(offset)
        }).fetchAll()
            .then((data) => {
                res.json({ error: false, data: data.toJSON() })
            })
    }
    else {
        next()
    }
})

/**
 * update one organisation
 */
routes.put('/:id', (req, res) => {
    organisationModel.forge({ id: req.params.id })
        .fetch()
        .then((user) => {
            user.save({
                name: req.body.name || user.get('name'),
                coordinator_id: req.body.coordinator_id || user.get('coordinator_id')
            }).then((data) => {
                res.json({ error: false, data: data })
            }).catch((err) => { sendError(res, 500, err) })
        })
        .catch((err) => { sendError(res, 500, err) })
})

/**
 * deletes one organisation
 */
routes.delete('/:id', (req, res) => {
    organisationModel.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(function (user) {
            user.destroy()
                .then(() => { res.json({ error: false }) })
                .catch((err) => { sendError(res, 500, err) })
        })
        .catch((err) => { sendError(res, 500, err) })
})

module.exports = routes