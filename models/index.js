var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  sequelize = null,
  db = {}

if (process.env.HEROKU_POSTGRESQL_ROSE_URL) {
  // the application is executed on Heroku ... use the postgres database
  var match = process.env.HEROKU_POSTGRESQL_ROSE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

  sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true //false
  })
} else {
  // the application is executed on the local machine ... use mysql
  sequelize = new Sequelize('goya', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASS || 'root')
}

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
  db[modelName]['models'] = db;
})


module.exports = Sequelize.Utils._.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)