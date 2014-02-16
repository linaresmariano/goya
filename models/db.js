var mongoose = require('mongoose')
  , db_lnk          = 'mongodb://localhost/prueba'
  , db              = mongoose.createConnection(db_lnk)

  module.exports ={
					'mongoose':mongoose,
					'db': db
				  }