
var db = require('./models');

db.sequelize.sync().success(function() {

  // Para cargar datos de pruebas
  require('./extras/initialDataDB');

})