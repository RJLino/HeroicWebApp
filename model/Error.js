'use strict'

module.exports = Error

function Error(status, message){
    this.status = status
    this.message = message
}