var datos = require('../../extras/datos'),
    db = require('../../models')

	

exports.new = function(req, res) {
	db.Subject.findAll().success(function(subjects) {
		res.render('course/new', {
		  title: 'Crear Curso',
		  subjects: subjects
		})
	})
}


exports.create = function(req, res) {
	//Para probar
	var idSubject = req.body.idSubject;
	console.log(req.body);
	
	var year = req.body.year;
	var semester = req.body.semester;
	
	//Si solo hay un horario
	if(typeof req.body.day === "string"){
	
		db.Semester.find({
			where:{ 'year': year,'semester':semester}
		}).success(function(semester1) {
			var schedule = db.CourseSchedule.build({
										type: 'Teorica/Practica',
										day: req.body.day ,
										hour: req.body.hour ,
										minutes: 0,
										duration: req.body.duration 
									});
									console.log('Es unico horario');
									db.Course.create({
										SubjectId: idSubject,
										SemesterId: semester1.id,
										enrolled: 45,
										commission: 1,
										color: 'blue' // color default
									}).success(function(course) {
											course.addSchedule(schedule);
											showFeedbackPanel(res,'Courso creado correctamente',typeMessage.SUCCESS);
											exports.new(req, res);	
									});
		});
	//si hay varios horarios y sin horario
	}else{
	
	
		db.Semester.find({
			where:{ 'year': year,'semester':semester}
		}).success(function(semester) {
			db.Course.create({
										SubjectId: idSubject,
										enrolled: 45,
										commission: 1,
										color: 'blue' // color default
			}).success(function(course) {
					semester.addCourse(course);
					//Si no hay horarios para el curso
					if(req.body.day != undefined){
						for(i=0;i < req.body.day.length;i++){
							var schedule = db.CourseSchedule.build({
													type: 'Teorica/Practica',
													day: req.body.day[i] ,
													hour: req.body.hour[i] ,
													minutes: 0,
													duration: req.body.duration[i] 
												});
							course.addSchedule(schedule);
											
						}
					}
					showFeedbackPanel(res,'Courso creado correctamente',typeMessage.SUCCESS);
					exports.new(req, res);	
			});
		});
	}
	
								
}

/*
 * GET cursos.
 */

exports.index = function(req, res){

  db.Course.findAll().success(function(courses) {
    res.render('course/index', {
      title: 'Cursos',
      datos: datos,
      cursos: courses
    })
  })

};

exports.deallocateTeacher = function(req, res){
	var idCourse = req.body.idCourse;
	var idTeacher= req.body.idTeacher;
	
	 db.Course.deallocateTeacher(idCourse,idTeacher,function() {				
		res.send('ok')
	  });
};

exports.deallocateInstructor = function(req, res){
	var idCourse = req.body.idCourse;
	var idTeacher= req.body.idTeacher;
	
	db.Course.deallocateInstructor(idCourse,idTeacher,function() {				
		res.send('ok')
	 });
};

exports.list = function(req, res){

	
	var year = req.params.year;
	var semester = req.params.semester;
	
	db.Semester.find({
		include: [ {model: db.Course, as: 'Courses' ,require:false,
					include:{model: db.Subject, as: 'Subject',require:false}}],
		where:{ 'year': year,'semester':semester}
	}).success(function(semester) {
	
		res.render('course/list', {
          title: 'Cursos',
          courses:semester.courses
		});
	});
};




exports.update = function(req, res) {
  db.CourseSchedule.find(req.body.id).success(function(schedule) {

    schedule.updateAttributes({
      day: req.body.day,
      hour: req.body.hour
    }, ['day', 'hour'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

}

exports.updateEnd = function(req, res) {
  //Actualiza el horario con el id correspondiente
  console.log(req.body.duration+"********************************");
  db.CourseSchedule.find(req.body.id).success(function(schedule) {
    schedule.updateAttributes({
      duration: req.body.duration
    }, ['duration'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

}


exports.assignedClassRoom = function(req, res) {

 	
	var idClassRoom = req.body.idClassRoom;
    var idCourseSchedule = req.body.idCourseSchedule;
	var year = req.body.year;
    var semester = req.body.semester;
  db.CourseSchedule.find(idCourseSchedule).success(function(schedule) {

		db.SemesterClassRoom.find({
			where: {'ClassRoom.id':idClassRoom,'Semester.year':year,'Semester.semester':semester},
			include: [ {	model: db.ClassRoom, as: 'ClassRoom' ,require:false },
					{	model: db.Semester, as: 'Semester' ,require:false }]
			}
		).success(function(semesterClassRoom) {
		
			if(semesterClassRoom == undefined){
				
				db.ClassRoom.find(idClassRoom).success(function(classroom) {
					var newSemesterClassRoom= db.SemesterClassRoom.create({
						name: classroom.name,
						number: classroom.number,
						description: classroom.description,
						capacity: classroom.capacity,
						numberOfComputers: classroom.numberOfComputers,
						hasProyector: classroom.hasProyector
					}).success(function(newSemesterClassRoom) {
										newSemesterClassRoom.setClassRoom(classroom);
										schedule.setSemesterClassRoom(newSemesterClassRoom);	
										db.Semester.find({where: {'year':year,'semester':semester}}).success(function(semester) {
											console.log(year+"    "+semester);
											semester.addSemesterClassRoom(newSemesterClassRoom);
											res.send('ok')
										});
																				
								});
				
				})
				console.log('la clase es nula');
			}else{
				console.log('la clase no es nula');
				schedule.setSemesterClassRoom(semesterClassRoom);
				res.send('ok');
			}
			
			
		})
  

  })
}


exports.assignedTeacher = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
 	var year = req.body.year;
    var semester = req.body.semester;
  	//Asigna un teacher a un curso
	db.Semester.teacherAssignedToACourse(idTeacher,idCourse,semester,year,function(result) {
			res.send('ok');	
	});
}

exports.assignedInstructor = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
	var year = req.body.year;
    var semester = req.body.semester;
	 //Asigna un instructor a un curso
	db.Semester.instructorAssignedToACourse(idTeacher,idCourse,semester,year,function(result) {
			res.send('ok');	
	});
}



