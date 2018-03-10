const routes = require('express').Router()
const Organisation = require('./../db/organisation').Organisation

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
        Organisation.forge({ name: req.body.name }).fetch().then((user) => {
            if (user) throw new Error('organisation exists!')

            Organisation.forge({ id: req.body.coordinator_id }).fetch({ columns: ['id'] }).then((data) => {
                if (!data) {
                    throw new Error('user not found!')
                }
                Organisation.forge(generateObject(['name', 'coordinator_id'], req)).save()
                    .then((data) => {
                        res.json({ error: false, data: data })
                    }).catch((err) => { res.redirect('/error/404/?message='+err.message) })
            }).catch((err) => { res.redirect('/error/404/?message='+err.message) })
            //generate and save new user
        }).catch((err) => { res.redirect('/error/404/?message='+err.message) })
    } else {
        res.redirect('/error/404/?message='+new Error('name and coordinator_id neaded!').message)
    }
})

/**
 * read one organisation
 */
routes.get('/:id', (req, res) => {
    Organisation.forge({ id: req.params.id }).fetch().then((data) => {
        if (data) res.json({
            error: false,
            data: data
        })
        else {
            throw new Error('user not found!')
        }
    }).catch((err) => { res.redirect('/error/404/?message='+err.message) })
})

routes.get('/:id/users', (req, res)=>{
    Organisation.getUsers(req.params.id).then((data)=>{
        res.json({
            error: false,
            data: data
        })
    }).catch((err)=>{
        res.redirect('/error/404/?message='+err.message)
    })
})

/**
 * read multiple organisation
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    if (offset != NaN && limit != NaN) {
        Organisation.query((qb) => {
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
    Organisation.forge({ id: req.params.id })
        .fetch()
        .then((user) => {
            user.save({
                name: req.body.name || user.get('name'),
                coordinator_id: req.body.coordinator_id || user.get('coordinator_id')
            }).then((data) => {
                res.json({ error: false, data: data })
            }).catch((err) => { res.redirect('/error/404/?message='+err.message) })
        })
        .catch((err) => { res.redirect('/error/404/?message='+err.message) })
})

/**
 * deletes one organisation
 */
routes.delete('/:id', (req, res) => {
    Organisation.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(function (user) {
            user.destroy()
                .then(() => { res.json({ error: false }) })
                .catch((err) => { res.redirect('/error/404/?message='+err.message) })
        })
        .catch((err) => { res.redirect('/error/404/?message='+err.message) })
})

module.exports = routes