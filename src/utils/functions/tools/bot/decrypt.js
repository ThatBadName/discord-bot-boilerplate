const Cryptr = require('cryptr')
require('dotenv').config()
const cryptr = new Cryptr(process.env.FILE_ENCRYPTION_KEY)

function decrypt(data) {
  return cryptr.decrypt(data)
}

module.exports = decrypt