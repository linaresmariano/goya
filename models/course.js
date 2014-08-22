
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    area: DataTypes.STRING,
    core: DataTypes.STRING,
    period: DataTypes.STRING,
    modality: DataTypes.STRING,
    code: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    enrolled: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    commission: DataTypes.INTEGER,
    color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
			Course.hasMany(models.CourseSchedule, { as: 'Schedules'});
			Course.hasMany(models.Teacher,{ as: 'CourseTeacher',through:'course_has_teachers'});
			Course.hasMany(models.Teacher,{ as: 'CourseInstructor', through: 'course_has_instructors'});
			Course.hasOne(models.CourseRequirements, { as: 'Requirements'});
			Course.belongsTo(models.Subject, { as: 'Subject'});
        }
      }
    }
  )

  return Course
}
