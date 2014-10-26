
module.exports = function(sequelize, DataTypes) {

  var Semester = sequelize.define('Semester', {
    	semester: {type:DataTypes.INTEGER ,  validate: {isIn: {
																  args: [[1, 2]],
																  msg: "Solo puede haber semestres 1 y 2"
															}}},
    	year: {type:DataTypes.INTEGER ,  validate: {min:1985}}
  }, {

    classMethods: {
      associate: function(models) {
        Semester.hasMany(models.Course, {as: 'Courses'});
        Semester.hasMany(models.SemesterClassRoom, {as: 'SemesterClassRooms'});
        Semester.hasMany(models.SemesterTeacher, {as: 'SemesterTeachers'});
      },

      getSemester: function(year, semester) {
        return Semester.find({where: {'year': year, 'semester': semester}});
      },

      findByYearAndSemesterIncludingAll: function(year, semester) {
        return Semester.find({where: {'year': year, 'semester': semester},
          include: [{model: Semester.models.Course, as: 'Courses', require: false,
            include: [ {model: Semester.models.CourseSchedule, as: 'schedules', require: false,
              include: [
                {model: Semester.models.Course, as: 'Courses', require: false},
                {model: Semester.models.SemesterClassRoom, as: 'SemesterClassRoom', require: false,
                  include: [{model: Semester.models.ClassRoom, as: 'ClassRoom', require: false}]},
                {model: Semester.models.SemesterTeacher, as: 'SemesterTeachers', require: false,
                  include: [{model: Semester.models.Teacher, as: 'Teacher', require: false}]},
                {model: Semester.models.PatchSchedule, as: 'Patch', require: false,
                  include: [{model: Semester.models.Teacher, as: 'noVisibleTeachers', require: false}]}
              ]},
            
              {model: Semester.models.Subject, as: 'Subject', require: false},
              {model: Semester.models.SemesterTeacher, as: 'SemesterTeachers', require: false,
                include: [{model: Semester.models.Teacher, as: 'Teacher', require: false}]},
              {model: Semester.models.SemesterTeacher, as: 'SemesterInstructors', require: false,
                include: [{model: Semester.models.Teacher, as: 'Teacher', require: false}]}
            ]
          }]
        })
      },

		teacherAssignedToASchedule:function(idTeacher,idCourseSchedule,semester,year,success){
			var CourseSchedule=Semester.models.CourseSchedule;
			Semester.getSemester(year,semester).success(function(semester){
				CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
					//asignando el teacher al horario
					courseSchedule.assignedTeacher(idTeacher,semester,success);
				});
			});
		},
		teacherAssignedToACourse:function(idTeacher,idCourse,semester,year,success){
			var Course=Semester.models.Course;
			Semester.getSemester(year,semester).success(function(semester){
				Course.find(idCourse).success(function(course) {
					//asignando el teacher al curso
					course.assignedTeacher(idTeacher,semester,success);
				});
			});
		},
		instructorAssignedToACourse:function(idTeacher,idCourse,semester,year,success){
			var Course=Semester.models.Course;
			Semester.getSemester(year,semester).success(function(semester){
				Course.find(idCourse).success(function(course) {
					//asignando el teacher al curso
					course.assignedInstructor(idTeacher,semester,success);
				});
			});
		},

      cloneFromTo: function(idSemesterFrom, semesterTo) {
        return Semester.find(idSemesterFrom).success(function(semesterFrom) {
          Semester.findByYearAndSemesterIncludingAll(semesterFrom.year, semesterFrom.semester).success(function(completeSemesterFrom) {

            completeSemesterFrom.courses.forEach(function(course) {
              course.cloneToSemester(semesterTo);
            })
            
          })
        }) 
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
