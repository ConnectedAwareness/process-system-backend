const routes = require('express').Router()
const userRouter = require('./user/user')
const User = require('./../../db/user').User
const Organisation = require('./../../db/organisation').Organisation


/**
 * create one organisation
 */
routes.post('/', (req, res) => {

    let organisation = new Organisation()
    organisation.name = req.body.name
    organisation.users = []
    organisation.save((err) => {
        if (err) res.send(err)
        else res.json({ message: 'organisation created!' })
    })
})

/**
 * read one organisation
 */
routes.get('/:id', (req, res) => {
    Organisation.findById(req.params.id, (err, organisation) => {
        if (err) res.redirect('/error/404/?message=' + err.message)
        if (!organisation) res.redirect('/error/404/?message=organisation not found!')
        else res.json(organisation)
    })
})

/**
 * read multiple organisation
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    Organisation.find().skip(offset).limit(limit).exec((err, organisation) => {
        if (err) res.redirect('/error/404/?message=' + err.message)
        else res.json(organisation)
    })
})

/**
 * update one organisation
 */
routes.put('/:id', (req, res) => {

    Organisation.findById(req.params.id,
        (err, organisation) => {

            if (err) res.send(err)
            organisation.name = req.body.name || organisation.name

            // save the organisation
            organisation.save((err) => {
                if (err) res.send(err)
                else res.json({ message: 'organisation updated!' })
            })
        })
})

/**
 * deletes one organisation
 */
routes.delete('/:id', (req, res) => {
    Organisation.remove({ _id: req.params.id },
        (err, organisation) => {
            if (err) res.send(err);
            else res.json({ message: 'Successfully deleted' });
        });
})

routes.use('/:orga_id/user', userRouter)

module.exports = routes