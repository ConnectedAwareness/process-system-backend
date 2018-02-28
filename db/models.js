/**
 * This module defines the relations of the DB
 */

const bookshelf = require('./bookshelf')

module.exports.userModel = bookshelf.Model.extend({
    tableName: 'user'
});