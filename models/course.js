
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
			Course.hasMany(models.CourseSchedule, { as: 'Schedules', foreignKey : 'ScheduleId'});
			Course.hasMany(models.Teacher,{ as: 'CourseTeacher', foreignKey: 'CourseTeacherId'});
			Course.hasMany(models.Teacher,{ as: 'CourseInstructor', foreignKey: 'CourseInstructorId'});
			Course.hasOne(models.CourseRequirements, { as: 'Requirements'});
        }
      }
    }
  )

  return Course
}
