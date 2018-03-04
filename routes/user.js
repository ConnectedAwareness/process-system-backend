const routes = require('express').Router()
const userModel = require('./../db/models').userModel

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
    if (!req.body.email || !req.body.password) {
        res.status(500).json({
            error: true,
            data: { message: 'not data' }
        })
    }

    //test if user exists
    userModel.forge({ email: req.body.email }).fetch().then((user) => {
        if (user) {
            res.status(400).json({
                error: true,
                data: { message: 'user exists!' }
            })
        }

        //generate and save new user
        userModel.forge(generateObject(['email', 'password', 'name'], req)).save()
            .then((user) => {
                res.json({ error: false, user })
            })
            .catch((err) => {
                res.status(500).json({
                    error: true,
                    data: { message: err.message }
                })
            })
    })
})
/**
 * read user with special id
 */
routes.get('/:id', (req, res) => {
    userModel.forge({ id: req.params.id }).fetch().then((user) => {
        console.log(user)
        if (user) res.json({
            error: false,
            data: {
                id: user.attributes.id,
                email: user.attributes.email,
                name: user.attributes.name
            }
        })
        else {
            res.json({
                error: true,
                data: { message: 'user not found!' }
            })
        }
    })
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
        }).fetchAll().then((data) => {
            data = data.toJSON()
            res.json({error: false, data: data})
        })
    }
    else {
        next()
    }
    console.log(res)
})

routes.put('/:id', (req, res) => {
    userModel.forge({ id: req.params.id })
        .fetch({ require: true })
        .then((user) => {
            user.save({
                name: req.body.name || user.get('name'),
                email: req.body.email || user.get('email'),
                password: req.body.password || user.get('password')
            }).then(() => {
                res.json({
                    error: false,
                    data: { message: 'User details updated' }
                });
            }).catch((err) => {
                res.status(500).json({
                    error: true,
                    data: { message: err.message }
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: true,
                data: { message: err.message }
            });
        });
})

routes.delete('/:id', (req, res) => {
    userModel.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(function (user) {
            user.destroy()
                .then(() => {
                    res.json({
                        error: true,
                        data: { message: 'User successfully deleted' }
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        error: true,
                        data: { message: err.message }
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: true,
                data: { message: err.message }
            });
        });
})


module.exports = routes