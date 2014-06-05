module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
  })

  return Teacher;
}