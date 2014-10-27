var db = require('../models')

	

exports.new = function(req, res) {
	db.Subject.findAll().success(function(subjects) {
		res.render('course/new', {
		  title: 'Crear curso',
		  subjects: subjects
		})
	})
}


exports.edit = function(req, res) {

  var id = req.params.id;
  
  db.Course.find({
    where: {'id': id },
    include: [{
      model: db.CourseSchedule, as: 'schedules', require: false
    }]
  }).success(function(course) {

    db.Subject.findAll().success(function(subjects) {
      res.render('course/new', {
        title: 'Editar curso',
        subjects: subjects,
        course: course
      })

    })
  })

}


exports.create = function(req, res) {
  var idSubject = req.body.idSubject
  console.log(req.body)

  var year = req.body.year
  var semester = req.body.semester
  var color = req.body.color || 'blue' // color default

  db.Semester.find({
    where: {'year': year, 'semester': semester}
  }).success(function(semester) {

    db.Course.create({
      SubjectId: idSubject,
      SemesterId: semester.id,
      enrolled: req.body.enrolled,
      nick: req.body.nick,
      modality: req.body.modality,
      capacity: req.body.capacity,
      commission: req.body.commission,
      color: color
    }).success(function(course) {

      semester.addCourse(course)

      // Si hay horarios para el curso
      if(req.body.day) {
        // Tiene uno, sino una lista
        if(typeof req.body.day === "string") {
          db.CourseSchedule.newSchedule(course, req.body.day, req.body.hour, req.body.durationHour, req.body.type)
        } else {
          for(var i=0; i < req.body.day.length; i++) {
            db.CourseSchedule.newSchedule(course, req.body.day[i], req.body.hour[i], req.body.durationHour[i], req.body.type[i])
          }
        }
      }

      req.flash(typeMessage.SUCCESS,  'Curso creado correctamente')
      exports.new(req, res)
          
    }).error(function(err) {

      showErrors(req,err);
      res.redirect('back');

    })
  })

}


exports.update = function(req, res) {
  console.log(req.body)

  var id = req.params.id
  var year = req.body.year
  var semester = req.body.semester
  var idSubject = req.body.idSubject
  var color = req.body.color || 'blue' // color default

  db.Course.find(id).success(function(course) {
    if (course) { // if the record exists in the db
      course.updateAttributes({
        SubjectId: idSubject,
        enrolled: req.body.enrolled,
        nick: req.body.nick,
        modality: req.body.modality,
        capacity: req.body.capacity,
        commission: req.body.commission,
        color: color
      }).success(function(courseUpdated) {

        // TODO: update schedules?
        // Si hay horarios para el curso
        if(req.body.day) {
          // Tiene uno, sino una lista
          if(typeof req.body.day === "string") {
            if(!req.body.idSchedule) {
              db.CourseSchedule.newSchedule(course, req.body.day, req.body.hour, req.body.durationHour, req.body.type)
            }
          } else {
            for(var i=0; i < req.body.day.length; i++) {
              if(!req.body.idSchedule[i]) {
                db.CourseSchedule.newSchedule(course, req.body.day[i], req.body.hour[i], req.body.durationHour[i], req.body.type[i])
              }
            }
          }
        }
      
        res.redirect('course/list/'+year+'/'+semester)
        req.flash(typeMessage.SUCCESS, "El curso se ha guardado correctamente")

      }).error(function(err) {

        showErrors(req,err);
		res.redirect('back');

      })
    }
  })

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
	var courses = req.body.courses;
	var idTeacher= req.body.idTeacher;
	for(m=0;m< courses.length;m++){
		deallocateTeacher=function(course){
			db.Course.deallocateTeacher(course.id,idTeacher,function() {				
			});
		}
		deallocateTeacher(courses[m]);
	}
	res.send('ok');
};

exports.deallocateInstructor = function(req, res){
	var courses = req.body.idCourse;
	var idTeacher= req.body.idTeacher;
	
	for(m=0;m< courses.length;m++){
		deallocateTeacher=function(course){
			db.Course.deallocateInstructor(course.id,idTeacher,function() {				
			});
		}
		deallocateTeacher(courses[m]);
	}
	res.send('ok');
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




exports.updateCourseSchedule = function(req, res) {

  db.CourseSchedule.find(req.body.id).success(function(schedule) {
    schedule.updateAttributes({
      day: req.body.day,
      hour: req.body.hour,
      minutes:req.body.minutes,
    }).success(function() {
      res.send('ok')
    })
  })

}

exports.updateEnd = function(req, res) {
  //Actualiza el horario con el id correspondiente
  db.CourseSchedule.find(req.body.id).success(function(schedule) {
    schedule.updateAttributes({
		durationHour: req.body.durationHour,
		durationMinutes: req.body.durationMinutes,
		}).success(function() {	
			res.send('ok')
		})
  })

}


exports.assignedClassRoom = function(req, res) {

  var idClassRoom = req.body.idClassRoom
  var idCourseSchedule = req.body.idCourseSchedule
  var year = req.body.year
  var semester = req.body.semester
  
  db.CourseSchedule.assignedClassRoom(idClassRoom, idCourseSchedule, year, semester)

  res.send('ok')
}


exports.assignedTeacher = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
 	var year = req.body.year;
    var semester = req.body.semester;
	
	var teacherAssignedToACourses=function(courses){
		
		if(courses.length != 0){
			db.Semester.teacherAssignedToACourse(idTeacher,courses[0].id,semester,year,function(result) {
				courses.splice(0,1);
				teacherAssignedToACourses(courses);
			});
		}else{
			res.send('ok');
		}
	}
	teacherAssignedToACourses(idCourse);
  	//Asigna un teacher a un curso
}

exports.assignedInstructor = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourse = req.body.idCourse;
	var year = req.body.year;
    var semester = req.body.semester;
	 //Asigna un instructor a un curso
	//Por recursoion
	var instructorAssignedToACourses=function(courses){
		
		if(courses.length != 0){
			db.Semester.instructorAssignedToACourse(idTeacher,courses[0].id,semester,year,function(result) {
				courses.splice(0,1);
				instructorAssignedToACourses(courses);
			});
		}else{
			res.send('ok');
		}
	}
	instructorAssignedToACourses(idCourse);
}


exports.remove = function(req, res){

  var id = req.body.id

  db.Course.find(id).success(function(course) {
    if(course) {
      course.destroy().success(function(u) {
        res.send('ok');
      })
    }
  })

}

