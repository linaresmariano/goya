
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
      code: DataTypes.STRING,
    	commission: DataTypes.INTEGER,
    	semester: DataTypes.INTEGER,
    	enrolled: DataTypes.INTEGER,
      color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Course.hasMany(models.CourseSchedule,{ as: 'Schedules'})
        }
      }
    }
  )

  return Course;
}