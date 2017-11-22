// This File connects bookshelf with the mySQL DB
// If you do not want to see the queries in the console set debug = false

const knex = require('knex')({
    debug: true,
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'test',
        password: '1234',
        database: 'awarenessplatform',
        charset: 'utf8'
    }
});

module.exports = require('bookshelf')(knex)