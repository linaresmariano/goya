module.exports = function(sequelize, DataTypes) {

  var SemesterTeacher = sequelize.define('SemesterTeacher', {
  
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.CourseSchedule, { through:'schedule_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_instructors'});
		this.hasOne(models.TeacherRequirements, { as: 'Requirements'});
		this.belongsTo(models.Teacher, { as: 'Teacher'});
		this.hasOne(models.Semester,{ as: 'Semester'});
      }
    }
  })

  return SemesterTeacher;
}