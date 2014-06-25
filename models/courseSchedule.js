module.exports = function(sequelize, DataTypes) {

  return sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
  	day: DataTypes.INTEGER,
  	hour: DataTypes.INTEGER,
  	minutes: DataTypes.INTEGER,
  	duration: DataTypes.INTEGER
  })

}