
module.exports = function(sequelize, DataTypes) {

  var Semester = sequelize.define('Semester', {
    	semester: {type:DataTypes.INTEGER ,  validate: {isIn: {
																  args: [[1, 2]],
																  msg: "Solo puede haber semestres 1 y 2"
															}}},
    	year: {type:DataTypes.INTEGER ,  validate: {min:1900}}
    }, {
      classMethods: {
        associate: function(models) {
          Semester.hasMany(models.Course,{ as: 'Courses'});
		  Semester.hasMany(models.SemesterClassRoom,{ as: 'SemesterClassRooms'});
		  Semester.hasMany(models.SemesterTeacher,{ as: 'SemesterTeachers'});
        }
      }
    }, {
      instanceMethods: {
        code: function() {
          return parseInt(semester +""+ year);
        }
      }
    }
  )

  return Semester;
}

