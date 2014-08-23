
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
        },
	  getSemester:function(year,semester){
		return Semester.find({where: {'year':year,'semester':semester}});
	  },
		teacherAssignedToASchedule:function(idTeacher,idCourseSchedule,semester,year,success){
			var CourseSchedule=Semester.models.CourseSchedule;
			Semester.getSemester(year,semester).success(function(semester){
				CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
					courseSchedule.assignedTeacher(idTeacher,semester,success);
				});
			});
		}
	  }
	}, {
      instanceMethods: {
        code: function() {
			return parseInt(semester +""+ year);
			}
		}
    })

  return Semester;
}

