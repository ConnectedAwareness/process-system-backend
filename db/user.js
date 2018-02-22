const mysql = require('mysql')
const crypto = require('crypto')
const conUri = { host: "localhost", user: "root", password: "", database: "awarenessplatform" }
const con = mysql.createConnection(conUri)
con.connect((err) => {
    if (err) throw err
})

const connection = {}

/**
 * generates a random String with the length of 10 to 12 and chars from 0 to z
 */
const generateRandomString = () => {
    return Math.random().toString(36).substring(2)
}

/**
 * the secret for encrypting the token informations
 */
const secret = generateRandomString()

/**
 * generates a unique token for a user
 * @param {*the id of the user}id 
 */
const generateTokenFromId = (id) => {
    return crypto.createHmac('sha256', secret)
        .update(generateRandomString() + '_' + id)
        .digest('hex');
}

const updateToken = (user, done) => {
    const token = generateTokenFromId(user.id)
    const sql = "UPDATE user SET token = '" + token + "' WHERE id = " + user.id
    con.query(sql, function(err, result) {
        if (err) throw err
        user.token = token
        return done(null, user)
    });
}

/**
 * checks if login is correct
 * if true
 * then update Token and return done
 * @param {*} email 
 * @param {*} password 
 * @param {*the done function of passport} done 
 */
connection.loginExists = (email, password, done) => {
    con.query("SELECT * FROM user WHERE email = '" + email + "' AND password = '" + password + "' ", function(err, result, fields) {
        if (err) throw err;
        if (result.length == 1) {
            return updateToken(result[0], done)
        }
        return done(null, false)
    });
}

/**
 * checks if token is correct
 * if true return user
 * @param {*} token 
 * @param {*} done 
 */
connection.tokenExists = (token, done) => {
    let sql = "SELECT * FROM `user` WHERE `token` = '" + token + "'"
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        if (result.length == 1) {
            return done(null, result[0])
        }
        return done(null, false)
    });
}

connection.findById = (id, done) => {
    let sql = "SELECT * FROM `user` WHERE `id` = '" + id + "'"
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 1) {
            return done(null, result[0])
        }
        if (result.length == 0) return done(new Error('User ' + id + ' does not exist'))
        return done(new Error('More than one User with the same id'))
    });
    if (users[idx - 1]) {
        fn(null, users[idx - 1])
    } else {
        fn(new Error('User ' + id + ' does not exist'))
    }
}

module.exports = connection