module.exports = function(sequelize, DataTypes) {

  return sequelize.define('CourseRequirements', {
    numberOfComputers: DataTypes.INTEGER,
    proyector: DataTypes.BOOLEAN
  }, {})

}