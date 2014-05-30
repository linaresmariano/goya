module.exports = function(sequelize, DataTypes) {

  var CourseSchedule = sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
	day: DataTypes.INTEGER,
	hour: DataTypes.INTEGER,
	minutes: DataTypes.INTEGER,
	duration: DataTypes.INTEGER
  }, {
  })

  return CourseSchedule;
}