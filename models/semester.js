
module.exports = function(sequelize, DataTypes) {

  var Semester = sequelize.define('Semester', {
    	semester: DataTypes.INTEGER,
    	year: DataTypes.INTEGER
    }, {
      classMethods: {
        associate: function(models) {
          Semester.hasMany(models.Course,{ as: 'Courses'});
		  Semester.hasMany(models.Teacher,{ as: 'Teachers'});
		  Semester.hasMany(models.ClassRoom,{ as: 'ClassRooms'});
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