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
			include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}],
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
	//si hay varios horarios
	}else if(req.body.day != undefined){
	
	
		db.Semester.find({
			include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}],
			where:{ 'year': year,'semester':semester}
		}).success(function(semester) {
			db.Course.create({
										SubjectId: idSubject,
										enrolled: 45,
										commission: 1,
										color: 'blue' // color default
			}).success(function(course) {
					semester.addCourse(course);
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
  db.CourseSchedule.find(idCourseSchedule).success(function(schedule) {

		db.ClassRoom.find(idClassRoom).success(function(classRoom) {
			schedule.setClassRoom(classRoom);
			res.send('ok')
		})
  })
}


exports.assignedTeacher = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
  db.Course.find(idCourse).success(function(course) {

		db.Teacher.find(idTeacher).success(function(teacher) {
			course.addCourseTeacher(teacher);
			res.send('ok')
		})
  })
}

exports.assignedInstructor = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
  db.Course.find(idCourse).success(function(course) {

		db.Teacher.find(idTeacher).success(function(teacher) {
			course.addCourseInstructor(teacher);
			res.send('ok')
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

