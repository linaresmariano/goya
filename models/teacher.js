module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.CourseSchedule, { through:'schedule_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_instructors'});
		this.hasOne(models.TeacherRequirements, { as: 'Requirements'});
      }
    }
  })

  return Teacher;
}