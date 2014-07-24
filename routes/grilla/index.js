var db = require('../../models')

/*
 * GET grilla.
 */

exports.index = function(req, res) {

  db.Course.findAll({include: [ {model: db.CourseSchedule, as: 'Schedules'} ]}).success(function(courses) {
    res.render('grilla/index', {
      title: 'Grilla',
      datos: datos,
      cursos: courses
    })
  })

}


/*
 * GET grilla/:semester
 */

exports.semester = function(req, res) {

  var semester = req.params.semester;
  var year = req.params.year;

  // buscar los del "semester"
  db.Semester.find({
     where: {
              'year': semester ,
			  'semester':year
            },
	include: [ {	model: db.Course, as: 'Courses' ,require:false,
						include: [ 	{model: db.CourseSchedule, as: 'Schedules',require:false},
									{model: db.Teacher, as: 'CourseInstructor',require:false},
									{model: db.Teacher, as: 'CourseTeacher',require:false}]
						}]
  })
    .success(function(semester) {
		db.Teacher.findAll({
		}).success(function(teachers) {
			res.render('grilla/index', {
				title: 'Grilla',
				semester: { courses :(semester == null ? [] : semester.courses),
							teachers: teachers} 
			  })
		});
  })

}

