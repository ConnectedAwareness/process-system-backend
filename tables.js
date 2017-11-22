const bookshelf = require('./bookshelf')

// TABLES
const User = module.exports.User = bookshelf.Model.extend({
    tableName: 'user'
});