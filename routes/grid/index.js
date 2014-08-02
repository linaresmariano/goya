var db = require('../../models')

/*
 * GET grilla.
 */

exports.index = function(req, res) {

  db.Course.findAll({include: [ {model: db.CourseSchedule, as: 'Schedules'} ]}).success(function(courses) {
    res.render('grid/index', {
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
						include: [ 	{model: db.CourseSchedule, as: 'Schedules',require:false,
										include: [ 	{model: db.ClassRoom, as: 'ClassRoom',require:false}]},
									{model: db.Subject, as: 'Subject',require:false},
									{model: db.Teacher, as: 'CourseInstructor',require:false},
									{model: db.Teacher, as: 'CourseTeacher',require:false}]
						},
				{	model: db.Teacher, as: 'Teachers' ,require:false},
				{	model: db.ClassRoom, as: 'ClassRooms' ,require:false }]
  })
    .success(function(semester) {
			console.log(semester.courses[0]);
			res.render('grid/index', {
				title: 'Grilla',
				semester: semester 
			  })
		
  })

}

