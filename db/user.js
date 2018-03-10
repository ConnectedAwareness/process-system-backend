
const bookshelf = require('./bookshelf')
const publicInformations = ["id", "email", "name", "forename", "surname", "role"]

const generateObject = (datanames, data) => {
    const obj = {}
    datanames.forEach(name => {
        if (data[name]) obj[name] = data[name]
    })
    return obj
}

bookshelf.knex.schema.createTable('user', (table) => {  
    table.increments()
    table.string('email')
    table.string('password')
    table.string('name')
    table.string('forename')
    table.string('surname')
    table.string('token')
    table.bigInteger('token_date')
    table.string('role').defaultTo('admin')
})

const User = bookshelf.Model.extend({
    tableName: 'user'
    // ,
    // organisation: function(){
    //     return this.belongsTo('organisationModel');
    // }
}, {
    byEmail: function(email) {
        return this.forge().query({where:{ email: email }}).fetch();
    },
    byId: function(id) {
        return User.forge().query({where:{ id: id }}).fetch({ columns: publicInformations })
    },
    save: function(data){
        return User.forge(generateObject(['email', 'password', 'name', 'forename', 'surname', 'role'], data)).save()
    },
    getAll: function(limit, offset) {
        return User.query((qb) => {
            qb.limit(limit).offset(offset)
        }).fetchAll({ columns: publicInformations })
    }
})
module.exports.User = User