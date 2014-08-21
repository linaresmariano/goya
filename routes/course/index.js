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
	
	 db.Course.find({
		where:{id:idCourse},
		include: [ {model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
												include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]}]
	}).success(function(course) {				
		for(n=0;n < course.semesterTeachers.length;n++){
			console.log(course.semesterTeachers[n]);	
			if(course.semesterTeachers[n].teacher.id == idTeacher){
				course.removeSemesterTeacher(course.semesterTeachers[n]);
				break;
			}
		}
		res.send('ok')
	  })
};

exports.deallocateInstructor = function(req, res){
	var idCourse = req.body.idCourse;
	var idTeacher= req.body.idTeacher;
	
	db.Course.find({
		where:{id:idCourse},
		include: [ {model: db.SemesterTeacher, as: 'SemesterInstructors',require:false,
												include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]}]
	}).success(function(course) {				
		for(n=0;n < course.semesterInstructors.length;n++){	
			if(course.semesterInstructors[n].teacher.id == idTeacher){
				course.removeSemesterInstructor(course.semesterInstructors[n]);
				break;
			}
		}
		res.send('ok')
	  })
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


/*
 * GET cursos/:code_curso/:comision.
 */

exports.commission = function(req, res) {

  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  code = req.params.id
  commission = req.params.commission
  curso = ''

  db.Course.findAll({include: [
    {model: db.CourseSchedule, as: 'Schedules'},
    {model: db.Teacher, as: 'Teachers'}
  ]}).success(function(courses) {
    courses.forEach(function(entry) {
      if(entry.code == code && entry.commission == commission) {

        res.render('cursos/curso', {
          title: 'Curso '+ code,
          curso: entry,
          datos: datos,
          weekday: weekday
        });
      }
    });
  })
};



exports.actualizar = function(req, res) {

  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      day: req.param('day'),
      hour: req.param('hour')
    }, ['day', 'hour'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

}

exports.actualizarFin = function(req, res) {
  //Actualiza el horario con el id correspondiente
  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      duration: req.param('duration')
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
  db.Course.find(idCourse).success(function(course) {

		db.SemesterTeacher.find({
			where: {'Teacher.id':idTeacher,'Semester.year':year,'Semester.semester':semester},
			include: [ {	model: db.Teacher, as: 'Teacher' ,require:false },
					{	model: db.Semester, as: 'Semester' ,require:false }]
			}
		).success(function(semesterTeacher) {
		
			if(semesterTeacher == undefined){
				
				db.Teacher.find(idTeacher).success(function(teacher) {
					var newSemesterTeacher= db.SemesterTeacher.create({
					}).success(function(newSemesterTeacher) {
										newSemesterTeacher.setTeacher(teacher);
										course.addSemesterTeacher(newSemesterTeacher);	
										db.Semester.find({where: {'year':year,'semester':semester}}).success(function(semester) {
											semester.addSemesterTeacher(newSemesterTeacher);
											res.send('ok')
										});
																				
								});
				
				})
				console.log('el profesor es nulo');
			}else{
				console.log('el profesor no es nulo');
				course.addSemesterTeacher(semesterTeacher);	
				res.send('ok');
			}
			
			
		})
  

  })
}

exports.assignedInstructor = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
	var year = req.body.year;
    var semester = req.body.semester;
  db.Course.find(idCourse).success(function(course) {
		db.SemesterTeacher.find({
			where: {'Teacher.id':idTeacher,'Semester.year':year,'Semester.semester':semester},
			include: [ {	model: db.Teacher, as: 'Teacher' ,require:false },
					{	model: db.Semester, as: 'Semester' ,require:false }]
			}
		).success(function(semesterTeacher) {
			
			if(semesterTeacher == undefined){
				
				db.Teacher.find(idTeacher).success(function(teacher) {
					var newSemesterTeacher= db.SemesterTeacher.create({
					}).success(function(newSemesterTeacher) {
										newSemesterTeacher.setTeacher(teacher);
										course.addSemesterInstructor(newSemesterTeacher);	
										db.Semester.find({where: {'year':year,'semester':semester}}).success(function(semester) {
											semester.addSemesterTeacher(newSemesterTeacher);
											res.send('ok')
										});
																				
								});
				
				})
				console.log('el profesor es nulo**********************************************');
			}else{
				console.log('el profesor no es nulo******************************************');
				course.addSemesterInstructor(semesterTeacher);	
				res.send('ok');
			}
			
			
		})
  

  })
}



exports.update_profe = function(req, res) {
  //Actualiza el horario con el id correspondiente
  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      duration: req.param('duration')
    }, ['duration'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

  Curso.findOneAndUpdate(
    {'code': req.param('code'), 'comision': req.param('comision')},
    {'horarios.$.duracion':req.param('duracion')},
    function(err,curso) {
      res.send(err ? 'error' : 'ok');
  });
}

