
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
      code: DataTypes.STRING,
    	commission: DataTypes.INTEGER,
    	semester: DataTypes.INTEGER,
    	enrolled: DataTypes.INTEGER,
      capacity: DataTypes.INTEGER,
      color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Course.hasMany(models.CourseSchedule, { as: 'Schedules'}),
          Course.hasMany(models.Teacher, { as: 'MainTeacher'}),
          Course.hasMany(models.Teacher, { as: 'Instructor'})
        }
      }
    }
  )

  return Course
}
