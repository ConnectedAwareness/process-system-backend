/**
 * This module contains the bookshelf definition with DB settings
 * TODO: put on gitignore ???
 */

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : '127.0.0.1',
      user     : 'root',
      password : '',
      database : 'awarenessplatform',
      charset  : 'utf8'
    }
  });

  module.exports = require('bookshelf')(knex);