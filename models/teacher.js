module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Teacher.hasMany(models.Course,{ as: 'CourseTeacher'});
		Teacher.hasMany(models.Course,{ as: 'CourseInstructor'});
      }
    }
  })

  return Teacher;
}