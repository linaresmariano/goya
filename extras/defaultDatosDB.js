var db = require('../models')


db.Course.destroy().success(function() {

	db.Course.create({
		code: 'EPERS',
		commission: 1,
		semester: 12014,
		enrolled: 25
	}).success(function(course) {
	 
	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Teorica/Practica',
			day: 1,
			hour: 16,
			minutes: 0,
			duration: 6
		})
  })

	db.Course.create({
		code: 'INTRO',
		commission: 2,
		semester: 12014,
		enrolled: 30
	})

	db.Course.create({
		code: 'ORGA',
		commission: 4,
		semester: 12014,
		enrolled: 45
	})

	db.Course.create({
		code: 'SEGI',
		commission: 1,
		semester: 12014,
		enrolled: 20
	})

})
