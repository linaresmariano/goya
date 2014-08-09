var db = require('../tests')

//Semesters
var semester = db.Semester.build({
									semester: 1,
									year: 2014
								});
								
var semester1 = db.Semester.build({
									semester: 2,
									year: 2013
								});
//Courses							
var courseEPERS = db.Course.build({
									commission: 1,
									enrolled: 25,
									color: 'red'
								});
								
var courseORGA = db.Course.build({
									enrolled: 45,
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


//save subjects
chainer.add(subjectEPERS.save());
chainer.add(subjectORGA.save());

//save relations

module.exports=function(callBakcFuncSucces){
	chainer.run().complete( function(err, result) {
			semester.setCourses([courseEPERS]);
			semester.setCourses([courseORGA]);
			
			courseEPERS.setSubject(subjectEPERS);
			courseORGA.setSubject(subjectORGA);
			
			semester.setTeachers([teacherPABLOT,teacherRONY]);
			
			semester.setClassRooms([classRoom37B]);
			
			courseEPERS.setCourseTeacher([teacherPABLOT]);
			courseEPERS.setCourseInstructor([teacherRONY]);
			
			courseEPERS.setSchedules([courseSchedule1]);
			courseORGA.setSchedules([courseSchedule2,courseSchedule3,courseSchedule4]);
			
			courseSchedule1.setClassRoom(classRoom37B);
			
			callBakcFuncSucces();
	});
}

