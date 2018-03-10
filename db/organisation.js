/**
 * This module defines the relations of the DB
 */

const bookshelf = require('./bookshelf')
const User = require('./user').User

const generateObject = (datanames, data) => {
    const obj = {}
    datanames.forEach(name => {
        if (data[name]) obj[name] = data[name]
    })
    return obj
}

const Organisation = bookshelf.Model.extend({
    tableName: 'organisation',
    users: function(){
        return this.hasMany(User);
    }
},{
    getUsers: function(id){//TODO:
        return Organisation.where('id', 1).fetch({withRelated: ['users']})
    }
})

module.exports.Organisation = Organisation