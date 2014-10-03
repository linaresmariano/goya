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
										include: [ 	{model: db.Course, as: 'Courses',require:false}	,
													{model: db.SemesterClassRoom, as: 'SemesterClassRoom',require:false,
														include: [ 	{model: db.ClassRoom, as: 'ClassRoom',require:false}]},
													{model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
														include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]},
													{model: db.PatchSchedule, as: 'Patch',require:false,
																		include: [ 	{model: db.Teacher, as: 'noVisibleTeachers',require:false}]}]},
										{model: db.Subject, as: 'Subject',require:false},
										{model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
													include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]},
										{model: db.SemesterTeacher, as: 'SemesterInstructors',require:false,
													include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]}
									]
						}]
  })
    .success(function(semester) {
			
			
			db.ClassRoom.findAll().success(function(classRooms) {
			
				db.Teacher.findAll().success(function(teachers) {

					res.render('grid/index', {
						title: 'Grilla',
						semester: { courses: semester.courses,classRooms:classRooms ,teachers:teachers,
									year:semester.year,semester:semester.semester}
					  })
				});
		
			});
			
  })

}


exports.classrooms = function(req, res) {

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
										include: [ 	{model: db.PatchSchedule, as: 'Patch',require:false},
													{model: db.SemesterClassRoom, as: 'SemesterClassRoom',require:false,
														include: [ 	{model: db.ClassRoom, as: 'ClassRoom',require:false}]}]},
]
						}]
  }).success(function(semester) {
			res.render('grid/classrooms', {
				title: 'Aulas',
				semester: semester 
			  })
		
  })

}

