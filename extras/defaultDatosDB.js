var db = require('../models')


db.Course.destroy().success(function() {

	db.Course.create({
		code: 'EPERS',
		commission: 1,
		semester: 12014,
		enrolled: 25,
		color: 'red'
	}).success(function(course) {
	 
	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Teorica/Practica',
			day: 1,
			hour: 16,
			minutes: 0,
			duration: 6
		})

		db.Teacher.create({
			CourseId: course.id,
			code: 'PABLOT',
			name: 'Pablo Tesone'
		})

		db.Teacher.create({
			CourseId: course.id,
			code: 'RONY',
			name: 'Rony De Jesus'
		})
  })

	db.Course.create({
		code: 'INTRO',
		commission: 2,
		semester: 12014,
		enrolled: 30,
		color: 'pink'
	}).success(function(course) {

	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Teorica',
			day: 1,
			hour: 9,
			minutes: 0,
			duration: 3
		})

		db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Practica',
			day: 3,
			hour: 9,
			minutes: 0,
			duration: 3
		})

	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Practica',
			day: -1,
			hour: -1,
			minutes: 0,
			duration: 3
		})
  })

	db.Course.create({
		code: 'ORGA',
		commission: 4,
		semester: 12014,
		enrolled: 45,
		color: 'green'
	}).success(function(course) {
	 
	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Teorica',
			day: 5,
			hour: 14,
			minutes: 0,
			duration: 4
		})
  })

	db.Course.create({
		code: 'SEGI',
		commission: 1,
		semester: 12014,
		enrolled: 20,
		color: 'yellow'
	}).success(function(course) {
	 
	  db.CourseSchedule.create({
	  	CourseId: course.id,
	  	type: 'Teorica/Practica',
			day: -1,
			hour: -1,
			minutes: 0,
			duration: 4
		})
  })

})
