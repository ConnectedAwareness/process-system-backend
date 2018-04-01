const routes = require('express').Router()
// const userRouter = require('./user/user')
const Version = require('./../../db/version').Version


/**
 * TODO: create empty Version (no elements in it)
 * create new version
 */
routes.post('/empty', (req, res) => {

    let version = new Version()
    version.elements = []
    version.published = false
    version.save((err) => {
        if (err) res.send(err)
        else res.json({ message: 'version created!' })
    })
})
/**
 * TODO: create new Version with the elements of the last one
 */

/**
 * read one organisation
 */
routes.get('/:id', (req, res) => {
    Version.findById(req.params.id, (err, version) => {
        if (err) res.redirect('/error/404/?message=' + err.message)
        if (!version) res.redirect('/error/404/?message=version not found!')
        else res.json(version)
    })
})

/**
 * read multiple version
 */
routes.get('/', (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0
    let limit = parseInt(req.query.limit) || 10
    Version.find().skip(offset).limit(limit).exec((err, version) => {
        if (err) res.redirect('/error/404/?message=' + err.message)
        else res.json(version)
    })
})

/**
 * update one organisation
 */
routes.put('/:id', (req, res) => {

    Version.findById(req.params.id, (err, version) => {

            if (err) res.send(err)
            version.published =  req.body.published || organisation.published


            // save the version
            version.save((err) => {
                if (err) res.send(err)
                else res.json({ message: 'version ('+version._id+') published param changed!' })
            })
        })
})

/**
 * deletes one version
 */
routes.delete('/:id', (req, res) => {
    Version.remove({ _id: req.params.id },
        (err, version) => {
            if (err) res.send(err);
            else res.json({ message: 'Successfully deleted' });
        });
})

// routes.use('/:orga_id/user', userRouter)

module.exports = routes