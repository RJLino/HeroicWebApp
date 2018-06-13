'use strict'

const req = require('request')
const http = require('http')
const Error = require('./model/Error')

const FESTIVAL_DB = 'http://127.0.0.1:5984/'
const database = 'festival/'

module.exports = {
    'find': find,
    'authenticate': authenticate,
    //'registerUser': registerUser
};

function find(username, cb) {
    const path = FESTIVAL_DB + database + username
    req(path, (err, resp, body) => {
        if(err) return cb(err)
        if(resp.statusCode != 200) return cb(err, null)
        cb(null, JSON.parse(body))
    })
}

/**
 * @param String username 
 * @param String passwd 
 * @param Function cb callback (err, user, info) => void. If user exists
 * but credentials fail then calls cb with undefined user and an info message.
 */
function authenticate(username, passwd, cb) {
    find(username, (err, user) => {
        if(err) return cb(err)
        if(!user) return cb(null, null, 'User does not exist')
        if(passwd != user.password) return cb(null, null, 'Invalid password')
        cb(null, user)
    })
}