const mongoose = require('mongoose')

module.exports = (() => {
    mongoose.connect('mongodb://localhost/conawa')

    let db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', console.log.bind(console, 'connected with database!'))
})()