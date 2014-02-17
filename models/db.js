var mongoose = require('mongoose'),
  db_lnk = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/prueba',
  db = mongoose.createConnection(db_lnk)

module.exports = {
  'mongoose': mongoose,
  'db': db
}