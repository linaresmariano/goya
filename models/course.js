
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    area: DataTypes.STRING,
    core: DataTypes.STRING,
    period: DataTypes.STRING,
    modality: DataTypes.STRING,
    code: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    enrolled: DataTypes.INTEGER,
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
    commission: {type:DataTypes.INTEGER ,  validate: {min:0}},
    color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
			Course.hasMany(models.CourseSchedule, { as: 'Schedules'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterTeachers',through:'course_has_teachers'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterInstructors', through: 'course_has_instructors'});
			Course.hasOne(models.CourseRequirements, { as: 'Requirements'});
			Course.belongsTo(models.Subject, { as: 'Subject'});
        }
      }
    }
  )

  return Course
}
