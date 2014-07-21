var db = require('../models')

db.Semester.destroy().success(function() {

	db.Course.destroy().success(function() {

		db.Semester.create({
			semester: 1,
			year: 2014
		}).success(function(semester) {

			db.Course.create({
				SemesterId: semester.id,
				code: 'EPERS',
				enrolled: 25,
				color: 'red'
			}).success(function(course) {
			 
			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Teorica/Practica',
					commission: 1,
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
				SemesterId: semester.id,
				code: 'INTRO',
				enrolled: 30,
				color: 'pink'
			}).success(function(course) {

			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Teorica',
					commission: 3,
					day: 1,
					hour: 9,
					minutes: 0,
					duration: 3
				})

				db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Practica',
					commission: 1,
					day: 3,
					hour: 9,
					minutes: 0,
					duration: 3
				})

			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Practica',
					commission: 2,
					day: -1,
					hour: -1,
					minutes: 0,
					duration: 3
				})
		  })

			db.Course.create({
				SemesterId: semester.id,
				code: 'ORGA',
				enrolled: 45,
				color: 'green'
			}).success(function(course) {
			 
			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Teorica',
					commission: 1,
					day: 5,
					hour: 14,
					minutes: 0,
					duration: 4
				})
		  })

			db.Course.create({
				SemesterId: semester.id,
				code: 'SEGI',
				enrolled: 20,
				color: 'yellow'
			}).success(function(course) {
			 
			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Teorica/Practica',
					commission: 1,
					day: -1,
					hour: -1,
					minutes: 0,
					duration: 4
				})
		  })
	  
	  });

	});

});
