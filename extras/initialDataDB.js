var db = require('../models')

//Semesters
var semester = db.Semester.build({
									semester: 1,
									year: 2014
								});
								
var semester1 = db.Semester.build({
									semester: 2,
									year: 2013
								});
								
var semester2 = db.Semester.build({
									semester: 1,
									year: 2013
								});
								
var semester3 = db.Semester.build({
									semester: 2,
									year: 2012
								});
//Courses							
var courseEPERS = db.Course.build({
									area: 'Programación',
									core: 'Avanzado Obligatorio',
									period: 'Cuatrimestral',
									modality: 'Presencial',
									code: '01044',
									credits: 12,
									commission: 1,
									enrolled: 25,
									capacity: 25,
									color: 'red'
								});
								
var courseORGA = db.Course.build({
									area: 'Sistemas Informáticos',
									core: 'Básico Obligatorio',
									period: 'Cuatrimestral',
									modality: 'Presencial con campus virtual**',
									code: '01032',
									credits: 12,
									enrolled: 30,
									capacity: 35,
									commission: 1,
									color: 'green'
								});
						
//Schedules								
var courseSchedule1 = db.CourseSchedule.build({
									type: 'Teorica/Practica',
									day: 5,
									hour: 9,
									minutes: 0,
									duration: 6
								});
								
var courseSchedule2 = db.CourseSchedule.build({
									type: 'Teorica',
									day: -1,
									hour: -1,
									minutes: 0,
									duration: 3
								});
								
var courseSchedule3 = db.CourseSchedule.build({
									type: 'Practica',
									day: -1,
									hour: -1,
									minutes: 0,
									duration: 3
								});
								
var courseSchedule4 = db.CourseSchedule.build({
									type: 'Teorica/Practica',
									day: -1,
									hour: -1,
									minutes: 0,
									duration: 3
								});

//Teachers								
var teacherPABLOT= db.Teacher.build({
						code: 'PABLOT',
						name: 'Pablo Tesone'
					});
					
var teacherRONY= db.Teacher.build({
						code: 'RONY',
						name: 'Rony De Jesus'
					});
					
//ClassRooms

var classRoom37B= db.ClassRoom.build({
						name: "Fidel",
						number: "37b",
						description: "Un aula con pcs",
						capacity: 30,
						numberOfComputers: 30,
						hasProyector: true
					});
					
var classRoom60= db.ClassRoom.build({
						name: "Mariano",
						number: "60",
						description: "Un aula con pcs nueva",
						capacity: 30,
						numberOfComputers: 30,
						hasProyector: true
					});
					
var classRoomcyt= db.ClassRoom.build({
						name: "cyt",
						number: "1",
						description: "Un aula con pcs nueva",
						capacity: 30,
						numberOfComputers: 30,
						hasProyector: true
					});
					
var classRoom45= db.ClassRoom.build({
						name: "45",
						number: "45",
						description: "Un aula sin pcs nueva",
						capacity: 30,
						numberOfComputers: 0,
						hasProyector: true
					});
//Subject

var subjectEPERS= db.Subject.build({
						code: 'EPERS',
						name: 'Estrategias de persistencia'
					});
					
var subjectORGA= db.Subject.build({
						code: 'ORGA',
						name: 'Organizacion de las computadoras'
					});

//Save models
chainer = new db.Sequelize.Utils.QueryChainer

//save courses
chainer.add(courseORGA.save());
chainer.add(courseEPERS.save());

//save models
chainer.add(semester.save());
chainer.add(semester1.save());
chainer.add(semester2.save());
chainer.add(semester3.save());

//save teachers
chainer.add(teacherPABLOT.save());
chainer.add(teacherRONY.save());

//save schedules
chainer.add(courseSchedule1.save());
chainer.add(courseSchedule2.save());
chainer.add(courseSchedule3.save());
chainer.add(courseSchedule4.save());

//save class rooms
chainer.add(classRoom37B.save());
chainer.add(classRoom60.save());
chainer.add(classRoomcyt.save());
chainer.add(classRoom45.save());

//save subjects
chainer.add(subjectEPERS.save());
chainer.add(subjectORGA.save());

//save relations
chainer.run().complete( function(err, result) {
        semester.setCourses([courseEPERS]);
		semester.setCourses([courseORGA]);
		
		courseEPERS.setSubject(subjectEPERS);
		courseORGA.setSubject(subjectORGA);
		
		semester.setTeachers([teacherPABLOT,teacherRONY]);
		
		semester.setClassRooms([classRoom37B,classRoom60,classRoomcyt,classRoom45]);
		
		courseEPERS.setCourseTeacher([teacherPABLOT]);
		courseEPERS.setCourseInstructor([teacherRONY]);
		
		courseEPERS.setSchedules([courseSchedule1]);
		courseORGA.setSchedules([courseSchedule2,courseSchedule3,courseSchedule4]);
		
		courseSchedule1.setTeachers([teacherRONY,teacherPABLOT]);
		
		courseSchedule1.setClassRoom(classRoom37B);
});


/*
db.Semester.destroy().success(function() {

	db.Course.destroy().success(function() {

		db.Semester.create({
			semester: 1,
			year: 2014
		}).success(function(semester) {

			db.Course.create({
				SemesterId: semester.id,
				commission: 1,
				code: 'EPERS',
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
				SemesterId: semester.id,
				code: 'INTRO',
				enrolled: 30,
				commission: 1,
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
				SemesterId: semester.id,
				code: 'ORGA',
				enrolled: 45,
				commission: 1,
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
				SemesterId: semester.id,
				code: 'SEGI',
				enrolled: 20,
				commission: 1,
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
		  
			db.Course.create({
				SemesterId: semester.id,
				commission: 1,
				code: 'TVDIG',
				enrolled: 25,
				color: 'blue'
			}).success(function(course) {
			 
			  db.CourseSchedule.create({
				CourseId: course.id,
				type: 'Teorica/Practica',
					day: 5,
					hour: 18,
					minutes: 0,
					duration: 4
				})
		  })
	  
	  });

	});

});
*/