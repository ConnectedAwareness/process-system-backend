/**
 * This module contains the bookshelf definition with DB settings
 * TODO: put on gitignore ???
 */
// const Schema = require('bookshelf-schema')
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : '127.0.0.1',
      user     : 'root',
      password : '',
      database : 'awarenessplatform',
      charset  : 'utf8'
    },
    pool: {
      min: 0,
      max: 10
    }
  })
  const db = require('bookshelf')(knex)
  db.plugin('registry')
  // db.plugin(Schema({}))

  module.exports = db