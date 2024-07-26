const Cryptr = require('cryptr')
require('dotenv').config()
const cryptr = new Cryptr(process.env.FILE_ENCRYPTION_KEY)

function encrypt(data) {
  return cryptr.encrypt(data)
}

module.exports = encrypt