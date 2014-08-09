//Base de datos sqlite para correr los test

var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , sequelize = new Sequelize('goya', 'root', 'root',{
		dialect: 'sqlite',
 
		// the storage engine for sqlite
		// - default ':memory:'
		storage: './tests/database.sqlite'
  })
  , db        = {}
 
fs
  .readdirSync(__dirname+'/../models')
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname+'/../models', file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})
 
module.exports = Sequelize.Utils._.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)


