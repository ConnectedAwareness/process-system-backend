/**
 * This module defines the relations of the DB
 */

const bookshelf = require('./bookshelf')

module.exports.userModel = bookshelf.Model.extend({
    tableName: 'user'
})

module.exports.organisationModel = bookshelf.Model.extend({
    tableName: 'organisation'
})