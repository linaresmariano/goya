
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    code: DataTypes.STRING,	
    enrolled: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
	commission: DataTypes.INTEGER,
    color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
			Course.hasMany(models.CourseSchedule, { as: 'Schedules'});
			Course.hasMany(models.Teacher,{ as: 'CourseTeacher'});
			Course.hasMany(models.Teacher,{ as: 'CourseInstructor'});
			Course.hasMany(models.Course, { as: 'Courses'});
        }
      }
    }
  )

  return Course
}
