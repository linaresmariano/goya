
module.exports = function(sequelize, DataTypes) {

  var Subject = sequelize.define('Subject', {
    code: DataTypes.STRING,	
    name: DataTypes.STRING,
    }
  )

  return Subject
}
