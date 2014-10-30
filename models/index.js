var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , sequelize = new Sequelize('goya', 'root', 'root')
  , db        = {}
 
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
//creando relaciones
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
  db[modelName]['models']=db;
})


module.exports = Sequelize.Utils._.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
