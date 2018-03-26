const routes = require('express').Router({ mergeParams: true })
const User = require('./../../../db/user').User
const Organisation = require('./../../../db/organisation').Organisation

// routes.get('/:user_id', (req, res) => {
//   Organisation.findById(req.params.orga_id, (err, organisation) => {
//       if (err) res.redirect('/error/404/?message=' + err.message)
//       if (!organisation) res.redirect('/error/404/?message=organisation not found!')
//       else res.json(organisation)
//   })
// })
routes.post('/', (req, res) => {
    Organisation.findById(req.params.orga_id, (err, organisation) => {

        if (err) res.send(err)
        else {
            organisation.users.push({
                    email: req.body.email,
                    password: req.body.password,
                    alias: req.body.alias,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    role: req.body.role
                })
                // TODO: check if user with same password exists
            organisation.save((err) => {
                if (err) res.send(err)
                else res.json({ message: 'user created!' })
            })
        }
    })
})

routes.get('/', (req, res) => {
    Organisation.findById(req.params.orga_id, (err, organisation) => {
        if (err) res.json(err.message)
        else if (!organisation) res.json({ error: true, message: 'organisation does not exist' })
        else { res.json(organisation.users) }
    })
})

/**
 * TODO: check organisation does not exist
 */
routes.get('/:user_id', (req, res) => {
    Organisation.findById(req.params.orga_id, (err, organisation) => {
        if (err) res.json(err.message)
        else if (!organisation) res.json({ error: true, message: 'organisation does not exist' })
        else if (!organisation.users.id(req.params.user_id)) res.json({ error: true, message: 'user does not exist' })
        else { res.json(organisation.users.id(req.params.user_id)) }
    })
})

routes.delete('/:user_id', (req, res) => {
    Organisation.findById(req.params.orga_id, (err, organisation) => {
        let doc = organisation.users.id(req.params.user_id).remove();
        organisation.save((err) => {
            if (err) res.send(err)
            res.send('the sub-doc was removed')
        });
    })
})

module.exports = routes