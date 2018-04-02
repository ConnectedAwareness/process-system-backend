const routes = require('express').Router({ mergeParams: true })

const validErrorCodes = [404, 505] // TODO: find other soltion to check error codes
routes.all('/login', (req, res) => {
    res.status(404).json({error: 'login incorect!'})
})
routes.all('/:id', (req, res) => {
    let code;
    validErrorCodes.forEach(c => {
        if (c == req.params.id) code = c
    })
    if (code) {
        res.status(code).json({ error: req.query.message })
    } else {
        res.status(404).json({
            error: 'Invalid status code ' + req.params.id
        })
    }
})

module.exports = routes